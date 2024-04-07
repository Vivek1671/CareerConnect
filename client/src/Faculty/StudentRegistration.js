import { StyleSheet, Text, View,Image, TextInput, Linking, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { button1 } from '../common/formcss'
import { errormessage, formgroup, head1, head2, input, input2, label, link, link2 } from '../common/formcss'
import BASE_URL from '../../config';

const StudentRegistration = ({navigation}) => {

const [fdata, setFdate]=useState({
  name: '',
  department:'',
  regno: '',
  email: '',
  password: '',
  cpassword: '',
  dob: '',
  phone:'',
  address: '',
  sslc:'',
  hsc:'',
  ug:'',
  pg:'',
})

const [errormsg, setErrormsg] = useState(null);

const Sendtobackend =()=>{
  // console.log(fdata);
  if(fdata.name == '' || fdata.department == '' || fdata.regno == '' || fdata.email == '' || fdata.password == '' || fdata.cpassword == '' || fdata.dob =='' || fdata.address == '' || fdata.phone == '' || fdata.sslc == '' || fdata.hsc == '' || fdata.ug == '' || fdata.pg == ''){
    setErrormsg('All fields are required');
    return;
  }
  else{
    if(fdata.password != fdata.cpassword){
      setErrormsg('Password and Confirm Password must be same');
      return;
    }
    else{
      fetch(`${BASE_URL}/register`,{
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
            console.log("error");
          }
            else{
              Alert.alert('New Student Registered');
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
          <Text style={head1}>New Student Registration</Text>
        <Text></Text>
        {
          errormsg ? <Text style={errormessage}>{errormsg}</Text> : null
        }
        <View style={formgroup}>
          <Text style={label}>Name</Text>
          <TextInput style={input} placeholder='Student Name' 
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, name: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Department</Text>
          <TextInput style={input} placeholder='Department' 
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, department: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Reg No</Text>
          <TextInput style={input} placeholder='Register Number' 
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, regno: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Email</Text>
          <TextInput style={input} placeholder='Student Email ID'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, email: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Phone</Text>
          <TextInput style={input} placeholder=' Mobile Number'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(number) => setFdate({...fdata, phone: number})}
          />
          </View>
        <View style={formgroup}>
          <Text style={label}>Dob</Text>
          <TextInput style={input} placeholder=' Date of Birth'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, dob: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Password</Text>
          <TextInput style={input} placeholder=' Password'
          placeholderTextColor="black"
          secureTextEntry={true}
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, password: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Confirm Password</Text>
          <TextInput style={input} placeholder='Confirm Password'
          placeholderTextColor="black"
          secureTextEntry={true}
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, cpassword: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>Address</Text>
          <TextInput style={input2} placeholder='Student Address'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(text) => setFdate({...fdata, address: text})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>SSLC</Text>
          <TextInput style={input} placeholder='SSLC'
          placeholderTextColor="black"
          // secureTextEntry={tre}
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(number) => setFdate({...fdata, sslc: number})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>HSC</Text>
          <TextInput style={input} placeholder='HSC Percentage'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(number) => setFdate({...fdata, hsc: number})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>UG</Text>
          <TextInput style={input} placeholder='UG Percentage'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(number) => setFdate({...fdata, ug: number})}
          />
        </View>
        <View style={formgroup}>
          <Text style={label}>PG</Text>
          <TextInput style={input} placeholder='PG Percentage'
          placeholderTextColor="black"
          onPressIn={()=> setErrormsg(null)}
            onChangeText={(number) => setFdate({...fdata, pg: number})}
          />
        </View>
        
        <Text style={button1} onPress={()=>{
          Sendtobackend();
        }}>Register</Text>
        <Text></Text>
      </ScrollView>
      </View>
    </View>
  )
}

export default StudentRegistration

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