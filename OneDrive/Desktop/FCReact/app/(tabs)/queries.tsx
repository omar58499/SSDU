import { useRouter } from 'expo-router';
import { collection, onSnapshot, orderBy, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Pressable, StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/context/AuthContext';
import { db } from '@/lib/firebase';

type QueryItem = {
  id: string;
  text: string;
  status: 'pending' | 'true' | 'false';
};

export default function MyQueriesScreen() {
  const { user } = useAuth();
  const router = useRouter();
  const [queries, setQueries] = useState<QueryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setQueries([]);
      setLoading(false);
      return;
    }

    const queryRef = query(
      collection(db, 'queries'),
      where('userId', '==', user.uid),
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
  }, [user]);

  if (!user) {
    return (
      <View style={styles.centered}>
        <Text style={styles.helperText}>Please log in to view your queries.</Text>
        <Pressable style={styles.button} onPress={() => router.push('/(tabs)/account')}>
          <Text style={styles.buttonText}>Go to Login</Text>
        </Pressable>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text style={styles.helperText}>Loading your queries...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={queries}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={<Text style={styles.helperText}>No queries submitted yet.</Text>}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.queryText}>{item.text}</Text>
            <Text style={styles.status}>Status: {item.status}</Text>
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
    marginBottom: 8,
  },
  status: {
    fontSize: 13,
    color: '#666',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  helperText: {
    color: '#666',
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#1f6feb',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
});
