import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

const AdvanceRequestScreen = () => {
  const router = useRouter();

  const [form, setForm] = useState({
    bloodType: '',
    units: '',
    reason: '',
  });

  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  const handleChange = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const onDateChange = (
    event: any,
    selectedDate?: Date | undefined
  ) => {
    if (selectedDate) setDate(selectedDate);
    setShowPicker(Platform.OS === 'ios');
  };

  const handleSubmit = () => {
    // Validate form and date
    if (!form.bloodType || !form.units || !form.reason) {
      alert('Please fill in all fields');
      return;
    }

    const formattedDate = date.toISOString().split('T')[0];

    console.log('Request:', {
      ...form,
      requiredDate: formattedDate,
    });

    alert(`Request submitted for ${formattedDate}`);
    // router.push('/receiver/success'); // or wherever
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#fff', flexGrow: 1 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>
        Advance Blood Request
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 5 }}>Blood Type</Text>
      <TextInput
        placeholder="e.g. A+"
        style={styles.input}
        value={form.bloodType}
        onChangeText={(text) => handleChange('bloodType', text)}
      />

      <Text style={{ fontSize: 16, marginBottom: 5 }}>Units Required</Text>
      <TextInput
        placeholder="e.g. 2"
        style={styles.input}
        keyboardType="numeric"
        value={form.units}
        onChangeText={(text) => handleChange('units', text)}
      />

      <Text style={{ fontSize: 16, marginBottom: 5 }}>Reason</Text>
      <TextInput
        placeholder="Why do you need it?"
        style={[styles.input, { height: 100 }]}
        multiline
        value={form.reason}
        onChangeText={(text) => handleChange('reason', text)}
      />

      <Text style={{ fontSize: 16, marginTop: 20 }}>Required Date</Text>
      <TouchableOpacity onPress={() => setShowPicker(true)} style={styles.dateBox}>
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>

      {showPicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display={Platform.OS === 'ios' ? 'spinner' : 'default'}
          onChange={onDateChange}
          minimumDate={new Date()}
          maximumDate={new Date(2100, 11, 31)}
        />
      )}

      <TouchableOpacity onPress={handleSubmit} style={styles.submitBtn}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Submit Request</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dateBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 20,
  },
  submitBtn: {
    backgroundColor: '#e53935',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
});

export default AdvanceRequestScreen;
