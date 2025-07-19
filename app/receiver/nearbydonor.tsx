import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebase';

const { width } = Dimensions.get('window');
const bloodGroups = ['All', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

export default function NearbyDonorsScreen() {
  const router = useRouter();

  const [donors, setDonors] = useState<any[]>([]);
  const [selectedGroup, setSelectedGroup] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilter, setShowFilter] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDonors = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'donors'));
        const donorList = querySnapshot.docs.map((doc) => doc.data());
        setDonors(donorList);
      } catch (error) {
        console.error('Error fetching donors:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonors();
  }, []);

  const filteredDonors = donors.filter((donor) => {
    const matchGroup = selectedGroup === 'All' || donor.bloodGroup === selectedGroup;
    const matchSearch =
      donor.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      donor.city?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchGroup && matchSearch;
  });

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 140, paddingHorizontal: 20 }}>
        <Text style={styles.header}>Nearby Donors</Text>

        {/* 🔍 Search + Filter Toggle */}
        <View style={styles.searchRow}>
          <TextInput
            placeholder="Search by name or city"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity onPress={() => setShowFilter(!showFilter)}>
            <Ionicons name="filter" size={24} color="#e53935" style={styles.filterIcon} />
          </TouchableOpacity>
        </View>

        {/* 🔽 Blood Group Picker Toggle */}
        {showFilter && (
          <View style={styles.pickerWrapper}>
            <Picker
              selectedValue={selectedGroup}
              onValueChange={(value) => setSelectedGroup(value)}
              style={styles.picker}
            >
              {bloodGroups.map((group) => (
                <Picker.Item key={group} label={group} value={group} />
              ))}
            </Picker>
          </View>
        )}

        {/* 🔄 Loading State */}
        {loading ? (
          <ActivityIndicator size="large" color="#e53935" style={{ marginTop: 40 }} />
        ) : filteredDonors.length === 0 ? (
          <Text style={styles.noDonors}>No donors found.</Text>
        ) : (
          filteredDonors.map((donor, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.name}>{donor.name}</Text>
              <Text>Blood Group: {donor.bloodGroup}</Text>
              <Text>Phone: {donor.phone}</Text>
              <Text>City: {donor.city}</Text>
              <TouchableOpacity style={styles.contactBtn}>
                <Text style={styles.btnText}>Contact</Text>
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>

      {/* 🔻 Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/home')}>
          <Ionicons name="home" size={24} color="#aaa" />
          <Text style={styles.labelTab}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/request')}>
          <Ionicons name="medkit" size={24} color="#aaa" />
          <Text style={styles.labelTab}>Request</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="people" size={24} color="#e53935" />
          <Text style={styles.labelTab}>Donors</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/settings')}>
          <Ionicons name="settings" size={24} color="#aaa" />
          <Text style={styles.labelTab}>Settings</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 20,
    color: '#e53935',
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 14,
    marginBottom: 10,
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#f2f2f2',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 40,
    fontSize: 14,
  },
  filterIcon: {
    marginLeft: 12,
  },
  pickerWrapper: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  picker: {
    height: 44,
  },
  card: {
    backgroundColor: '#fff0f0',
    marginTop: 14,
    borderRadius: 10,
    padding: 16,
    elevation: 2,
    shadowColor: '#e53935',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
    color: '#222',
  },
  contactBtn: {
    marginTop: 10,
    backgroundColor: '#e53935',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
  },
  noDonors: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 15,
    color: '#888',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  tabButton: {
    alignItems: 'center',
  },
  labelTab: {
    fontSize: 12,
    color: '#444',
    marginTop: 4,
  },
});
