import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
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

export default function ReceiverProfileScreen() {
  const router = useRouter();
  const user = auth.currentUser;
  const [editable, setEditable] = useState(false);
  const [profile, setProfile] = useState({
    name: '',
    bio: '',
    city: '',
    emergencyContact: '',
    hospital: '',
    bloodGroup: 'A+',
    age: '22',
  });

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(doc(db, 'users', user.uid), (docSnap) => {
      if (docSnap.exists()) setProfile((prev) => ({ ...prev, ...docSnap.data() }));
    });
    return unsub;
  }, []);

  const handleUpdate = async () => {
    if (!user) return;
    await setDoc(doc(db, 'users', user.uid), profile, { merge: true });
    setEditable(false);
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.card}>
          <View style={styles.coverImage}>
            <Text style={styles.coverText}>Profile Cover</Text>
          </View>

          <View style={styles.avatarContainer}>
            <Ionicons name="person-circle-outline" size={60} color="#555" />
          </View>

          <View style={styles.badges}>
            <Text style={styles.badge}>Age: {profile.age}</Text>
            <Text style={styles.badge}>Blood Group: {profile.bloodGroup}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={profile.name}
              editable={editable}
              onChangeText={(val) => setProfile({ ...profile, name: val })}
            />

            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, { height: 60 }]}
              multiline
              value={profile.bio}
              editable={editable}
              onChangeText={(val) => setProfile({ ...profile, bio: val })}
            />

            <Text style={styles.label}>City</Text>
            <TextInput
              style={styles.input}
              value={profile.city}
              editable={editable}
              onChangeText={(val) => setProfile({ ...profile, city: val })}
            />

            <Text style={styles.label}>Emergency Contact</Text>
            <TextInput
              style={styles.input}
              keyboardType="phone-pad"
              value={profile.emergencyContact}
              editable={editable}
              onChangeText={(val) => setProfile({ ...profile, emergencyContact: val })}
            />

            <Text style={styles.label}>Preferred Hospital</Text>
            <TextInput
              style={styles.input}
              value={profile.hospital}
              editable={editable}
              onChangeText={(val) => setProfile({ ...profile, hospital: val })}
            />
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => (editable ? handleUpdate() : setEditable(true))}
          >
            <Text style={styles.editText}>{editable ? 'Save & Close' : 'Edit Profile'}</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <Tab icon="home" label="Home" path="/receiver/home" />
        <Tab icon="medkit" label="Request" path="/receiver/request" />
        <Tab icon="call" label="Nearby" path="/receiver/nearbydonor" />
        <Tab icon="settings" label="settings" path="/receiver/settings" active />
      </View>
    </View>
  );
}

function Tab({ icon, label, path, active }: any) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.tabButton} onPress={() => router.push(path)}>
      <Ionicons name={icon} size={24} color={active ? '#e53935' : '#aaa'} />
      <Text style={[styles.tabLabel, active && { color: '#e53935' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f3f3f3',
    paddingVertical: 40,
    alignItems: 'center',
  },
  card: {
    width: width * 0.9,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  coverImage: {
    backgroundColor: '#ddd',
    height: 100,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  coverText: {
    color: '#555',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: -30,
  },
  badges: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10,
  },
  badge: {
    backgroundColor: '#eee',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 20,
    fontSize: 13,
    color: '#333',
  },
  section: {
    marginTop: 10,
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
    marginTop: 12,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    backgroundColor: '#f3f3f3',
    color: '#444',
  },
  editBtn: {
    marginTop: 24,
    backgroundColor: '#222',
    paddingVertical: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontWeight: '600',
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
  tabLabel: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});
