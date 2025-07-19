import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  collection,
  doc,
  getDocs,
  limit,
  orderBy,
  query,
  updateDoc,
  where
} from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { auth, db } from '../../firebase';

const { width } = Dimensions.get('window');

// Type for Firestore request document
type BloodRequest = {
  bloodGroup: string;
  hospital?: string;
  status: string;
  createdAt?: any;
};

export default function ReceiverTabs() {
  const router = useRouter();
  const [activeRequest, setActiveRequest] = useState<BloodRequest | null>(null);

  useEffect(() => {
    const fetchRequest = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const q = query(
          collection(db, 'bloodRequests'),
          where('uid', '==', user.uid),
          where('status', '==', 'pending'),
          orderBy('createdAt', 'desc'),
          limit(1)
        );

        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const requestData = snapshot.docs[0].data() as BloodRequest;
          setActiveRequest(requestData);
        }
      } catch (error) {
        console.error('Failed to fetch request:', error);
      }
    };

    fetchRequest();
  }, []);

  const handleCancel = async () => {
    const user = auth.currentUser;
    if (!user) return;

    try {
      const q = query(
        collection(db, 'bloodRequests'),
        where('uid', '==', user.uid),
        where('status', '==', 'pending'),
        orderBy('createdAt', 'desc'),
        limit(1)
      );

      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const docRef = doc(db, 'bloodRequests', snapshot.docs[0].id);
        await updateDoc(docRef, { status: 'cancelled' });
        setActiveRequest(null);
        Alert.alert('Cancelled', 'Your request has been cancelled.');
      }
    } catch (error) {
      console.error('Cancel error:', error);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140 }}>
        <View style={styles.card}>
          <Text style={styles.title}>🧠 Awareness Board</Text>

          <Text style={styles.subHeading}>🔴 What to do after blood transfusion?</Text>
          <Text style={styles.text}>• Rest for 24–48 hours.</Text>
          <Text style={styles.text}>• Drink plenty of fluids.</Text>
          <Text style={styles.text}>• Watch for fever, chills, or rash.</Text>
          <Text style={styles.text}>• Report any dizziness or unusual symptoms to your doctor immediately.</Text>

          <Text style={styles.subHeading}>🧬 Signs of blood deficiency (Anemia)</Text>
          <Text style={styles.text}>• Constant fatigue or weakness</Text>
          <Text style={styles.text}>• Pale skin or lips</Text>
          <Text style={styles.text}>• Shortness of breath</Text>
          <Text style={styles.text}>• Dizziness or rapid heartbeat</Text>
          <Text style={styles.text}>• Cold hands and feet</Text>

          <Text style={styles.subHeading}>🆘 How to request urgent blood?</Text>
          <Text style={styles.text}>• Go to Request Blood tab.</Text>
          <Text style={styles.text}>• Fill in required details (blood group, urgency, hospital name).</Text>
          <Text style={styles.text}>• Click Send Request.</Text>
          <Text style={styles.text}>• Nearby verified donors will be notified instantly.</Text>
        </View>

        <View style={styles.requestCard}>
          <Text style={styles.requestTitle}>Active Blood Request</Text>

          {activeRequest ? (
            <>
              <Text style={styles.requestStatus}>🩸 Blood Grp {activeRequest.bloodGroup}</Text>
              <Text style={styles.requestStatus}>📍 {activeRequest.hospital || 'Unknown Hospital'}</Text>
              <Text style={[styles.requestStatus, { color: '#3366cc' }]}>
                Status :-  {activeRequest.status === 'open' ? 'Waiting For Donor' : activeRequest.status}
              </Text>

              <View style={styles.requestActions}>
                <TouchableOpacity
                  style={styles.viewBtn}
                  onPress={() => router.push('/receiver/request')}
                >
                  <Text style={styles.btnText}>View Request</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.cancelBtn}
                  onPress={handleCancel}
                >
                  <Text style={styles.btnText}>Cancel Request</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={[styles.requestStatus, { fontStyle: 'italic', color: '#777' }]}>
              No active request made.
            </Text>
          )}
        </View>
      </ScrollView>

      <View style={styles.navBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/home')}>
          <Ionicons name="home" size={24} color="#e53935" />
          <Text style={styles.label}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/request')}>
          <Ionicons name="medkit" size={24} color="#aaa" />
          <Text style={styles.label}>Request</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/nearbydonor')}>
          <Ionicons name="people" size={24} color="#aaa" />
          <Text style={styles.label}>Donors</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/settings')}>
          <Ionicons name="settings" size={24} color="#aaa" />
          <Text style={styles.label}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
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
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 80,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#999',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#e53935',
    marginBottom: 12,
  },
  subHeading: {
    fontSize: 15,
    fontWeight: '600',
    marginTop: 12,
    color: '#333',
    marginBottom: 4,
  },
  text: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  requestCard: {
    backgroundColor: '#f2f2f2',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 20,
    shadowColor: '#999',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  requestTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 6,
    color: '#222',
  },
  requestStatus: {
    fontSize: 14,
    color: '#555',
    marginBottom: 6,
  },
  requestActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  viewBtn: {
    flex: 1,
    backgroundColor: '#43a047',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 10,
  },
  cancelBtn: {
    flex: 1,
    backgroundColor: '#e53935',
    padding: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
