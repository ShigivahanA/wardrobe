import {
  createContext,
  useContext,
  useRef,
  useState,
} from 'react'
import {
  View,
  Text,
  StyleSheet,
  Animated,
} from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { spacing } from '@/src/theme/spacing'
import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'

type ToastType = 'success' | 'error' | 'info' | 'danger'

type ToastContextType = {
  show: (
    message: string,
    type?: ToastType,
    duration?: number
  ) => void
}

const ToastContext = createContext<ToastContextType | null>(
  null
)

export const useToast = () => {
  const ctx = useContext(ToastContext)
  if (!ctx)
    throw new Error(
      'useToast must be used inside ToastProvider'
    )
  return ctx
}

export function ToastProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const insets = useSafeAreaInsets()
  const { theme } = useTheme()
  const colors =
    theme === 'dark' ? darkColors : lightColors

  const translateY = useRef(new Animated.Value(-100))
    .current

  const [toast, setToast] = useState<{
    message: string
    type: ToastType
  } | null>(null)

  const show = (
    message: string,
    type: ToastType = 'info',
    duration = 2500
  ) => {
    setToast({ message, type })

    Animated.spring(translateY, {
      toValue: 0,
      useNativeDriver: true,
    }).start()

    setTimeout(() => {
      Animated.timing(translateY, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setToast(null))
    }, duration)
  }

  const config = {
    success: {
      icon: 'checkmark-circle',
      color: '#2ecc71',
    },
    error: {
      icon: 'close-circle',
      color: '#ff4d4f',
    },
    danger: {
      icon: 'warning',
      color: '#ff4d4f',
    },
    info: {
      icon: 'information-circle',
      color: '#3498db',
    },
  }

  return (
    <ToastContext.Provider value={{ show }}>
      {children}

      {toast && (
        <Animated.View
          style={[
            styles.toast,
            {
              top: insets.top + spacing.sm,
              backgroundColor: colors.surface,
              borderColor: colors.border,
              transform: [{ translateY }],
            },
          ]}
          pointerEvents="none"
        >
          <Ionicons
            name={config[toast.type].icon as any}
            size={18}
            color={config[toast.type].color}
          />
          <Text
            style={[
              styles.text,
              { color: colors.textPrimary },
            ]}
          >
            {toast.message}
          </Text>
        </Animated.View>
      )}
    </ToastContext.Provider>
  )
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    zIndex: 100,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.lg,
    borderRadius: 14,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '500',
    flex: 1,
  },
})
