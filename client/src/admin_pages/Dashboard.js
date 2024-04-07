import * as React from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Home from './AdminHome';
import List from './List';
import Registration from './Registration';

// import Profile from './Profiles';

const CustomTabLabel = ({ label, focused, fontSize, fontWeight }) => (
  <Text style={{ fontSize, color: focused ? '#34495E' : '#A9CCE3', fontWeight: fontWeight }}>{label}</Text>
);

// Logout component
const Logout = ({ navigation }) => (
  <TouchableOpacity onPress={() => {
    // Implement your logout functionality here
    // For example, clearing user session or token
    // After logout, navigate user to login screen
    navigation.navigate('Welcome'); // Replace 'Login' with your login screen name
  }}>
    <Ionicons name="log-out" size={29} color="red" />
  </TouchableOpacity>
);

const Tab = createBottomTabNavigator();

export default function Dashboard({ navigation }) {
  return (
    <Tab.Navigator 
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          let iconSize=29;
          let iconColor='#0a7e8c';

          if (route.name === 'Home') {
            iconName = focused ? 'ios-home' : 'ios-home-outline';
          } else if (route.name === 'List') {
            iconName = focused ? 'list-circle' : 'list-circle-outline';
          } else if (route.name === 'Registration') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'Logout') {
            iconName = focused ? 'log-out' : 'log-out-outline';
          }

          if (route.name !== 'Logout') {
            return <Ionicons name={iconName} size={iconSize} color={iconColor} />;
          }

          // For Logout screen, return custom component
          return <Logout navigation={navigation} />;
        },
        tabBarLabel: ({ focused }) => {
          const fontSize = focused ? 15 : 15; // Adjust the font size here
          return <CustomTabLabel label={route.name} focused={focused} fontSize={fontSize} />;
        },
        // tabBarInactiveTintColor: 'indigo',
        // tabBarActiveTintColor: 'orangered',
      })}>
      <Tab.Screen name="Home" component={Home} options={{headerShown:false}} />
      <Tab.Screen name="List" component={List} options={{headerShown:false}} />
      <Tab.Screen name="Registration" component={Registration} options={{headerShown:false}} />
      <Tab.Screen name="Logout" component={Logout} options={{ tabBarLabel: 'Logout' }} />
    </Tab.Navigator>
  );
}
