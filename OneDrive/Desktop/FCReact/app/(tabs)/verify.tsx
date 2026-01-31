import { useRouter } from 'expo-router';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

export default function VerifyScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!user) {
      router.push('/(tabs)/account');
      return;
    }

    if (!text.trim()) {
      Alert.alert('Missing details', 'Please enter the news or claim to verify.');
      return;
    }

    try {
      setSubmitting(true);
      await addDoc(collection(db, 'queries'), {
        userId: user.uid,
        text: text.trim(),
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      setText('');
      Alert.alert('Submitted', 'Your query was sent for verification.');
    } catch (error) {
      Alert.alert('Error', 'Could not submit your query.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.card}>
        <Text style={styles.title}>Verify a News Claim</Text>
        <Text style={styles.subtitle}>Paste the news, claim, or link you want verified.</Text>

        <TextInput
          style={styles.input}
          placeholder="Type or paste the news here..."
          value={text}
          onChangeText={setText}
          multiline
          textAlignVertical="top"
        />

        {!user && (
          <Text style={styles.helperText}>
            You can view news without logging in, but to submit a query you need to sign in.
          </Text>
        )}

        <Pressable style={[styles.button, submitting && styles.buttonDisabled]} onPress={handleSubmit} disabled={submitting}>
          <Text style={styles.buttonText}>{user ? 'Submit Query' : 'Login to Submit'}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f7f7f7',
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  input: {
    minHeight: 140,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    backgroundColor: '#fafafa',
  },
  helperText: {
    marginTop: 12,
    color: '#666',
  },
  button: {
    marginTop: 16,
    backgroundColor: '#1f6feb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
