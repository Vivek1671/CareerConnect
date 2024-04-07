import React, { useRef, useState, useEffect } from 'react';
import { DrawerLayoutAndroid, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import axios from 'axios';
import BASE_URL from '../../config';

// const Card = ({ title, detail }) => {
//   return (
//     <View style={styles.card}>
//       <Text style={styles.jobTitle}>{title}</Text>
//       <Text style={styles.jobDetail}>{detail}</Text>
//     </View>
//   );
// };

const AdminDashboard = () => {
  const drawer = useRef(null);
  const navigation = useNavigation();
  const [publishedCompaniesCount, setPublishedCompaniesCount] = useState(0);
  const [publishedStudentsCount, setPublishedStudentsCount] = useState(0);
  const [publishedSelectedCount, setPublishedSelectedCount] = useState(0);
  const [publishedNotSelectedCount, setPublishedNotSelectedCount] = useState(0);

  useEffect(() => {
    fetchPublishedCompaniesCount();
    fetchPublishedStudentsCount();
  }, [publishedCompaniesCount,publishedStudentsCount,publishedSelectedCount,publishedNotSelectedCount]);

  const fetchPublishedCompaniesCount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      const jobs = response.data;
      const publishedCompaniesCount = jobs.length;
      setPublishedCompaniesCount(publishedCompaniesCount);
          // Count the number of job entries where the status of AppliedStudent is 'Selected'
    const selectedCount = jobs.reduce((count, job) => {
      const selectedStudents = job.Appliedstudent.filter(student => student.status === 'Selected');
      return count + selectedStudents.length;
    }, 0);
    const notselectedCount = jobs.reduce((count, job) => {
      const selectedStudents = job.Appliedstudent.filter(student => student.status === 'Not Selected');
      return count + selectedStudents.length;
    }, 0);
    setPublishedSelectedCount(selectedCount);
    setPublishedNotSelectedCount(notselectedCount);
    } catch (error) {
      console.error('Error fetching published companies count:', error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchPublishedCompaniesCount();
      fetchPublishedStudentsCount();
    }, 2000); // Refresh every 2 seconds
  
    // Cleanup function to clear interval when component unmounts or useEffect runs again
    return () => clearInterval(intervalId);
  }, []);
  

  const fetchPublishedStudentsCount = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/students`);
      const students = response.data;
      const publishedStudentsCount = students.length;
      setPublishedStudentsCount(publishedStudentsCount);
    } catch (error) {
      console.error('Error fetching published students count:', error);
    }
  };
  

  const handleProfile = () => {
    navigation.navigate("AdminHome");
  };
  
  const handleNewStudent = () => {
    navigation.navigate("List");
  };
  
  const handleStudents = () => {
    navigation.navigate("Registration");
  };

  const handleFaculties = () => {
    navigation.navigate("ViewFaculty");
  };

  const handleLogout = async () => {
    navigation.navigate('Welcome'); 
  };

  const handleJobs = async () => {
    navigation.navigate('List')
  }

  const handleViewStudents = async () =>{
    navigation.navigate('StudentView')
  }
  const handleSelectedStudents = async () =>{
    navigation.navigate('SelectedStudentsAdmin')
  }

  const handleNotSelectedStudents = async () =>{
    navigation.navigate('NotSelectedStudents')
  }

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <FontAwesome name="user-circle-o" size={80} color="#0a7e8c" style={styles.searchIcon} />
      <TouchableOpacity onPress={handleProfile}>
        <Text style={[styles.text2, styles.profileText]}>Job Publish</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNewStudent}>
        <Text style={[styles.text2, styles.profileText]}>Published Jobs</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleStudents}>
        <Text style={[styles.text2, styles.profileText]}>Add Faculty</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleFaculties}>
        <Text style={[styles.text2, styles.profileText]}>View Faculty</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      renderNavigationView={navigationView}
      drawerPosition="left"
    >
      <View style={{marginTop:'10%'}}>
        <TouchableOpacity>
          <Text style={styles.name}>Hello! Admin</Text>
          <Ionicons
            name="menu"
            size={35}
            color="white"
            style={styles.menuIcon}
            onPress={() => drawer.current.openDrawer()}
          />
        </TouchableOpacity>
      </View>
      <View>
        <TouchableOpacity onPress= {handleJobs}>
      <View style={styles.card}>
      <Text style={{fontSize:24,color:'purple',fontWeight:"bold"}}>NO OF INTERVIEW'S</Text>
      <Text style={styles.text1}>{publishedCompaniesCount}</Text>
    </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleViewStudents}>
        <View style={styles.card}>
      <Text style={{fontSize:24,color:'blue',fontWeight:"bold"}}>NO OF STUDENT'S</Text>
      <Text style={styles.text1}>{publishedStudentsCount}</Text>
    </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleSelectedStudents}>
        <View style={styles.card}>
      <Text style={{fontSize:24,color:'green',fontWeight:"bold"}}>SELECTED</Text>
      <Text style={styles.text1}>{publishedSelectedCount}</Text>
    </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNotSelectedStudents}>
        <View style={styles.card}>
      <Text style={{fontSize:24,color:'red',fontWeight:"bold"}}>NOT SELECTED</Text>
      <Text style={styles.text1}>{publishedNotSelectedCount}</Text>
    </View>
        </TouchableOpacity>
      </View>
    </DrawerLayoutAndroid>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    // marginTop: '10%',
  },
  navigationContainer: {
    marginTop: '-130%',
    backgroundColor: '#ecf0f1',
  },
  logoutButton: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 10,
    marginTop: 10,
    alignSelf: 'center',
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  text2: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0097FF',
  },
  menuIcon: {
    position: 'absolute',
    left: 16,
    top: 12,
    color:'white'
  },
  profileText: {
    marginTop: 20,
  },
  card: {
    padding: 40,
    borderRadius: 20,
    alignItems: 'center',
    top:'10%',
    marginBottom:"8%",
    borderWidth: 2, // Border width
    borderColor: 'gray', // Border color
    width:'90%',
    marginLeft:'5%',
    backgroundColor:"lightgray",
  },
  text1: {
    fontSize: 25,
    color: '#0097FF',
    fontWeight:'bold',
    marginTop:'5%'
  },
  jobDetail: {
    fontSize: 16,
    color: 'gray',
    fontWeight: '400',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  name: {
    fontWeight: 'bold',
    top: '5.6%',
    backgroundColor: "grey",
    padding: '2%',
    textAlign: 'center',
    fontSize: 23,
    color: 'white',
  },
});

export default AdminDashboard;
