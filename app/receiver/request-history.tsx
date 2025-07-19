import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  Timestamp,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebase';

// ✅ Define expected request item shape
type RequestItem = {
  id: string;
  bloodGroup: string;
  units: number;
  status: string;
  createdAt: Timestamp;
  notes?: string;
};

export default function RequestHistoryScreen() {
  const [history, setHistory] = useState<RequestItem[]>([]);
  const router = useRouter();

  useEffect(() => {
    const user = auth.currentUser;
    if (!user) return;

    const q = query(
      collection(db, 'bloodRequests'),
      where('uid', '==', user.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const requests: RequestItem[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          bloodGroup: data.bloodGroup,
          units: data.units,
          status: data.status,
          createdAt: data.createdAt,
          notes: data.notes,
        };
      });
      setHistory(requests);
    });

    return () => unsubscribe();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your Request History</Text>
      <FlatList
        data={history}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.group}>
              {item.bloodGroup} • {item.units} Units
            </Text>
            <Text style={styles.status}>Status: {item.status}</Text>
            <Text style={styles.date}>
              {item.createdAt?.toDate().toDateString()}
            </Text>
            <Text style={styles.note}>{item.notes}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={{ textAlign: 'center', color: '#888' }}>
            No requests yet
          </Text>
        }
      />

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/home')}>
          <Ionicons name="home" size={24} color="#aaa" />
          <Text style={styles.labelNav}>Home</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/request')}>
          <Ionicons name="medkit" size={24} color="#aaa" />
          <Text style={styles.labelNav}>Request</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push('/receiver/nearbydonor')}
        >
          <Ionicons name="people" size={24} color="#aaa" />
          <Text style={styles.labelNav}>Donors</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.tabButton}
          onPress={() => router.push('/receiver/settings')}
        >
          <Ionicons name="settings" size={24} color="#aaa" />
          <Text style={styles.labelNav}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#fff', flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#e53935', marginBottom: 16 },
  card: {
    backgroundColor: '#fdfdfd',
    padding: 14,
    borderRadius: 10,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#eee',
  },
  group: { fontSize: 16, fontWeight: '600', color: '#333' },
  status: { color: '#444', marginTop: 4 },
  date: { color: '#666', fontSize: 12, marginTop: 2 },
  note: { marginTop: 6, color: '#555' },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  tabButton: { alignItems: 'center' },
  labelNav: { fontSize: 12, marginTop: 4, color: '#444' },
});
