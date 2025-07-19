import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function MatchScreen() {
  const router = useRouter();

  return (
    <View style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Map Card */}
      <View style={styles.mapCard}>
        <Image
          source={require('../../assets/images/map-placeholder.png')} // Use actual map or placeholder
          style={styles.mapImage}
        />
        <View style={styles.etaBox}>
          <Ionicons name="car-outline" size={18} color="#e53935" />
          <Text style={styles.etaText}>Estimated arrival: 12 mins</Text>
        </View>
      </View>

      {/* Donor Info Card */}
      <View style={styles.donorCard}>
        <Image
          source={require('../../assets/images/donor-avatar.png')} // Replace with actual donor image
          style={styles.avatar}
        />
        <Text style={styles.name}>Rohan Sharma</Text>
        <Text style={styles.bloodGroup}>B+ Blood Group</Text>

        <TouchableOpacity style={styles.viewBtn}>
          <Text style={styles.btnText}>View Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Cancel Request</Text>
        </TouchableOpacity>
      </View>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/home')}>
          <Ionicons name="home" size={24} color="#aaa" />
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
  mapCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  mapImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  etaBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fffaf9',
  },
  etaText: {
    fontSize: 15,
    color: '#e53935',
    fontWeight: '600',
    marginLeft: 8,
  },
  donorCard: {
    marginTop: 30,
    marginHorizontal: 30,
    alignItems: 'center',
    backgroundColor: '#fff4f4',
    padding: 20,
    borderRadius: 16,
    shadowColor: '#e53935',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  bloodGroup: {
    fontSize: 15,
    color: '#e53935',
    marginBottom: 16,
  },
  viewBtn: {
    backgroundColor: '#e53935',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 10,
  },
  btnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  cancelBtn: {
    backgroundColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  cancelText: {
    color: '#333',
    fontWeight: '500',
    fontSize: 14,
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
