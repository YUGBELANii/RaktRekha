import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../firebase';

const { width } = Dimensions.get('window');

export default function DonorNearbyRequest() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [request, setRequest] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        await fetchNearbyRequest(currentUser);
      } else {
        alert("Please log in first.");
        router.replace('/signin');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const fetchNearbyRequest = async (currentUser: any) => {
    if (!currentUser) return;

    try {
      const userDocRef = doc(db, 'users', currentUser.uid);
      const userSnap = await getDoc(userDocRef);

      if (!userSnap.exists()) {
        console.warn('No user data found');
        return;
      }

      const userData = userSnap.data();
      const bloodGroup = userData?.bloodGroup;

      if (!bloodGroup) {
        alert("Please update your blood group in settings.");
        return;
      }

      const q = query(
        collection(db, 'requests'),
        where('status', '==', 'pending'),
        where('bloodGroup', '==', bloodGroup)
      );

      const querySnap = await getDocs(q);
      const openRequests = querySnap.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      if (openRequests.length > 0) {
        setRequest(openRequests[0]);
      } else {
        setRequest(null);
      }
    } catch (err) {
      console.error('Error fetching nearby requests:', err);
    }
  };

  const handleDonate = async () => {
    if (!request || !user) return;

    try {
      await updateDoc(doc(db, 'requests', request.id), {
        status: 'accepted',
        acceptedBy: user.uid,
      });
      Alert.alert("Success", "You have accepted the donation request.");
      setRequest(null);
      await fetchNearbyRequest(auth.currentUser);
    } catch (err) {
      console.error('Error accepting donation:', err);
    }
  };

  const handleSkip = async () => {
    if (!request) return;

    try {
      await updateDoc(doc(db, 'requests', request.id), {
        status: 'skipped',
      });
      setRequest(null);
      await fetchNearbyRequest(auth.currentUser);
    } catch (err) {
      console.error('Error skipping request:', err);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginTop: 100 }}>Loading nearby requests...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.card}>
          <Text style={styles.title}>Nearby Blood Requirement</Text>
          <View style={styles.mapPlaceholder}>
            <Text>🗺️ Map preview placeholder</Text>
            <Text style={styles.mapHint}>Map integration coming soon</Text>
          </View>
        </View>

        {request ? (
          <View style={styles.card}>
            <Text style={styles.subtitle}>Patient Details</Text>
            <Text style={styles.details}>👤 Name: {request.name}</Text>
            <Text style={styles.details}>🎂 Age: {request.age || 'N/A'}</Text>
            <Text style={styles.details}>🩸 Blood Group: {request.bloodGroup}</Text>
            <Text style={styles.details}>💉 Units Needed: {request.units}</Text>
            <Text style={styles.details}>⏱️ Urgency: {request.urgency}</Text>
            <Text style={styles.details}>📍 Location: {request.location}</Text>
            <Text style={styles.details}>📝 Notes: {request.notes || 'N/A'}</Text>

            <Text style={{ marginTop: 14 }}>Are you willing to help?</Text>

            <View style={styles.btnRow}>
              <TouchableOpacity style={styles.donateBtn} onPress={handleDonate}>
                <Text style={styles.donateText}>I’ll Donate</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.skipBtn} onPress={handleSkip}>
                <Text style={styles.skipText}>I’ll Skip</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <Text style={styles.noRequest}>No nearby requests right now.</Text>
        )}
      </ScrollView>

      {/* Bottom Tabs */}
      <View style={styles.navBar}>
        <Tab icon="home" label="Home" path="/donor/home" />
        <Tab icon="medkit" label="Nearby Request" path="/donor/request" active />
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
      <Ionicons name={icon} size={22} color={active ? '#e53935' : '#aaa'} />
      <Text style={[styles.label, active && { color: '#e53935', fontWeight: '600' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 14,
    borderWidth: 2,
    borderColor: '#e53935',
  },
  title: { fontSize: 18, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  subtitle: { fontSize: 16, fontWeight: '600', marginBottom: 6 },
  details: { fontSize: 14, marginBottom: 4, color: '#333' },
  mapPlaceholder: {
    height: 150,
    backgroundColor: '#ddd',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapHint: {
    marginTop: 6,
    fontSize: 12,
    color: '#666',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 14,
  },
  donateBtn: {
    backgroundColor: '#e53935',
    flex: 1,
    marginRight: 6,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  skipBtn: {
    borderWidth: 1,
    borderColor: '#e53935',
    flex: 1,
    marginLeft: 6,
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  donateText: {
    color: '#fff',
    fontWeight: '600',
  },
  skipText: {
    color: '#e53935',
    fontWeight: '600',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
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
  label: {
    fontSize: 12,
    color: '#aaa',
    marginTop: 4,
  },
  noRequest: {
    textAlign: 'center',
    fontSize: 16,
    marginTop: 30,
    color: '#666',
  },
});
