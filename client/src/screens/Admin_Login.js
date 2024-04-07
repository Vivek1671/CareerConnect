import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { button1 } from '../common/formcss';
import { errormessage, formgroup, head1, head2, input, label } from '../common/formcss';

import BASE_URL from '../../config';

const AdminLogin = ({ navigation }) => {
  const [fdata, setFdata] = useState({
    email: '',
    password: ''
  });

  const [errormsg, setErrormsg] = useState(null);

  const SendToBackend = () => {
    if (fdata.email === '' || fdata.password === '') {
      setErrormsg('All Fields are Required');
      return;
    } else {
      fetch(`${BASE_URL}/Admin/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(fdata)
      })
        .then(res => res.json())
        .then(async data => {
          console.log(data, "logifjaisf");
          if (data.error) {
            setErrormsg(data.error);
          } else {
            console.log(data.token, "check");
            await AsyncStorage.setItem('token', data.token);
            alert('Login Successfully');
            navigation.navigate('AdminDashboard');
          }
        })
        .catch(error => {
          console.error('Error fetching user details:', error);
          setErrormsg('Error: ' + error.message);
        });
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.s2}>
        <Text style={head1}>Admin Login</Text>
        <Text style={head2}>Sign in to Continue</Text>
        {errormsg ? <Text style={errormessage}>{errormsg}</Text> : null}
        <View style={formgroup}>
          <Text style={label}>Email</Text>
          <TextInput
            style={input}
            onPressIn={() => setErrormsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, email: text })}
            placeholderTextColor="black"
            placeholder='Enter your Email'
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Password</Text>
          <TextInput
            style={input}
            secureTextEntry={true}
            onPressIn={() => setErrormsg(null)}
            onChangeText={(text) => setFdata({ ...fdata, password: text })}
            placeholderTextColor="black"
            placeholder='Enter your Password'
          />
        </View>
        <Text></Text>
        <TouchableOpacity onPress={SendToBackend}>
        <Text style={button1}>Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  s2: {
    marginVertical:'50%',
    flex: 1,
  },
});

export default AdminLogin;
