import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  EmailAuthProvider,
  getAuth,
  reauthenticateWithCredential,
  updatePassword,
} from 'firebase/auth';
import React, { useState } from 'react';
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const auth = getAuth();
  const user = auth.currentUser;

  const [locationPref, setLocationPref] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [showRequests, setShowRequests] = useState(false);
  const [showDonations, setShowDonations] = useState(false);
  const [showEmergencyContact, setShowEmergencyContact] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please enter both current and new password');
      return;
    }

    if (!user?.email) {
      Alert.alert('Error', 'User email not found.');
      return;
    }

    try {
      setLoading(true);
      const credential = EmailAuthProvider.credential(user.email, currentPassword);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      Alert.alert('Success', 'Password changed successfully!');
      setShowChangePassword(false);
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      console.log(error);
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={styles.container}>
        {/* Location */}
        <View style={styles.card}>
          <View style={styles.rowBetween}>
            <View style={styles.row}>
              <Ionicons name="location" size={18} />
              <Text style={styles.title}>Location Preference</Text>
            </View>
            <Switch value={locationPref} onValueChange={setLocationPref} />
          </View>
        </View>

        {/* Profile */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="person-circle" size={18} />
            <Text style={styles.title}>Profile Visibility</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Show My Profile To Nearby Donors</Text>
            <Switch value={showProfile} onValueChange={setShowProfile} />
          </View>
          <View style={styles.rowBetween}>
            <Text>Show My Request History</Text>
            <Switch value={showRequests} onValueChange={setShowRequests} />
          </View>
          <View style={styles.rowBetween}>
            <Text>Show My Donation History</Text>
            <Switch value={showDonations} onValueChange={setShowDonations} />
          </View>
        </View>

        {/* Emergency */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="alert-circle" size={18} />
            <Text style={styles.title}>Emergency Contact</Text>
          </View>
          <View style={styles.rowBetween}>
            <Text>Show Details For Emergency Contact</Text>
            <Switch value={showEmergencyContact} onValueChange={setShowEmergencyContact} />
          </View>
        </View>

        {/* Password */}
        <View style={styles.card}>
          <View style={styles.row}>
            <Ionicons name="key" size={18} />
            <Text style={styles.title}>Password & Credentials</Text>
          </View>

          <TouchableOpacity
            style={styles.credRow}
            onPress={() => setShowChangePassword(!showChangePassword)}
          >
            <Text>Change Password</Text>
            <Ionicons name={showChangePassword ? 'chevron-up' : 'chevron-forward'} size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.credRow}
            onPress={() =>
              Alert.alert('Action Blocked', 'Use web version to change number/email')
            }
          >
            <Text>Change Number/Email</Text>
            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.credRow}
            onPress={() =>
              Alert.alert('Action Blocked', 'Use web version to delete your account')
            }
          >
            <Text>Delete My Account</Text>
            <Ionicons name="chevron-forward" size={18} />
          </TouchableOpacity>

          {showChangePassword && (
            <View style={{ marginTop: 10 }}>
              {user?.providerData[0]?.providerId !== 'password' ? (
                <Text style={{ fontSize: 13, color: 'red' }}>
                  Your account is linked via {user?.providerData[0]?.providerId}. Please use web
                  version to update password.
                </Text>
              ) : (
                <>
                  <TextInput
                    placeholder="Current Password"
                    secureTextEntry
                    value={currentPassword}
                    onChangeText={setCurrentPassword}
                    style={styles.input}
                  />
                  <TextInput
                    placeholder="New Password"
                    secureTextEntry
                    value={newPassword}
                    onChangeText={setNewPassword}
                    style={styles.input}
                  />
                  <TouchableOpacity
                    style={[styles.updateBtn, loading && { opacity: 0.5 }]}
                    disabled={loading}
                    onPress={handleChangePassword}
                  >
                    <Text style={styles.updateBtnText}>
                      {loading ? 'Updating...' : 'Update Password'}
                    </Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Bottom Navigation */}
      <View style={styles.navBar}>
        <Tab icon="home" label="Home" path="/receiver/home" />
        <Tab icon="medkit" label="Request" path="/receiver/request" />
        <Tab icon="map" label="Camps" path="/receiver/camps" />
        <Tab icon="settings" label="Settings" path="/receiver/settings" active />
      </View>
    </View>
  );
}

type TabProps = {
  icon: any;
  label: string;
  path: string;
  active?: boolean;
};

function Tab({ icon, label, path, active }: TabProps) {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.tabButton} onPress={() => router.push(path)}>
      <Ionicons name={icon} size={22} color={active ? '#e53935' : '#888'} />
      <Text style={[styles.label, active && { color: '#e53935' }]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f5f5f5',
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  title: {
    fontWeight: '700',
    marginLeft: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  credRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderTopColor: '#eee',
    borderTopWidth: 1,
  },
  input: {
    backgroundColor: '#f1f1f1',
    padding: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  updateBtn: {
    marginTop: 14,
    backgroundColor: '#e53935',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  updateBtnText: {
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
