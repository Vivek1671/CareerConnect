// UpdatePassword.js
import { View, TextInput, Button, StyleSheet, Alert, Text } from 'react-native';
import BASE_URL from '../../config';
import React, { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
const UpdatePassword = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userDetails, setUserDetails] = useState({});
  useEffect(() => {
    async function fetchData() {
      try {
        const token = await AsyncStorage.getItem('token');
        // Replace with your backend API URL and user token
        const apiUrl = `${BASE_URL}/student/`;
        const userToken = token;

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserDetails(data);
          setEmail(data.email)
        } else {
          console.error('Error fetching user details:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    fetchData();
  }, []);

  const handleUpdatePassword = async () => {
    try {
      const response = await fetch(`${BASE_URL}/updatePassword`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, confirmPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        Alert.alert('Success', data.message);
      } else {
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
      Alert.alert('Error', 'Failed to update password');
    }
  };

  return (
    <View style={styles.container}>
    <Text style={styles.text1}>Change Your Password</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry
        value={confirmPassword}
        onChangeText={setConfirmPassword}
      />
      <Button title="Update Password" onPress={handleUpdatePassword} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: .8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  text1:{
    marginBottom: 10,
    // marginTop:50, 
    textAlign:'center',
    fontWeight:"bold",
    fontSize:25,
    color:'purple'
  }
});

export default UpdatePassword;
