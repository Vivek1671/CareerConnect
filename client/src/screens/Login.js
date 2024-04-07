import { StyleSheet, Text, View,Image, TextInput, Linking, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { button1 } from '../common/formcss'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { errormessage, formgroup, head1, head2, input, label, link, link2 } from '../common/formcss'

import BASE_URL from '../../config';


const Login = ({navigation}) => {
  const [fdata, setFdata] = useState({
    email: '',
    password: ''
  })

  const [errormsg, setErrormsg] = useState(null);
  const Sendtobackend = () =>{
    // console.log(fdata);
  if(fdata.email == '' || fdata.password == ''){
    setErrormsg('All Fields are Required');
    return;
  }
  else{
    fetch(`${BASE_URL}/signin`,{
      method:'POST',
      headers:{
        'Content-Type' : 'application/json'
      },
      body:JSON.stringify(fdata)
    })
    .then(res=>res.json()).then(
      async data=>{
        console.log(data,"logifjaisf");
        if(data.error){
          setErrormsg(data.error);
        }
          else{
            console.log(data.token,"check");
            await AsyncStorage.setItem('token',data.token)
            alert('Login Successfully');
            navigation.navigate('FacultyDashboard');
           
        }
      }
    )
  }
}

  return (
    <View style={styles.container}>
        {/* <Image style={styles.logoimg} source={Logo} /> */}
      <View style={styles.container1}>
          {/* <Image style={styles.logoimg2} source={Adopimg} /> */}
       <View style={styles.s2}>
          <Text style={head1}> Faculty Login</Text>
          <Text style={head2}>Signin to Continue</Text>
          {
          errormsg ? <Text style={errormessage}>{errormsg}</Text> : null
        }
        <Text></Text>
        <View style={formgroup}>
          <Text style={label}>Email</Text>
          <TextInput style={input} 
          onPressIn={()=> setErrormsg(null)}
          onChangeText={(text) => setFdata({...fdata, email: text})}
          placeholderTextColor="black"
            placeholder='Enter your Email'
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Password</Text>
          <TextInput style={input}
          secureTextEntry={true}
          onPressIn={()=> setErrormsg(null)}
          onChangeText={(text) => setFdata({...fdata, password: text})}
          placeholderTextColor="black"
            placeholder='Enter your Password'
          />
        </View>
        <Text></Text>
        <TouchableOpacity onPress={Sendtobackend}>
        <Text style={button1}>Login</Text>
      </TouchableOpacity>
      {/* <TouchableOpacity>
        <Text style={button1} onPress={()=>{ 
        Sendtobackend();
        }}>Login</Text>
      </TouchableOpacity> */}
      </View>
      </View>
    </View>
  )
}

export default Login

const styles = StyleSheet.create({
  container:{
    width:'100%',
    height:'100%',
    display:'flex',
    backgroundColor:'white',
  },
  logoimg2:{
    position:'absolute',
    marginVertical:25,
    top:-25,
    width:'120%',
    height:'50%',
    resizeMode:'contain',
  },
  container1:{
    display:'flex ',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'100%',
  },
  s1:{
    display:'flex',
    justifyContent:'center',
    alignItems:'center',
    width:'100%',
    height:'50%',

  },
  s2:{
    display:'flex',
    // backgroundColor:'',
    width:'100%',
    height:'60%',
    borderTopLeftRadius:50,
    borderTopRightRadius:50,
    padding:20,
  },
  forgot:{
    display:'flex',
    alignItems:'flex-end',
    marginVertical:5,
    marginHorizontal:10,
  },
})