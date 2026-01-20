import { View, Text, Pressable, StyleSheet } from 'react-native'
import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

type Props = {
  colors: string[]
  onRemove: (color: string) => void
  onManualPick: () => void
}

export default function ExtractedColors({
  colors,
  onRemove,
  onManualPick,
}: Props) {
  const { theme } = useTheme()
  const palette = theme === 'dark' ? darkColors : lightColors

  if (colors.length === 0) return null

  return (
    <View style={styles.wrap}>
      <Text style={[styles.label, { color: palette.textSecondary }]}>
        Detected colors
      </Text>

      <View style={styles.row}>
        {colors.map((c) => (
          <Pressable
            key={c}
            onPress={() => onRemove(c)}
            style={[
              styles.chip,
              {
                backgroundColor: c,
                borderColor: palette.border,
              },
            ]}
          >
            <Text style={styles.remove}>×</Text>
          </Pressable>
        ))}
      </View>

      <Pressable onPress={onManualPick}>
        <Text
          style={[
            styles.manual,
            { color: palette.textSecondary },
          ]}
        >
          Not accurate? Pick colors manually
        </Text>
      </Pressable>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    gap: spacing.sm,
  },
  label: {
    fontSize: 13,
    fontWeight: '500',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  chip: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  remove: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  manual: {
    fontSize: 13,
    marginTop: 4,
    textDecorationLine: 'underline',
  },
})
