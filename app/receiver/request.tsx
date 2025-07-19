import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useRouter } from 'expo-router';
import { onAuthStateChanged } from 'firebase/auth';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../firebase';

export default function RequestBloodScreen() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState('');
  const [bloodGroup, setBloodGroup] = useState('A+');
  const [units, setUnits] = useState('1');
  const [urgency, setUrgency] = useState('ASAP');
  const [location, setLocation] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
      } else {
        Alert.alert('Login Required', 'You are not logged in.');
        router.replace('/signin');
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async () => {
    if (!name || !bloodGroup || !units || !location) {
      Alert.alert('Missing Fields', 'Please fill all required fields.');
      return;
    }

    if (!user) {
      Alert.alert('Authentication Error', 'You must be logged in to make a request.');
      return;
    }

    try {
      const requestData = {
        requestId: `${user.uid}_${Date.now()}`,
        patientId: user.uid,
        name,
        bloodGroup,
        units,
        urgency,
        location,
        notes,
        status: 'pending',
        createdAt: serverTimestamp(),
      };

      await addDoc(collection(db, 'requests'), requestData);
      router.push('/receiver/loading');
    } catch (error) {
      console.error('Request submission failed:', error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.heading}>Request Blood</Text>

        {/* Full Name */}
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter patient's full name"
        />

        {/* Blood Group */}
        <Text style={styles.label}>Blood Group</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={bloodGroup} onValueChange={setBloodGroup}>
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map((bg) => (
              <Picker.Item key={bg} label={bg} value={bg} />
            ))}
          </Picker>
        </View>

        {/* Units Needed */}
        <Text style={styles.label}>Units Needed</Text>
        <TextInput
          style={styles.input}
          keyboardType="number-pad"
          value={units}
          onChangeText={setUnits}
          placeholder="e.g., 1 or 2"
        />

        {/* Urgency */}
        <Text style={styles.label}>Urgency</Text>
        <View style={styles.pickerContainer}>
          <Picker selectedValue={urgency} onValueChange={setUrgency}>
            <Picker.Item label="ASAP" value="ASAP" />
            <Picker.Item label="Within 24 hours" value="24hrs" />
            <Picker.Item label="Later" value="later" />
          </Picker>
        </View>

        {/* Location */}
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={location}
          onChangeText={setLocation}
          placeholder="City, Area, or Hospital"
        />

        {/* Notes */}
        <Text style={styles.label}>Additional Notes</Text>
        <TextInput
          style={[styles.input, { height: 80 }]}
          multiline
          value={notes}
          onChangeText={setNotes}
          placeholder="Any more details"
        />

        {/* Submit Button */}
        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Request Now</Text>
        </TouchableOpacity>

        {/* Extra Actions */}
        <View style={styles.extraActionsContainer}>
          <TouchableOpacity
            style={styles.extraAction}
            onPress={() => router.push('/receiver/advance-request')}
          >
            <Ionicons name="calendar-outline" size={22} color="#e53935" />
            <Text style={styles.extraActionText}>Plan Future Request</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.extraAction}
            onPress={() => router.push('/receiver/request-history')}
          >
            <Ionicons name="time-outline" size={22} color="#e53935" />
            <Text style={styles.extraActionText}>View Request History</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <TouchableOpacity style={styles.tabButton} onPress={() => router.push('/receiver/home')}>
          <Ionicons name="home" size={24} color="#aaa" />
          <Text style={styles.labelNav}>Home</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.tabButton}>
          <Ionicons name="medkit" size={24} color="#e53935" />
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
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginTop: 14,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#e53935',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginTop: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 8,
    marginTop: 6,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginTop: 6,
  },
  button: {
    backgroundColor: '#e53935',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  extraActionsContainer: {
    marginTop: 30,
  },
  extraAction: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 14,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
    borderWidth: 1,
    borderColor: '#eee',
    marginBottom: 12,
  },
  extraActionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#444',
    marginLeft: 10,
  },
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
  tabButton: {
    alignItems: 'center',
  },
  labelNav: {
    fontSize: 12,
    marginTop: 4,
    color: '#444',
  },
});
