import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebase';

const { width } = Dimensions.get('window');

export default function DonorNearbyCamps() {
  const router = useRouter();
  const [camps, setCamps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCamps = async () => {
      try {
        const campCollection = collection(db, 'bloodCamps');
        const campSnapshot = await getDocs(campCollection);
        const campList = campSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setCamps(campList);
      } catch (err) {
        console.error('Error fetching camps:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCamps();
  }, []);

  const openGoogleMaps = (address: string) => {
    if (!address) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.header}>Active Blood Donation Camps</Text>

        {loading ? (
          <Text style={styles.infoText}>⏳ Loading camps near you...</Text>
        ) : camps.length === 0 ? (
          <Text style={styles.infoText}>🚫 No active camps found near your location.</Text>
        ) : (
          camps.map((camp) => (
            <View key={camp.id} style={styles.card}>
              <Text style={styles.title}>{camp.name || 'Unnamed Camp'}</Text>
              <Text style={styles.hosted}>
                Hosted by: {camp.hostedBy || 'N/A'}{'\n'}
                Location: {camp.location || 'N/A'}
              </Text>

              <View style={styles.row}>
                <TouchableOpacity onPress={() => openGoogleMaps(camp.address)}>
                  <Ionicons name="location" size={24} color="#e53935" />
                </TouchableOpacity>
                <Text style={styles.distance}>
                  {camp.distance ? `${camp.distance} away` : 'Distance unknown'}
                </Text>
              </View>

              {camp.address && (
                <TouchableOpacity onPress={() => openGoogleMaps(camp.address)}>
                  <Text style={styles.directions}>📍 Tap to get directions</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <Tab icon="home" label="Home" path="/donor/home" />
        <Tab icon="medkit" label="Nearby Request" path="/donor/request" />
        <Tab icon="map" label="Nearby Camps" path="/donor/camps" active />
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
  container: { flex: 1, backgroundColor: '#f9f9f9' },
  header: {
    fontSize: 20,
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: 18,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 14,
    borderColor: '#e53935',
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 6,
  },
  hosted: {
    fontSize: 13,
    color: '#555',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  distance: {
    fontSize: 13,
    fontWeight: '500',
    color: '#444',
  },
  directions: {
    fontSize: 13,
    color: '#1a73e8',
    textDecorationLine: 'underline',
    marginTop: 6,
  },
  infoText: {
    textAlign: 'center',
    fontSize: 14,
    marginTop: 30,
    color: '#555',
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
  label: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});
