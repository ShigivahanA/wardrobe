// components/common/ChipSelector.tsx
import { View, Text, Pressable, StyleSheet } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

type Props<T extends string> = {
  value: T
  options: T[]
  onChange: (v: T) => void
}

export default function ChipSelector<T extends string>({
  value,
  options,
  onChange,
}: Props<T>) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View style={styles.wrap}>
      {options.map(option => {
        const active = option === value

        return (
          <Pressable
            key={option}
            onPress={async () => {
              await Haptics.selectionAsync()
              onChange(option)
            }}
            style={[
              styles.chip,
              {
                backgroundColor: active
                  ? colors.textPrimary
                  : colors.surface,
                borderColor: active
                  ? colors.textPrimary
                  : colors.border,
              },
            ]}
          >
            <Text
              style={[
                styles.text,
                {
                  color: active
                    ? colors.background
                    : colors.textPrimary,
                  fontWeight: active ? '600' : '400',
                },
              ]}
            >
              {option}
            </Text>
          </Pressable>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
  },

  text: {
    fontSize: 13,
    textTransform: 'capitalize',
  },
})
