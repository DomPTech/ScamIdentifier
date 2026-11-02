export interface TokenizerConfig {
  lowercase?: boolean;
  token_pattern?: string;
  ngram_range?: [number, number];
  sublinear_tf?: boolean;
  max_chars?: number;
}

export interface ScamModelMeta {
  dataset?: string;
  n_train?: number;
  n_test?: number;
  n_features?: number;
  C?: number;
  threshold?: number;
  test_roc_auc?: number;
  test_precision_scam?: number;
  test_recall_scam?: number;
  test_f1_scam?: number;
  test_accuracy?: number;
  trained_at?: string;
  [key: string]: unknown;
}

export interface ScamModelData {
  format: string;
  tokenizer: TokenizerConfig;
  intercept: number;
  terms: string[];
  idf: number[];
  coef: number[];
  meta?: ScamModelMeta;
  inference?: string;
}

export interface PredictionResult {
  isScam: boolean;
  probability: number;
  score: number;
}

export class ScamClassifier {
  private model: ScamModelData | null = null;
  private vocab = new Map<string, number>();

  constructor(modelData?: ScamModelData) {
    if (modelData) {
      this.loadModel(modelData);
    }
  }

  get isLoaded(): boolean {
    return this.model !== null;
  }

  loadModel(data: ScamModelData): void {
    if (!data.terms || !data.idf || !data.coef || typeof data.intercept !== 'number') {
      throw new Error('Invalid model schema: terms, idf, coef, and intercept are required.');
    }

    if (data.terms.length !== data.idf.length || data.terms.length !== data.coef.length) {
      throw new Error('Mismatched model dimensions between terms, idf, and coef.');
    }

    this.model = data;
    this.vocab.clear();
    for (let i = 0; i < data.terms.length; i++) {
      this.vocab.set(data.terms[i], i);
    }
  }

  loadBundledModel(): void {
    // Lazy require defers parsing 1.6MB JSON until explicitly requested
    const bundledModelData = require('./scam_model.json') as ScamModelData;
    this.loadModel(bundledModelData);
  }

  async fetchModel(url?: string, init?: RequestInit): Promise<void> {
    if (!url) {
      this.loadBundledModel();
      return;
    }

    const res = await fetch(url, init);
    if (!res.ok) {
      throw new Error(`Failed to fetch model from ${url}: ${res.status} ${res.statusText}`);
    }

    const data = (await res.json()) as ScamModelData;
    this.loadModel(data);
  }

  predict(text: string, customThreshold?: number): PredictionResult {
    if (!this.model) {
      throw new Error('Model is not loaded. Call fetchModel(), loadBundledModel(), or loadModel() first.');
    }

    const maxChars = this.model.tokenizer?.max_chars ?? 3000;
    // Scikit-learn feature extraction degrades on extreme payload sizes
    const boundedText = text.slice(0, maxChars);
    const shouldLowercase = this.model.tokenizer?.lowercase ?? true;
    const normalized = shouldLowercase ? boundedText.toLowerCase() : boundedText;

    const tokens = normalized.match(/\b\w\w+\b/g) || [];
    const minNgram = this.model.tokenizer?.ngram_range?.[0] ?? 1;
    const maxNgram = this.model.tokenizer?.ngram_range?.[1] ?? 2;

    const counts = new Map<number, number>();

    if (minNgram <= 1 && maxNgram >= 1) {
      for (let i = 0; i < tokens.length; i++) {
        const idx = this.vocab.get(tokens[i]);
        if (idx !== undefined) {
          counts.set(idx, (counts.get(idx) || 0) + 1);
        }
      }
    }

    if (maxNgram >= 2) {
      for (let i = 0; i < tokens.length - 1; i++) {
        const bigram = `${tokens[i]} ${tokens[i + 1]}`;
        const idx = this.vocab.get(bigram);
        if (idx !== undefined) {
          counts.set(idx, (counts.get(idx) || 0) + 1);
        }
      }
    }

    const intercept = this.model.intercept;
    const threshold = customThreshold ?? this.model.meta?.threshold ?? 0.5;

    if (counts.size === 0) {
      const prob = 1 / (1 + Math.exp(-intercept));
      return {
        isScam: prob >= threshold,
        probability: prob,
        score: intercept,
      };
    }

    const sublinearTf = this.model.tokenizer?.sublinear_tf ?? true;
    let sumSq = 0;
    const entries: { idx: number; weight: number }[] = [];

    for (const [idx, count] of counts.entries()) {
      const tf = sublinearTf ? 1 + Math.log(count) : count;
      const weight = tf * this.model.idf[idx];
      entries.push({ idx, weight });
      sumSq += weight * weight;
    }

    const norm = Math.sqrt(sumSq);
    let dot = 0;
    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      dot += this.model.coef[entry.idx] * (entry.weight / norm);
    }

    const score = intercept + dot;
    const probability = 1 / (1 + Math.exp(-score));

    return {
      isScam: probability >= threshold,
      probability,
      score,
    };
  }

  static fromBundled(): ScamClassifier {
    const classifier = new ScamClassifier();
    classifier.loadBundledModel();
    return classifier;
  }
}
