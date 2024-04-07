import { StyleSheet, Text, View,Image, TextInput, Linking, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { button1 } from '../common/formcss'
import { errormessage, formgroup, head1, head2, input, input2, label, link, link2 } from '../common/formcss'
import BASE_URL from '../../config';

const Registration = ({navigation}) => {

const [fdata, setFdate]=useState({
  name: '',
  email: '',
  password: '',
  cpassword: '',
  department: '',
  phone:'',
  designation: '',
})

const [errormsg, setErrormsg] = useState(null);

const Sendtobackend =()=>{
  // console.log(fdata);
  if(fdata.name == '' || fdata.email == '' || fdata.password == '' || fdata.cpassword == '' || fdata.department =='' || fdata.phone == '' || fdata.designation == ''){
    setErrormsg('All fields are required');
    return;
  }
  else{
    if(fdata.password != fdata.cpassword){
      setErrormsg('Password and Confirm Password must be same');
      return;
    }
    else{
      fetch(`${BASE_URL}/signup`,{
        method:'POST',
        headers:{
          'Content-Type' : 'application/json'
        },
        body:JSON.stringify(fdata)
      })
      .then(res=>res.json()).then(
        data=>{
          // console.log(data);
          if(data.error){
            setErrormsg(data.error);
          }
            else{
              Alert.alert('New Faculty Registered');
              // navigation.navigate('Login');
          }
        }
      )
    }
  }
}

  return (
    <View style={styles.container}>
      <View style={styles.container1}>

       <ScrollView style={styles.s2}>
          <Text style={head1}>New Faculty Registration</Text>
        <Text></Text>
        {
          errormsg ? <Text style={errormessage}>{errormsg}</Text> : null
        }
        <View style={formgroup}>
          <Text style={label}>Name</Text>
          <TextInput style={input} placeholder='Enter your name' 
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, name: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Email</Text>
          <TextInput style={input} placeholder='Enter your Email'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, email: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Phone</Text>
          <TextInput style={input} placeholder='Enter your Mobile Number'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(number) => setFdate({...fdata, phone: number})}
          />
          </View>
          <View style={formgroup}>
          <Text style={label}>Designation</Text>
          <TextInput style={input} placeholder='Enter your Designation'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, designation: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Department</Text>
          <TextInput style={input} placeholder='Enter your Department'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, department: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Password</Text>
          <TextInput style={input} placeholder='Enter your Password'
          placeholderTextColor="black"
          secureTextEntry={true}
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, password: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Confirm Password</Text>
          <TextInput style={input} placeholder='Confirm your Password'
          placeholderTextColor="black"
          secureTextEntry={true}
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, cpassword: text})}
          />
        </View>
        
        
        <Text style={button1} onPress={()=>{
          Sendtobackend();
        }}>Signup</Text>
        <Text></Text>
      </ScrollView>
      </View>
    </View>
  )
}

export default Registration

const styles = StyleSheet.create({
  container:{
    width:'100%',
    height:'100%',
    display:'flex',
  },
  logoimg:{
    position:'absolute',
    top:-100,
    resizeMode:"contain",
    width:'100%',
    // height:'100%',
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
    height:'15%',

  },
  s2:{
    display:'flex',
    backgroundColor:'#FFF',
    width:'100%',
    height:'90%',
    padding:10,
  },
  forgot:{
    display:'flex',
    alignItems:'flex-end',
    marginVertical:5,
    marginHorizontal:10,
  }
})