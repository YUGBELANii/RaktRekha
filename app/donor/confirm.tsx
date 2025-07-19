import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../firebase';

export default function ConfirmDonationScreen() {
  const { requestId } = useLocalSearchParams();
  const router = useRouter();
  const [requestData, setRequestData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequest = async () => {
      try {
        const docSnap = await getDoc(doc(db, 'requests', String(requestId)));
        if (docSnap.exists()) {
          setRequestData(docSnap.data());
        }
      } catch (error) {
        console.error('Error fetching request:', error);
      } finally {
        setLoading(false);
      }
    };

    if (requestId) fetchRequest();
  }, [requestId]);

  const handleConfirm = async () => {
    try {
      const donor = auth.currentUser;
      if (!donor) return alert('User not authenticated');

      const donorId = donor.uid;

      // 1. Update request
      await updateDoc(doc(db, 'requests', String(requestId)), {
        status: 'accepted',
        acceptedBy: donorId,
        acceptedAt: new Date(),
      });

      // 2. Save donation history for donor
      const donationRef = doc(
        db,
        'users',
        donorId,
        'donations',
        String(requestId)
      );

      await setDoc(donationRef, {
        receiver: requestData.name || 'Anonymous',
        location: requestData.location || 'Unknown',
        type: 'Blood Donation',
        status: 'Pending',
        date: new Date(),
        requestId: requestId,
        bloodGroup: requestData.bloodGroup || 'N/A',
      });

      alert('Donation Confirmed!');
      router.push('/donor/request'); // Redirect to Nearby Request screen
    } catch (err) {
      alert('Failed to confirm donation');
      console.log(err);
    }
  };

  if (loading)
    return (
      <ActivityIndicator
        style={{ marginTop: 50 }}
        size="large"
        color="#e53935"
      />
    );
  if (!requestData)
    return (
      <Text style={{ textAlign: 'center', marginTop: 50 }}>
        Request not found.
      </Text>
    );

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>There’s a blood required nearby you</Text>
        <View style={styles.mapPlaceholder}>
          <Text style={{ fontWeight: '600' }}>Patient’s Location</Text>
        </View>
        <View style={styles.etaBox}>
          <Ionicons name="location-outline" size={18} color="#000" />
          <Text style={styles.etaText}>Estimated Time To Reach : 20m</Text>
        </View>

        <View style={styles.profileBox}>
          <Text style={styles.profileTitle}>Patient’s Profile</Text>
          <Text style={styles.detail}>Name: {requestData.name}</Text>
          <Text style={styles.detail}>
            Blood Group: {requestData.bloodGroup}
          </Text>

          <TouchableOpacity style={styles.viewBtn} onPress={handleConfirm}>
            <Text style={styles.viewText}>Confirm & Donate</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e3f2fd',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    width: '100%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 12,
  },
  mapPlaceholder: {
    backgroundColor: '#ccc',
    height: 150,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    paddingVertical: 8,
  },
  etaText: {
    marginLeft: 6,
    fontWeight: '500',
  },
  profileBox: {
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 12,
    marginTop: 10,
  },
  profileTitle: {
    fontWeight: 'bold',
    marginBottom: 6,
    textAlign: 'center',
  },
  detail: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  viewBtn: {
    marginTop: 10,
    backgroundColor: '#222',
    borderRadius: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  viewText: {
    color: '#fff',
    fontWeight: '600',
  },
});
