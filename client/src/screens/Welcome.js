import { View, Text, Pressable, Image, StyleSheet, ImageBackground } from 'react-native';
import React from 'react';

const Welcome = ({ navigation }) => {
  return (
    <ImageBackground source={require('../../assets/laptop.jpg')} style={styles.container}>
    <View style={styles.container}>
      <Text style={styles.headerText}>SELECT  YOUR  ROLE</Text>
      <Text></Text>
      <Text></Text>
      <Pressable style={styles.imageContainer} onPress={() => navigation.navigate('AdminLogin')}>
        <Image source={require('../../assets/admin-.png')} style={styles.image} />
      </Pressable>
      <Pressable style={styles.imageContainer} onPress={() => navigation.navigate('Login')}>
        <Image source={require('../../assets/faculty-.png')} style={styles.image} />
      </Pressable>
      <Pressable style={styles.imageContainer} onPress={() => navigation.navigate('StudentLogin')}>
        <Image source={require('../../assets/student-.png')} style={styles.image} />
      </Pressable>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 15,
    fontFamily: "serif",
    color:'darkturquoise'
  },
  imageContainer: {
    width: '50%',
    aspectRatio: 1, 
    marginBottom: 10,
  },
 image: {
    width: '80%',
    height: '80%',
    resizeMode: 'cover',
    marginLeft:'10%'
}

});

export default Welcome;
