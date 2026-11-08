import AsyncStorage from '@react-native-async-storage/async-storage';

export interface TrustedContact {
  id: string;
  name: string;
  phone: string;
}

const KEY = 'trusted_contacts';
export const MAX_CONTACTS = 5;

export async function getContacts(): Promise<TrustedContact[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as TrustedContact[]) : [];
}

export async function addContact(name: string, phone: string): Promise<TrustedContact> {
  const existing = await getContacts();
  if (existing.length >= MAX_CONTACTS) {
    throw new Error(`Maximum of ${MAX_CONTACTS} trusted contacts allowed.`);
  }
  const contact: TrustedContact = { id: Math.random().toString(36).slice(2), name: name.trim(), phone: phone.trim() };
  await AsyncStorage.setItem(KEY, JSON.stringify([...existing, contact]));
  return contact;
}

export async function removeContact(id: string): Promise<void> {
  const existing = await getContacts();
  await AsyncStorage.setItem(KEY, JSON.stringify(existing.filter(c => c.id !== id)));
}

