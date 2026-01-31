import { addDoc, collection, doc, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

type QueryItem = {
  id: string;
  text: string;
  userId: string;
  status: 'pending' | 'true' | 'false';
};

export default function CheckQueriesScreen() {
  const { role } = useAuth();
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [articleTitle, setArticleTitle] = useState('');
  const [articleSummary, setArticleSummary] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const queryRef = query(
      collection(db, 'queries'),
      where('status', '==', 'pending'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(queryRef, (snapshot) => {
      const items = snapshot.docs.map((docSnap) => ({
        id: docSnap.id,
        ...(docSnap.data() as Omit<QueryItem, 'id'>),
      }));
      setQueries(items);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const markTrue = async (item: QueryItem) => {
    try {
      setSubmitting(true);
      await updateDoc(doc(db, 'queries', item.id), {
        status: 'true',
        resolvedAt: serverTimestamp(),
      });
    } catch {
      Alert.alert('Error', 'Unable to update this query.');
    } finally {
      setSubmitting(false);
    }
  };

  const markFalse = async (item: QueryItem) => {
    if (!articleTitle.trim() || !articleSummary.trim()) {
      Alert.alert('Missing article', 'Provide a title and summary for the fact check article.');
      return;
    }

    try {
      setSubmitting(true);
      const articleRef = await addDoc(collection(db, 'news'), {
        title: articleTitle.trim(),
        summary: articleSummary.trim(),
        createdAt: serverTimestamp(),
        createdByAdmin: true,
      });

      await updateDoc(doc(db, 'queries', item.id), {
        status: 'false',
        resolvedAt: serverTimestamp(),
        articleId: articleRef.id,
      });

      setSelectedId(null);
      setArticleTitle('');
      setArticleSummary('');
    } catch {
      Alert.alert('Error', 'Unable to update this query.');
    } finally {
      setSubmitting(false);
    }
  };

  if (role !== 'admin') {
    return (
      <View style={styles.centered}>
        <Text style={styles.helperText}>Admin access only.</Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.helperText}>Loading queries...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={queries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.helperText}>No pending queries.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.queryText}>{item.text}</Text>
            <View style={styles.buttonRow}>
              <Pressable style={[styles.button, styles.trueButton]} onPress={() => markTrue(item)} disabled={submitting}>
                <Text style={styles.buttonText}>True</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.falseButton]}
                onPress={() => setSelectedId(selectedId === item.id ? null : item.id)}
                disabled={submitting}
              >
                <Text style={styles.buttonText}>False</Text>
              </Pressable>
            </View>

            {selectedId === item.id && (
              <View style={styles.articleForm}>
                <TextInput
                  style={styles.input}
                  placeholder="Article title"
                  value={articleTitle}
                  onChangeText={setArticleTitle}
                />
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Article summary"
                  value={articleSummary}
                  onChangeText={setArticleSummary}
                  multiline
                />
                <Pressable
                  style={[styles.button, styles.submitButton]}
                  onPress={() => markFalse(item)}
                  disabled={submitting}
                >
                  <Text style={styles.buttonText}>Publish Article & Mark False</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f7f7',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  queryText: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  trueButton: {
    backgroundColor: '#16a34a',
  },
  falseButton: {
    backgroundColor: '#dc2626',
  },
  submitButton: {
    backgroundColor: '#1f6feb',
    marginTop: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  articleForm: {
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#fafafa',
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  helperText: {
    color: '#666',
  },
});
