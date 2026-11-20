import { View, type ViewProps, type ViewStyle } from 'react-native';

export interface StackProps extends ViewProps {
  align?: ViewStyle['alignItems'];
  justify?: ViewStyle['justifyContent'];
  spacing?: number;
  wrap?: ViewStyle['flexWrap'];
}

export function VStack({ align, justify, spacing, wrap, style, ...props }: StackProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'column',
          alignItems: align,
          justifyContent: justify,
          gap: spacing,
          flexWrap: wrap,
        },
        style,
      ]}
      {...props}
    />
  );
}

export function HStack({ align, justify, spacing, wrap, style, ...props }: StackProps) {
  return (
    <View
      style={[
        {
          flexDirection: 'row',
          alignItems: align,
          justifyContent: justify,
          gap: spacing,
          flexWrap: wrap,
        },
        style,
      ]}
      {...props}
    />
  );
}
