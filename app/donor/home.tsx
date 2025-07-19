import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  Dimensions,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function DonorHome() {
  const router = useRouter();

  const openMap = () => {
    const url = 'https://www.google.com/maps/search/?api=1&query=Shanti+Nagar+Gandhi+Statue';
    Linking.openURL(url);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Awareness Board */}
        <View style={styles.card}>
          <Text style={styles.title}>Awareness Board</Text>
          <Text style={styles.bullet}>❤️ Why Donate?</Text>
          <Text style={styles.point}>• Every donation saves up to 3 lives</Text>
          <Text style={styles.point}>
            • Helps accident victims, cancer & thalassemia patients, and pregnant women
          </Text>

          <Text style={styles.bullet}>✅ You Can Donate If:</Text>
          <Text style={styles.point}>• Age: 18–65 years</Text>
          <Text style={styles.point}>• Weight: 50 kg+</Text>
          <Text style={styles.point}>• Healthy & not on strong medications</Text>

          <Text style={styles.bullet}>🧠 Busting Myths:</Text>
          <Text style={styles.point}>
            • Myth: I’ll feel weak{'\n'}  Truth: Your body recovers quickly
          </Text>
          <Text style={styles.point}>
            • Myth: I need to know the patient{'\n'}  Truth: Your blood helps anyone in urgent need
          </Text>
        </View>

        {/* Nearby Camps */}
        <View style={styles.card}>
          <Text style={styles.title}>Active Blood Camps Nearby</Text>
          <Text style={styles.sub}>Camp Address:</Text>
          <Text style={styles.point}>Shanti Nagar near old Gandhi statue</Text>
          <Text style={styles.sub}>Camp Timing:</Text>
          <Text style={styles.point}>2:00 PM to 5:00 PM</Text>
          <TouchableOpacity style={styles.mapBox} onPress={openMap}>
            <Image
              source={{
                uri: 'https://maps.gstatic.com/tactile/pane/default_geocode-2x.png',
              }}
              style={{ width: '100%', height: '100%', borderRadius: 10 }}
              resizeMode="cover"
            />
          </TouchableOpacity>
          <Text style={styles.link}>Click on the map to view full location</Text>
        </View>
      </ScrollView>

      {/* Bottom Tab Navigation */}
      <View style={styles.navBar}>
        <Tab icon="home" label="Home" path="/donor/home" active />
        <Tab icon="medkit" label="Nearby Request" path="/donor/request" />
        <Tab icon="map" label="Nearby Camps" path="/donor/camps" />
        <Tab icon="settings" label="Settings" path="/donor/settings" />
      </View>
    </View>
  );
}

function Tab({
  icon,
  label,
  path,
  active,
}: {
  icon: any;
  label: string;
  path: string;
  active?: boolean;
}) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.tabButton} onPress={() => router.push(path)}>
      <Ionicons name={icon} size={22} color={active ? '#fff' : '#eee'} />
      <Text style={[styles.tabLabel, active && { color: '#fff' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  card: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 3,
    borderColor: '#e53935',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111',
    marginBottom: 10,
    textAlign: 'center',
  },
  bullet: {
    fontWeight: 'bold',
    marginTop: 10,
    color: '#333',
  },
  point: {
    color: '#444',
    fontSize: 14,
    marginLeft: 10,
    marginTop: 4,
  },
  sub: {
    fontWeight: '600',
    marginTop: 10,
    color: '#333',
  },
  link: {
    color: '#666',
    fontSize: 13,
    marginTop: 6,
    textAlign: 'center',
  },
  mapBox: {
    height: 120,
    backgroundColor: '#ccc',
    marginTop: 10,
    borderRadius: 10,
    overflow: 'hidden',
  },
  navBar: {
    position: 'absolute',
    bottom: 0,
    width: width,
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#e53935',
    paddingVertical: 10,
  },
  tabButton: {
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#eee',
    marginTop: 4,
  },
});
