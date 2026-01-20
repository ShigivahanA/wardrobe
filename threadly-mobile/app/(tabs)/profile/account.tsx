import { useEffect, useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import * as Haptics from 'expo-haptics'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

import { useTheme } from '@/src/theme/ThemeProvider'
import { lightColors, darkColors } from '@/src/theme/colors'
import { spacing } from '@/src/theme/spacing'

import profileService from '@/src/services/profileService'
import authService from '@/src/services/authService'
import PrimaryButton from '@/src/components/auth/PrimaryButton'
import ProfileHeader from '@/src/components/Profile/ProfileHeader'
import { useToast } from '@/src/components/Toast/ToastProvider'



export default function AccountScreen() {
  const router = useRouter()
  const { theme } = useTheme()
  const colors = theme === 'dark' ? darkColors : lightColors
  const toast = useToast()

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [sessions, setSessions] = useState<any[]>([])

  /* ---------------- Load profile ---------------- */
  useEffect(() => {
    let mounted = true

    const load = async () => {
      try {
        const res = await profileService.getProfile()
        if (!mounted) return

        setName(res.name)
        setEmail(res.email)
        setSessions(res.sessions || [])
      } catch {
        Alert.alert('Error', 'Failed to load profile')
      } finally {
        mounted && setLoading(false)
      }
    }

    load()
    return () => {
      mounted = false
    }
  }, [])

  /* ---------------- Save profile ---------------- */
  const saveProfile = async () => {
    if (!name.trim()) return
    setSaving(true)

    try {
      await profileService.updateProfile({ name })
      Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      )
      toast.show('Profile updated successfully', 'success')
    } catch {
      Alert.alert('Error', 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  /* ---------------- Terminate session ---------------- */
  const terminateSession = async (id: string) => {
    try {
      await profileService.terminateSession(id)
      setSessions(prev => prev.filter(s => s.id !== id))
    } catch {
      Alert.alert('Error', 'Failed to terminate session')
    }
  }

  /* ---------------- Delete account ---------------- */
  const deleteAccount = async () => {
    Alert.alert(
      'Delete account',
      'This action is permanent.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await profileService.deleteAccount()
            await authService.logout()
          },
        },
      ]
    )
  }

  if (loading) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.background }}
      />
    )
  }

  return (
    <SafeAreaView
      style={[
        styles.safe,
        { backgroundColor: colors.background },
      ]}
    >
      {/* ---------- Header ---------- */}
      <View style={styles.header}>
              <ProfileHeader loading={loading} />
        </View>
      {/* ---------- Content ---------- */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.content,
          {
            paddingBottom:
              spacing.xxl + 80, // room for floating pill bar
          },
        ]}
      >
        <Card colors={colors}>
          <Field label="Name" colors={colors}>
            <TextInput
              value={name}
              onChangeText={setName}
              style={[
                styles.input,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                  color: colors.textPrimary,
                },
              ]}
            />
          </Field>

          <Field label="Email" colors={colors}>
            <Text style={{ color: colors.textSecondary }}>
              {email}
            </Text>
          </Field>

          <PrimaryButton
            title="Save changes"
            onPress={saveProfile}
            loading={saving}
          />
        </Card>

        <Card colors={colors} title="Active sessions">
          {sessions.length === 0 ? (
            <Text style={{ color: colors.textSecondary }}>
              This is your only session.
            </Text>
          ) : (
            sessions.map(s => (
              <View
                key={s.id}
                style={[
                  styles.session,
                  { borderColor: colors.border },
                ]}
              >
                <View>
                  <Text style={{ color: colors.textPrimary }}>
                    {s.device || 'Unknown device'}
                  </Text>
                  <Text
                    style={{
                      fontSize: 12,
                      color: colors.textSecondary,
                    }}
                  >
                    {s.ip}
                  </Text>
                </View>

                <Pressable
                  onPress={() => terminateSession(s.id)}
                >
                  <Text style={{ color: '#ff4d4f' }}>
                    Log out
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </Card>

        <Card colors={colors} title="Your data">
          <Pressable onPress={profileService.exportData}>
            <Text style={{ color: colors.textPrimary }}>
              Export my data
            </Text>
          </Pressable>
        </Card>

        <Card colors={colors} danger title="Danger zone">
          <Pressable onPress={deleteAccount}>
            <Text style={{ color: '#ff4d4f' }}>
              Delete account
            </Text>
          </Pressable>
        </Card>
      </ScrollView>
    </SafeAreaView>
  )
}

/* ================= UI Components ================= */

const Card = ({
  title,
  children,
  colors,
  danger,
}: any) => (
  <View
    style={[
      styles.card,
      {
        backgroundColor: colors.surface,
        borderColor: danger
          ? 'rgba(255,77,79,0.4)'
          : colors.border,
      },
    ]}
  >
    {title && (
      <Text
        style={[
          styles.cardTitle,
          {
            color: danger
              ? '#ff4d4f'
              : colors.textSecondary,
          },
        ]}
      >
        {title}
      </Text>
    )}
    <View style={{ gap: spacing.md }}>{children}</View>
  </View>
)

const Field = ({
  label,
  children,
  colors,
}: any) => (
  <View style={{ gap: 6 }}>
    <Text
      style={{
        fontSize: 12,
        color: colors.textSecondary,
      }}
    >
      {label}
    </Text>
    {children}
  </View>
)

/* ================= Styles ================= */

const styles = StyleSheet.create({
 safe: {
    flex: 1,
  },

  header: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.sm,
    paddingBottom: spacing.lg,
  },

  content: {
    paddingHorizontal: spacing.xl,
    paddingTop: spacing.lg,
    gap: spacing.lg,
  },

  card: {
    borderWidth: 1,
    borderRadius: 16,
    padding: spacing.lg,
    gap: spacing.md,
  },

  cardTitle: {
    fontSize: 12,
    letterSpacing: 1.4,
    textTransform: 'uppercase',
  },

  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },

  session: {
    borderWidth: 1,
    borderRadius: 12,
    padding: spacing.md,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
})
