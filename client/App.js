import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import Welcome from './src/screens/Welcome';
import Login from './src/screens/Login';
import AdminLogin from './src/screens/Admin_Login';
import AllSelectedStudentsAdmin from './src/admin_pages/AllSelectedStudents';
// import Signup from './src/screens/Signup';
import MainScreen from './src/screens/MainScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import FacultyDashboard from './src/Faculty/FacultyDashboard';
// import Home from './src/Faculty/Home';
import Profile from './src/Faculty/Profile';
import StudentRegistration from './src/Faculty/StudentRegistration';
import Registration from './src/admin_pages/Registration';
import Dashboard from './src/admin_pages/Dashboard';
import StudentDashboard from './src/Student/StudentDashboard';
import AdminHome from './src/admin_pages/AdminHome';
import List from './src/admin_pages/List';
import StudentLogin from './src/Student/StudentLogin';
import DrawerNav from './Drawer';
import StudentProfile from "./src/Student/StudentProfile";
import StudentView from './src/Faculty/StudentView';
import AppliedStudent from './src/AppliedStudent';
import DeclinedStudent from './src/DeclinedStudent';
import Applied from './src/Faculty/Applied';
import AppliedList from './src/Student/AppliedList';
import AdminDashboard from './src/admin_pages/AdminDashboard';
import UpdatePassword from './src/Student/UpdatePassword';
import NotSelectedStudents from './src/admin_pages/NotSelectedStudents';
import ViewFaculty from './src/admin_pages/ViewFaculty';
import MarksUpdate from './src/Student/MarksUpdate';
// import StudentHome from "./src/Student/StudentHome";

const Stack = createNativeStackNavigator();

export default function App() {
  return (

<NavigationContainer>
      <Stack.Navigator>
      <Stack.Screen name="MainScreen" component={MainScreen} options={{headerShown:false}}/>
      <Stack.Screen name="AdminLogin" component={AdminLogin} options={{headerShown:false}}/>
      <Stack.Screen name="Welcome" component={Welcome} options={{headerShown:false}}/>
      <Stack.Screen name="Login" component={Login} options={{headerShown:false}}/>
      {/* <Stack.Screen name="Signup" component={Signup} options={{headerShown:false}} /> */}
      <Stack.Screen name="FacultyDashboard" component={FacultyDashboard} options={{headerShown:false}}/>
      <Stack.Screen name="StudentView" component={StudentView} options={{headerShown:false}}/>
      {/* <Stack.Screen name="Home" component={Home} options={{headerShown:false}}/> */}
      <Stack.Screen name="Profile" component={Profile} options={{headerShown:false}}/>
      <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{ headerShown:false }}/>
      <Stack.Screen name="Registration" component={Registration} options={{headerShown:false}}/>
      <Stack.Screen name="AdminDashboard" component={AdminDashboard} options={{ headerShown:false }} />
      <Stack.Screen name="AdminHome" component={AdminHome} options={{headerShown:false}}/>
      <Stack.Screen name="List" component={List} options={{headerShown:false}}/>
      <Stack.Screen name="StudentRegistration" component={StudentRegistration} options={{headerShown:false}}/>
      <Stack.Screen name="StudentLogin" component={StudentLogin} options={{headerShown:false}}/>
      <Stack.Screen name="DrawerNav" component={DrawerNav} options={{headerShown:false}}/>
      <Stack.Screen name="StudentProfile" component={StudentProfile} options={{headerShown:false}}/>
      <Stack.Screen name="AppliedStudent" component={AppliedStudent} options={{headerShown:false}}/>
      <Stack.Screen name="DeclinedStudent" component={DeclinedStudent} options={{headerShown:false}}/>
      <Stack.Screen name="Applied" component={Applied} options={{headerShown:false}}/>
      <Stack.Screen name="AppliedList" component={AppliedList} options={{headerShown:false}}/>
      <Stack.Screen name="UpdatePassword" component={UpdatePassword} options={{headerShown:false}}/>
      <Stack.Screen name="SelectedStudentsAdmin" component={AllSelectedStudentsAdmin} options={{headerShown:false}}/>
      <Stack.Screen name="NotSelectedStudents" component={NotSelectedStudents} options={{headerShown:false}} />
      <Stack.Screen name="ViewFaculty" component={ViewFaculty} options={{headerShown:false}} />
      <Stack.Screen name="MarksUpdate" component={MarksUpdate} options={{headerShown:false}} />
      </Stack.Navigator>
    </NavigationContainer>
     
  );
}

