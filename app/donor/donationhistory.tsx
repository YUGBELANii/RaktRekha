import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { Timestamp, collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebase';

const { width } = Dimensions.get('window');

type Donation = {
  id: string;
  location?: string;
  type?: string;
  receiver?: string;
  status?: string;
  date?: Timestamp | string;
};

export default function DonationHistoryScreen() {
  const user = getAuth().currentUser;
  const router = useRouter();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    try {
      if (!user) return;
      const historyRef = collection(db, 'users', user.uid, 'donations');
      const snapshot = await getDocs(historyRef);

      const data: Donation[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Donation[];

      const sorted = data.sort((a, b) => {
        const dateA = a.date instanceof Timestamp ? a.date.toDate() : new Date(a.date || '');
        const dateB = b.date instanceof Timestamp ? b.date.toDate() : new Date(b.date || '');
        return dateB.getTime() - dateA.getTime();
      });

      setDonations(sorted);
    } catch (err) {
      console.error('Failed to fetch history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const formatDate = (timestamp: Timestamp | string | undefined): string => {
    if (!timestamp) return 'N/A';
    let date: Date;

    try {
      date =
        timestamp instanceof Timestamp
          ? timestamp.toDate()
          : new Date(timestamp);
    } catch (e) {
      return 'Invalid Date';
    }

    return (
      date.toLocaleDateString() +
      ' at ' +
      date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.header}>Your Donation History</Text>

        {loading ? (
          <Text style={styles.infoText}>Loading...</Text>
        ) : donations.length === 0 ? (
          <Text style={styles.infoText}>No donations recorded yet.</Text>
        ) : (
          donations.map((donation, index) => (
            <View key={donation.id || index} style={styles.card}>
              <Text style={styles.label}>🏥 Location:</Text>
              <Text style={styles.value}>{donation.location || 'Not specified'}</Text>

              <Text style={styles.label}>📅 Date & Time:</Text>
              <Text style={styles.value}>{formatDate(donation.date)}</Text>

              <Text style={styles.label}>💉 Type:</Text>
              <Text style={styles.value}>{donation.type || 'N/A'}</Text>

              {donation.receiver && (
                <>
                  <Text style={styles.label}>👤 Receiver:</Text>
                  <Text style={styles.value}>{donation.receiver}</Text>
                </>
              )}

              <Text style={styles.label}>✅ Status:</Text>
              <Text
                style={[
                  styles.value,
                  {
                    color:
                      donation.status === 'Completed'
                        ? 'green'
                        : donation.status === 'Pending'
                        ? '#f90'
                        : '#333',
                  },
                ]}
              >
                {donation.status || 'Unknown'}
              </Text>
            </View>
          ))
        )}
      </ScrollView>

      <View style={styles.navBar}>
        <Tab icon="home" label="Home" path="/donor/home" />
        <Tab icon="medkit" label="Nearby Request" path="/donor/request" />
        <Tab icon="map" label="Nearby Camps" path="/donor/camps" />
        <Tab icon="settings" label="Settings" path="/donor/settings" />
      </View>
    </View>
  );
}

function Tab({ icon, label, path, active }: any) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.tabButton} onPress={() => router.push(path)}>
      <Ionicons name={icon} size={24} color={active ? '#e53935' : '#aaa'} />
      <Text style={[styles.label, active && { color: '#e53935' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f3f3',
    flex: 1,
  },
  header: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 16,
    marginBottom: 10,
    textAlign: 'center',
  },
  infoText: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
  card: {
    backgroundColor: '#fff',
    padding: 14,
    margin: 16,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    marginTop: 6,
    color: '#333',
  },
  value: {
    fontSize: 14,
    marginTop: 2,
    color: '#111',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
    zIndex: 10,
  },
  tabButton: {
    alignItems: 'center',
  },
});
