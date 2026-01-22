import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from 'react-native'
import { useRouter } from 'expo-router'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'
import { useToast } from '@/src/components/Toast/ToastProvider'

const TAB_BAR_HEIGHT = 64

export default function EmptyState({
  onReset,
}: {
  onReset?: () => void
}) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const toast = useToast()

  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors

  return (
    <View
      style={[
        styles.container,
        {
          paddingBottom:
            insets.bottom + TAB_BAR_HEIGHT,
        },
      ]}
    >
      <View style={styles.content}>
        {/* Visual anchor */}
        <View
          style={[
            styles.iconWrap,
            {
              borderColor: colors.border,
            },
          ]}
        >
          <View
            style={[
              styles.icon,
              {
                borderColor: colors.textSecondary,
              },
            ]}
          />
        </View>

        {/* Text */}
        <Text
          style={[
            styles.title,
            { color: colors.textPrimary },
          ]}
        >
          Your wardrobe is empty
        </Text>

        <Text
          style={[
            styles.desc,
            { color: colors.textSecondary },
          ]}
        >
          This space is reserved for pieces you love.
          Upload your first item or adjust filters to begin curating.
        </Text>

        {/* Actions */}
        <View style={styles.actions}>
          {onReset && (
            <Pressable
              onPress={() => {
                Haptics.selectionAsync()
                onReset()
                toast.show('Filters cleared', 'info')
              }}
              style={[
                styles.secondary,
                {
                  borderColor: colors.border,
                },
              ]}
            >
              <Text
                style={[
                  styles.secondaryText,
                  { color: colors.textPrimary },
                ]}
              >
                Clear filters
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => {
              Haptics.selectionAsync()
              router.push('/upload')
            }}
            style={[
              styles.primary,
              { backgroundColor: colors.textPrimary },
            ]}
          >
            <Text
              style={[
                styles.primaryText,
                { color: colors.background },
              ]}
            >
              Add your first item
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  content: {
    alignItems: 'center',
  },

  iconWrap: {
    marginBottom: spacing.lg,
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  icon: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 1,
    borderStyle: 'dashed',
  },

  title: {
    fontSize: 17,
    fontWeight: '600',
    marginBottom: 6,
  },

  desc: {
    fontSize: 13,
    textAlign: 'center',
    maxWidth: 280,
  },

  actions: {
    marginTop: spacing.lg,
    gap: spacing.sm,
    width: '100%',
  },

  secondary: {
    borderWidth: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },

  secondaryText: {
    fontSize: 14,
  },

  primary: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },

  primaryText: {
    fontSize: 14,
    fontWeight: '500',
  },
})
