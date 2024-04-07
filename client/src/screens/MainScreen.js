import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import { button2 } from '../common/formcss'
// import petlogo from '../../assets/CareerConnectwel.jpg'
import logo from '../../assets/CareerConnectwel.jpg'
// import {Ionicon} from

const MainScreen = ({navigation}) => {
  return (
    <View style={styles.container}>
    <Image style={styles.logoimg} source={logo}></Image>
      <Text style={styles.head}>Find <Text style={{color:'gold'}}>Your Career</Text></Text>
      <Text style={styles.head}>With Us</Text>
      <Text style={button2}
      onPress={()=>navigation.navigate('Welcome')}
      >  Get Started</Text>
  
    </View>
  )
}

export default MainScreen

const styles = StyleSheet.create({
    container:{
        height:'100%',
        width:'100%',
        // backgroundColor:"purple",
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    head:{
        color:'white',
        fontSize:53,
        top:-180,
        fontWeight:'bold',
        textAlign:'justify',
        fontFamily:'serif'
    },
    // head1:{
    //     color:'white',
    //     textAlign:'center',
    //     top:-60,
    //     fontSize:22,
    // },
    logoimg:{
        position:'absolute',
        // top:0,
        width:'100%',
        height:'100%',
      },
      // searchIcon: {
      //   top:'17.2%',
      //   marginRight: 30,
      //   marginLeft: '-21%',
      // },
})