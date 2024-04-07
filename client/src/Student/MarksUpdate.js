import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../config';

const MarksUpdate = () => {
  const [email, setEmail] = useState('');
  const [marks, setMarks] = useState({
    sslc: '',
    hsc: '',
    ug: '',
    pg: ''
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await AsyncStorage.getItem('token');
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
          setEmail(data.email);
          // Assuming marks are also fetched from the API
          setMarks({
            sslc: `${data.sslc}%`,
            hsc: `${data.hsc}%`,
            ug: `${data.ug}%`,
            pg: `${data.pg}%`,
          });
        } else {
          console.error('Error fetching user details:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    fetchData();
  }, []);

  const handleInputChange = (key, value) => {
    setMarks({ ...marks, [key]: value });
  };

  const handleUpdateMarks = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const userToken = token;

      const response = await fetch(`${BASE_URL}/updateMarks`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${userToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email, sslc: marks.sslc, hsc: marks.hsc, ug: marks.ug, pg: marks.pg }),
      });

      const data = await response.json();

      if (response.ok) {
        // Handle success
        console.log('Marks updated successfully:', data.message);
        Alert.alert('Success', data.message);
      } else {
        // Handle error
        console.error('Error updating marks:', data.error);
        Alert.alert('Error', data.error);
      }
    } catch (error) {
      console.error('Error updating marks:', error);
      Alert.alert('Error', 'Failed to update marks');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text1}>Marks Update</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        editable={false}
      />
      <TextInput
        style={styles.input}
        placeholder="SSLC"
        value={marks.sslc}
        onChangeText={(text) => handleInputChange('sslc', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="HSC"
        value={marks.hsc}
        onChangeText={(text) => handleInputChange('hsc', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="UG"
        value={marks.ug}
        onChangeText={(text) => handleInputChange('ug', text)}
      />
      <TextInput
        style={styles.input}
        placeholder="PG"
        value={marks.pg}
        onChangeText={(text) => handleInputChange('pg', text)}
      />
      <Button title="Update Marks" onPress={handleUpdateMarks} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    marginBottom: 10,
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 25,
    color: 'purple',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

export default MarksUpdate;
