import { View, StyleSheet } from 'react-native'
import ColorPicker, {
  Panel1,
  HueSlider,
  Preview,
} from 'reanimated-color-picker'

import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

type Props = {
  selected: string[]
  onSelect: (color: string) => void
}

export default function ManualColorPicker({
  selected,
  onSelect,
}: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View
      style={[
        styles.wrap,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
        },
      ]}
    >
      <ColorPicker
        value={selected[selected.length - 1] ?? '#ffffff'}
        sliderThickness={20}
        thumbSize={24}
        onComplete={({ hex }) => {
          onSelect(hex)
        }}
      >
        <Preview style={styles.preview} />
        <Panel1 style={styles.panel} />
        <HueSlider style={styles.slider} />
      </ColorPicker>
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 16,
    borderWidth: 1,
    gap: spacing.md,
  },
  preview: {
    height: 40,
    borderRadius: 8,
    marginBottom: spacing.md,
  },
  panel: {
    height: 180,
    borderRadius: 12,
    marginBottom: spacing.md,
  },
  slider: {
    borderRadius: 999,
  },
})
