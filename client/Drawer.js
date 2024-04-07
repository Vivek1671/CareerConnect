import React, { useRef } from 'react';
import { Button, DrawerLayoutAndroid, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons from Expo vector-icons

const DrawerNav = () => {
  const drawer = useRef(null);

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <Text style={styles.text}>Hi</Text>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      renderNavigationView={navigationView}
      drawerPosition="left" 
    >
      <View style={styles.container}>
        <Ionicons
          name="menu"
          size={32}
          color="black"
          style={styles.menuIcon}
          onPress={() => drawer.current.openDrawer()}
        />
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    marginTop:'10%'
  },
  navigationContainer: {
    backgroundColor: '#ecf0f1',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  menuIcon: {
    position: 'absolute',
    left: 16,
    top: 16,
  },
});

export default DrawerNav;
