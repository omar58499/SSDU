import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';

export default function AccountScreen() {
  const { user, role, login, register, logout } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }
    try {
      setLoading(true);
      await login(email.trim(), password);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      Alert.alert('Login failed', error?.message ?? 'Unable to login.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Missing fields', 'Email and password are required.');
      return;
    }
    try {
      setLoading(true);
      await register(email.trim(), password);
      setEmail('');
      setPassword('');
    } catch (error: any) {
      Alert.alert('Registration failed', error?.message ?? 'Unable to register.');
    } finally {
      setLoading(false);
    }
  };

  if (user) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>My Account</Text>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{role ?? 'user'}</Text>

          <Pressable style={[styles.button, styles.logoutButton]} onPress={logout}>
            <Text style={styles.buttonText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Login</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <Pressable style={[styles.button, loading && styles.buttonDisabled]} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>
        <Pressable style={[styles.button, styles.secondaryButton, loading && styles.buttonDisabled]} onPress={handleRegister} disabled={loading}>
          <Text style={[styles.buttonText, styles.secondaryText]}>Create Account</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    color: '#666',
    marginTop: 12,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    backgroundColor: '#fafafa',
  },
  button: {
    backgroundColor: '#1f6feb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#1f6feb',
  },
  secondaryText: {
    color: '#1f6feb',
  },
  logoutButton: {
    marginTop: 24,
  },
});
