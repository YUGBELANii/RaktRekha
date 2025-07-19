import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Linking,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, db } from '../../firebase';

const { width } = Dimensions.get('window');

export default function ReceiverSettingsScreen() {
  const router = useRouter();

  const [userData, setUserData] = useState({ name: '' });
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);

  const [notifDonors, setNotifDonors] = useState(true);
  const [notifCamps, setNotifCamps] = useState(true);
  const [notifAlerts, setNotifAlerts] = useState(false);
  const [language, setLanguage] = useState('English');

useEffect(() => {
  const fetchData = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) return;
      const docRef = doc(db, 'receiver', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        // Fallback in case name is missing
        setUserData({ name: data?.name || 'Receiver' });
      } else {
        console.warn('No such document!');
        setUserData({ name: 'Receiver' });
      }
    } catch (err) {
      console.log('Error fetching userData:', err);
    }
  };
  fetchData();
}, []);

  const handleSupport = () => Linking.openURL('mailto:support@rakthrekha.org');
  const handleBugReport = () => Linking.openURL('https://forms.gle/bugReportLink');
  const handleFeedback = () => Linking.openURL('https://forms.gle/feedbackFormLink');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: '#f3f3f3' }]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 120 }}>
        <TouchableOpacity style={styles.profileButton} onPress={() => router.push('/receiver/profile')}>
          <Ionicons name="person-circle-outline" size={24} color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.profileText}>{userData.name || 'Your Name'}</Text>
          <Ionicons name="pencil-outline" size={16} color="#fff" style={{ marginLeft: 10 }} />
        </TouchableOpacity>

        <MenuButton icon="notifications-outline" label="Notification Preferences" onPress={() => setShowNotifMenu(!showNotifMenu)} />
        {showNotifMenu && (
          <View style={styles.dropdown}>
            <DropdownRow label="New Donors Nearby" value={notifDonors} onValueChange={setNotifDonors} />
            <DropdownRow label="Nearby Camps" value={notifCamps} onValueChange={setNotifCamps} />
            <DropdownRow label="Emergency Alerts" value={notifAlerts} onValueChange={setNotifAlerts} />
          </View>
        )}

        <MenuButton icon="document-text-outline" label="Your Request History" onPress={() => router.push('/receiver/request-history')} />
        <MenuButton icon="globe-outline" label="Language/Theme" onPress={() => setShowLangMenu(!showLangMenu)} />
        {showLangMenu && (
          <View style={styles.dropdown}>
            <View style={styles.languageRow}>
              <Text style={styles.languageLabel}>Dark Mode:</Text>
              <Text style={styles.languageValue}>Coming Soon</Text>
            </View>
            <View style={styles.languageRow}>
              <Text style={styles.languageLabel}>Language:</Text>
              <Text style={styles.languageValue}>{language}</Text>
            </View>
          </View>
        )}

        <MenuButton icon="lock-closed-outline" label="Privacy & Security" onPress={() => router.push("/receiver/privacy")} />
        <MenuButton icon="help-circle-outline" label="Help & Feedback" onPress={() => setShowHelpMenu(!showHelpMenu)} />
        {showHelpMenu && (
          <View style={{ marginLeft: 10 }}>
            <MenuButton icon="mail-outline" label="Contact Support" onPress={handleSupport} small />
            <MenuButton icon="bug-outline" label="Report a Bug" onPress={handleBugReport} small />
            <MenuButton icon="chatbubble-ellipses-outline" label="Send Feedback" onPress={handleFeedback} small />
          </View>
        )}

        <MenuButton icon="log-out-outline" label="Logout" onPress={handleLogout} />
      </ScrollView>

      <View style={styles.navBar}>
        <Tab icon="home" label="Home" path="/receiver/home" />
        <Tab icon="medkit" label="Request" path="/receiver/request" />
        <Tab icon="people" label="Donors" path="/receiver/nearbydonor" />
        <Tab icon="settings" label="Settings" active path="/receiver/settings" />
      </View>
    </View>
  );
}

// Components
function MenuButton({ icon, label, onPress, small }: any) {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.menuButton, small && { paddingLeft: 30 }]}>
      <Ionicons name={icon} size={20} color="#fff" style={{ marginRight: 10 }} />
      <Text style={[styles.label, small && { fontSize: 13 }]}>{label}</Text>
    </TouchableOpacity>
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

function DropdownRow({ label, value, onValueChange }: any) {
  return (
    <View style={styles.dropdownRow}>
      <Text>{label}</Text>
      <Switch value={value} onValueChange={onValueChange} />
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1 },
  profileButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#e53935',
    margin: 16,
    padding: 12,
    borderRadius: 20,
  },
  profileText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  menuButton: {
    backgroundColor: '#e53935',
    marginHorizontal: 16,
    marginVertical: 6,
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    color: '#244',
    fontWeight: '600',
  },
  dropdown: {
    marginHorizontal: 26,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  dropdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  languageRow: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  languageLabel: {
    fontSize: 14,
    fontWeight: '600',
  },
  languageValue: {
    fontSize: 14,
    color: '#333',
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
});
