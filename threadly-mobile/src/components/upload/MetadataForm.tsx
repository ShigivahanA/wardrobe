import { View, Text, StyleSheet, Switch } from 'react-native'
import * as Haptics from 'expo-haptics'
import { useTheme } from '@/src/theme/ThemeProvider'
import { spacing } from '../../theme/spacing'
import { lightColors, darkColors } from '../../theme/colors'
import Field from '../auth/Field'
import { CategorySelector } from './CategorySelector'
import ChipSelector from '@/src/components/upload/ChipSelector'
import type {
  WardrobeCategory,
  WardrobeOccasion,
  WardrobeSeason,
} from '../../services/wardrobeService'

/* ======================
   Constants
====================== */
const OCCASIONS: WardrobeOccasion[] = [
  'casual',
  'formal',
  'party',
  'ethnic',
  'sports',
  'other',
]

const SEASONS: WardrobeSeason[] = ['summer', 'winter', 'all']

/* ======================
   Types
====================== */
export type UploadMetaDraft = {
  category: WardrobeCategory | null
  size: string
  colors: string[]
  brand: string
  occasion: WardrobeOccasion[]   // ✅ multi-select
  season: WardrobeSeason[]       // ✅ multi-select
  isFavorite: boolean
  tags: string[]
  notes: string
}

type Props = {
  meta: UploadMetaDraft
  setMeta: (v: UploadMetaDraft) => void
}

/* ======================
   Component
====================== */
export default function MetadataForm({ meta, setMeta }: Props) {
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  const toggleArrayValue = async <T extends string>(
    key: 'occasion' | 'season',
    value: T
  ) => {
    await Haptics.selectionAsync()

    setMeta({
      ...meta,
      [key]: meta[key].includes(value)
        ? meta[key].filter(v => v !== value)
        : [...meta[key], value],
    })
  }

  return (
    <View style={styles.wrap}>
      {/* Category */}
      <CategorySelector
        value={meta.category}
        onSelect={(c) =>
          setMeta({ ...meta, category: c })
        }
      />

      {/* Size */}
      <Field
        label="Size"
        value={meta.size}
        onChangeText={(v) =>
          setMeta({ ...meta, size: v })
        }
        placeholder="M / 32 / XL"
      />

      {/* Brand */}
      <Field
        label="Brand"
        value={meta.brand}
        onChangeText={(v) =>
          setMeta({ ...meta, brand: v })
        }
      />

      {/* Occasion (multi-select) */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Occasion
      </Text>

      <ChipSelector<WardrobeOccasion>
        value={meta.occasion}
        options={OCCASIONS}
        multiple
        onChange={(occasion) =>
          toggleArrayValue('occasion', occasion)
        }
      />

      {/* Season (multi-select) */}
      <Text style={[styles.label, { color: colors.textSecondary }]}>
        Season
      </Text>

      <ChipSelector<WardrobeSeason>
        value={meta.season}
        options={SEASONS}
        multiple
        onChange={(season) =>
          toggleArrayValue('season', season)
        }
      />

      {/* Favorite */}
      <View style={styles.favoriteRow}>
        <Text style={{ color: colors.textPrimary }}>
          Mark as favorite
        </Text>
        <Switch
          value={meta.isFavorite}
          onValueChange={(v) =>
            setMeta({ ...meta, isFavorite: v })
          }
          trackColor={{
            false: colors.border,
            true: colors.textPrimary,
          }}
          thumbColor={colors.background}
        />
      </View>

      {/* Notes */}
      <Field
        label="Notes"
        value={meta.notes}
        onChangeText={(v) =>
          setMeta({ ...meta, notes: v })
        }
        multiline
        style={styles.notes}
      />
    </View>
  )
}

/* ======================
   Styles
====================== */
const styles = StyleSheet.create({
  wrap: {
    gap: spacing.lg,
  },

  label: {
    fontSize: 13,
    fontWeight: '500',
    marginBottom: 4,
  },

  favoriteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },

  notes: {
    height: 100,
    textAlignVertical: 'top',
  },
})
