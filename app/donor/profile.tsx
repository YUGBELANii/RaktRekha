import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../firebase';

const { width } = Dimensions.get('window');

export default function DonorProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    fullName: '',
    bio: '',
    city: '',
    emergencyContact: '',
    preferredHospital: '',
  });
  const [originalData, setOriginalData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const uid = auth.currentUser?.uid;
        if (!uid) return;

        const docRef = doc(db, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserData((prev) => ({ ...prev, ...data }));
          setOriginalData(data);
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (field: string, value: string) => {
    setUserData((prev) => ({ ...prev, [field]: value }));
  };

  const handleUpdate = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;

      if (JSON.stringify(userData) === JSON.stringify(originalData)) {
        Alert.alert('No changes made');
        return;
      }

      const docRef = doc(db, 'users', uid);
      await setDoc(docRef, userData, { merge: true });
      Alert.alert('Profile Updated');
    } catch (error) {
      console.error('Update failed:', error);
      Alert.alert('Error', 'Something went wrong');
    }
  };

  if (loading) {
    return (
      <View style={[styles.center, { backgroundColor: '#f3f3f3' }]}>
        <ActivityIndicator size="large" color="#000" />
        <Text style={{ marginTop: 10, color: '#000' }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: '#f3f3f3' }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <View style={[styles.coverBox, { backgroundColor: '#eee' }]}>
          <Text style={[styles.coverText, { color: '#444' }]}>Profile Cover</Text>
          <View style={styles.avatar}>
            <Ionicons name="person-circle-outline" size={64} color="#aaa" />
          </View>
        </View>

        <View style={[styles.form, { backgroundColor: '#fff', borderColor: '#ddd' }]}>
         <LabelInput
  label="Full Name"
  value={userData.fullName}
  onChangeText={(v: string) => handleChange('fullName', v)}
/>

<LabelInput
  label="Bio"
  value={userData.bio}
  onChangeText={(v: string) => handleChange('bio', v)}
  multiline
/>

<LabelInput
  label="City"
  value={userData.city}
  onChangeText={(v: string) => handleChange('city', v)}
/>

<LabelInput
  label="Emergency Contact"
  value={userData.emergencyContact}
  onChangeText={(v: string) => handleChange('emergencyContact', v)}
/>

<LabelInput
  label="Preferred Hospital"
  value={userData.preferredHospital}
  onChangeText={(v: string) => handleChange('preferredHospital', v)}
/>


          <TouchableOpacity
            style={[
              styles.saveButton,
              (!userData.fullName || loading) && { backgroundColor: '#888' },
            ]}
            onPress={handleUpdate}
            disabled={!userData.fullName || loading}
          >
            <Text style={{ color: '#fff', fontWeight: '600' }}>Edit Profile</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Nav */}
      <View style={[styles.navBar, { backgroundColor: '#fff', borderTopColor: '#eee' }]}>
        <Tab icon="home" label="Home" path="/donor/home" />
        <Tab icon="medkit" label="Nearby Request" path="/donor/request" />
        <Tab icon="map" label="Nearby Camps" path="/donor/camps" />
        <Tab icon="settings" label="Settings" path="/donor/settings" />
      </View>
    </View>
  );
}

function LabelInput({
  label,
  ...props
}: {
  label: string;
  [key: string]: any;
}) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text style={[styles.label, { color: '#444' }]}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: '#f9f9f9',
            color: '#000',
            borderColor: '#ccc',
          },
          props.multiline && { height: 80, textAlignVertical: 'top' },
        ]}
        autoCapitalize="sentences"
        placeholderTextColor="#aaa"
        {...props}
      />
    </View>
  );
}

function Tab({
  icon,
  label,
  path,
}: {
  icon: any;
  label: string;
  path: string;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.tabButton} onPress={() => router.push(path)}>
      <Ionicons name={icon} size={24} color="#aaa" />
      <Text style={[styles.tabLabel, { color: '#444' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  coverBox: {
    height: 120,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverText: { fontWeight: '600' },
  avatar: {
    marginTop: -30,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 4,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  form: {
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
  },
  label: {
    fontWeight: '600',
    fontSize: 13,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#EF4444',
    marginTop: 16,
    padding: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    zIndex: 10,
  },
  tabButton: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    marginTop: 4,
  },
});
