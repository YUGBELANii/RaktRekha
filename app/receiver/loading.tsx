import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ActivityIndicator, Image, StyleSheet, Text, View } from 'react-native';

export default function LoadingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Simulate donor match result
      const donorFound = Math.random() > 0.5;

      if (donorFound) {
        router.replace('/receiver/match');
      } else {
        router.replace('/receiver/nearbydonor');
      }
    }, 3000); // 3 seconds loading

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/images/loader.gif')} // replace with your animation or image
        style={styles.image}
      />
      <Text style={styles.text}>Searching for a matching donor...</Text>
      <ActivityIndicator size="large" color="#e53935" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 30,
  },
  text: {
    fontSize: 18,
    color: '#444',
    textAlign: 'center',
  },
});
