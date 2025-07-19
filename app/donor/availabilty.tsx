import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { getAuth } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { db } from '../../firebase';

type DayAvailability = {
  available: boolean;
  start: string;
  end: string;
};

type Availability = {
  [day: string]: DayAvailability;
};

const weekdays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const { width } = Dimensions.get('window');

export default function ScheduleAvailability() {
  const router = useRouter();
  const user = getAuth().currentUser;

  const [availability, setAvailability] = useState<Availability>({});
  const [showTimePicker, setShowTimePicker] = useState({ show: false, day: '', type: 'start' });

  useEffect(() => {
    fetchAvailability();
  }, []);

  const formatTime = (date: Date) =>
    date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

  const fetchAvailability = async () => {
    if (!user) return;
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);

    let initial: Availability = {};
    weekdays.forEach(day => {
      initial[day] = {
        available: false,
        start: '09:00 AM',
        end: '05:00 PM',
      };
    });

    if (docSnap.exists()) {
      const userData = docSnap.data();
      if (userData.availability) {
        setAvailability({ ...initial, ...userData.availability });
        return;
      }
    }

    setAvailability(initial);
  };

  const toggleDay = (day: string) => {
    setAvailability((prev: Availability) => ({
      ...prev,
      [day]: {
        ...prev[day],
        available: !prev[day]?.available,
      },
    }));
  };

  const handleTimeChange = (_event: any, selectedDate: Date | undefined) => {
    if (!selectedDate) {
      setShowTimePicker({ show: false, day: '', type: 'start' });
      return;
    }

    const formatted = formatTime(selectedDate);
    const { day, type } = showTimePicker;

    setAvailability((prev: Availability) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [type]: formatted,
      },
    }));

    setShowTimePicker({ show: false, day: '', type: 'start' });
  };

  const handleSave = async () => {
    if (!user) return;

    const invalidDay = weekdays.find(day => {
      const { available, start, end } = availability[day];
      if (!available) return false;

      const to24 = (t: string) => {
        const [time, period] = t.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (period === 'PM' && hours !== 12) hours += 12;
        if (period === 'AM' && hours === 12) hours = 0;
        return hours * 60 + minutes;
      };

      return to24(start) >= to24(end);
    });

    if (invalidDay) {
      alert(`Invalid time range on ${invalidDay}. Start time must be before end time.`);
      return;
    }

    await setDoc(doc(db, 'users', user.uid), { availability }, { merge: true });
    alert('Availability saved!');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <Text style={styles.header}>Your Weekly Availability</Text>

        {weekdays.map(day => (
          <View key={day} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.dayText}>{day}</Text>
              <Switch
                value={availability?.[day]?.available ?? false}
                onValueChange={() => toggleDay(day)}
              />
            </View>

            {availability?.[day]?.available && (
              <View style={styles.timeRow}>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker({ show: true, day, type: 'start' })}
                >
                  <Text>Start: {availability?.[day]?.start ?? '--:--'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.timeButton}
                  onPress={() => setShowTimePicker({ show: true, day, type: 'end' })}
                >
                  <Text>End: {availability?.[day]?.end ?? '--:--'}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Save Availability</Text>
        </TouchableOpacity>

        {showTimePicker.show && (
          <DateTimePicker
            value={new Date()}
            mode="time"
            display={Platform.OS === 'ios' ? 'spinner' : 'default'}
            onChange={handleTimeChange}
          />
        )}
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <Tab icon="home" label="Home" path="/donor/home" />
        <Tab icon="medkit" label="Nearby Request" path="/donor/request" />
        <Tab icon="map" label="Nearby Camps" path="/donor/camps" />
        <Tab icon="settings" label="Settings" path="/donor/settings" active />
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
  container: { flex: 1, backgroundColor: '#f3f3f3' },
  header: { fontSize: 18, fontWeight: '700', marginTop: 16, marginBottom: 16, textAlign: 'center' },
  card: {
    backgroundColor: '#fff',
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    borderColor: '#ddd',
    borderWidth: 1,
    marginHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayText: { fontSize: 15, fontWeight: '600' },
  timeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  timeButton: {
    padding: 8,
    backgroundColor: '#eee',
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  saveBtn: {
    marginTop: 20,
    marginBottom: 40,
    backgroundColor: '#e53935',
    padding: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginHorizontal: 16,
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
