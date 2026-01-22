import { useState } from 'react'
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  Modal,
  ScrollView,
} from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import type { WardrobeCategory } from '../../services/wardrobeService'
import { lightColors, darkColors } from '../../theme/colors'
import { spacing } from '../../theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'

const CATEGORIES: WardrobeCategory[] = [
  'tshirt',
  'shirt',
  'top',
  'blouse',
  'tank_top',
  'sweater',
  'hoodie',
  'jacket',
  'coat',
  'blazer',
  'jeans',
  'pants',
  'shorts',
  'skirt',
  'leggings',
  'joggers',
  'dress',
  'jumpsuit',
  'romper',
  'overalls',
  'kurta',
  'saree',
  'lehenga',
  'salwar',
  'dhoti',
  'shoes',
  'sneakers',
  'sandals',
  'heels',
  'flats',
  'boots',
  'school_uniform',
  'sleepwear',
  'onesie',
  'innerwear',
  'nightwear',
  'loungewear',
  'cap',
  'hat',
  'scarf',
  'belt',
  'socks',
  'other',
]

type Props = {
  value: WardrobeCategory | null
  onSelect: (c: WardrobeCategory) => void
}

export function CategorySelector({ value, onSelect }: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const insets = useSafeAreaInsets()
  const [open, setOpen] = useState(false)

  const handleSelect = async (c: WardrobeCategory) => {
    await Haptics.selectionAsync()
    onSelect(c)
    setOpen(false)
  }

  return (
    <>
      {/* Field */}
      <Pressable
        onPress={() => setOpen(true)}
        style={[
          styles.field,
          {
            borderColor: colors.border,
            backgroundColor: colors.surface,
          },
        ]}
      >
        <Text
          style={[
            styles.fieldText,
            {
              color: value
                ? colors.textPrimary
                : colors.textSecondary,
            },
          ]}
        >
          {value ? value.replace(/_/g, ' ') : 'Select category'}
        </Text>
        <Text style={{ color: colors.textSecondary }}>▾</Text>
      </Pressable>

      {/* Bottom Sheet */}
      <Modal
        visible={open}
        animationType="slide"
        transparent
        onRequestClose={() => setOpen(false)}
      >
        {/* ✅ Backdrop must cover FULL screen */}
        <Pressable
          style={styles.backdrop}
          onPress={() => setOpen(false)}
        />

        {/* ✅ Sheet only is height-limited */}
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: colors.background,
              paddingBottom: insets.bottom + spacing.md,
            },
          ]}
        >
          <Text
            style={[
              styles.title,
              { color: colors.textPrimary },
            ]}
          >
            Choose category
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            overScrollMode="never"
            bounces={false}
          >
            {CATEGORIES.map((c) => {
              const active = c === value

              return (
                <Pressable
                  key={c}
                  onPress={() => handleSelect(c)}
                  style={[
                    styles.option,
                    active && {
                      backgroundColor: colors.surface,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: active
                        ? colors.textPrimary
                        : colors.textSecondary,
                      fontWeight: active ? '600' : '400',
                      textTransform: 'capitalize',
                    }}
                  >
                    {c.replace(/_/g, ' ')}
                  </Text>
                </Pressable>
              )
            })}
          </ScrollView>
        </View>
      </Modal>
    </>
  )
}

/* ======================
   Styles
====================== */
const styles = StyleSheet.create({
  field: {
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  fieldText: {
    fontSize: 14,
    textTransform: 'capitalize',
  },

  /* ✅ FULL SCREEN backdrop */
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
  },

  /* ✅ ONLY sheet is constrained */
  sheet: {
    maxHeight: '50%',
    padding: spacing.lg,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: spacing.md,
  },

  option: {
    paddingVertical: 14,
    paddingHorizontal: spacing.sm,
    borderRadius: 12,
  },
})
