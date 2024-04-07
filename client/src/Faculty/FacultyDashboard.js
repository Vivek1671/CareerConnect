import React, { useRef, useState, useEffect } from 'react';
import { DrawerLayoutAndroid, StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Button, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import BASE_URL from '../../config';

const FacultyDashboard = () => {
  const drawer = useRef(null);
  const navigation = useNavigation();
  const [userDetails, setUserDetails] = useState({});
  const [jobDetails, setJobDetails] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredJobDetails, setFilteredJobDetails] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const token = await AsyncStorage.getItem('token');
        const apiUrl = `${BASE_URL}/faculty/`;
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
          setUserDetails(data); // Store user details in state
        } else {
          console.error('Error fetching user details:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    fetchData();
  }, []);

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      if (response.status === 200) {
        setJobDetails(response.data);
        setFilteredJobDetails(response.data); // Initialize filtered job details with all jobs
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  const countAppliedAndDeclinedStudents = (filteredJobDetails, eligibleStudents) => {
    let appliedStudents = new Set();
    let declinedStudents = new Set();
  
    filteredJobDetails.forEach(item => {
      const eligibleDepartmentStudents = eligibleStudents[item.Department] || []; // Get eligible students for the department
      item.Appliedstudent.forEach(student => {
        if (eligibleDepartmentStudents.includes(student.regno)) {
          appliedStudents.add(student.regno);
        }
      });
      item.DeclineStudent.forEach(student => {
        if (eligibleDepartmentStudents.includes(student.regno)) {
          declinedStudents.add(student.regno);
        }
      });
    });
  
    return {
      totalAppliedStudents: appliedStudents.size,
      totalDeclinedStudents: declinedStudents.size
    };
  };

  const renderJobItem = () => {
    return filteredJobDetails.map(item => (
      <View key={item._id} style={styles.card}>
        <Text style={styles.label}>Company Name: <Text style={{color:"#0097FF", fontWeight:900,fontSize:25}}>{item.companyName}</Text></Text>
        <Text style={styles.label}>Job Role: <Text style={styles.jobDetail}>{item.jobRole}</Text></Text>
        <Text style={styles.label}>Company Address: <Text style={styles.jobDetail}>{item.companyAddress}</Text></Text>
        <Text style={styles.label}>Campus: <Text style={styles.jobDetail}>{item.campus}</Text></Text>
        <Text style={styles.label}>Institution: <Text style={styles.jobDetail}>{item.institution}</Text></Text>
        <Text style={styles.label}>Job Description: <Text style={styles.jobDetail}>{item.jobDescription}</Text></Text>
        <Text style={styles.label}>Salary: <Text style={styles.jobDetail}>{item.salary}</Text></Text>
        <Text style={styles.label}>Eligible: <Text style={styles.jobDetail}>{item.selectedCheckboxes}</Text></Text>
        <Text style={styles.label}>Last Date: <Text style={{color:'orangered'}}>{item.date}</Text></Text>
  
        <View style={styles.rowContainer}>
          <TouchableOpacity onPress={() => handleAppliedStudents(item.Appliedstudent)}>
            <View style={styles.studentCountContainer}>
              <View style={styles.studentCountBox}>
                <Text style={styles.studentCountText}>Applied: {item.Appliedstudent.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
  
          <TouchableOpacity onPress={() => handleDeclinedStudents(item.DeclineStudent)}>
            <View style={styles.studentCountContainer}>
              <View style={styles.studentCount}>
                <Text style={styles.studentCountText}>Declined: {item.DeclineStudent.length}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    ));
  };

  const handleAppliedStudents = (appliedStudents) => {
    if (appliedStudents.length === 0) {
      Alert.alert('Applied Students', 'No one has applied for this job.');
    } else {
      // Navigate to AppliedStudent page with applied student details
      navigation.navigate('Applied', { appliedStudents: appliedStudents });
    }
  };

  const handleDeclinedStudents = (declinedStudents) => {
    if (declinedStudents.length === 0) {
      Alert.alert('Declined Students', 'No one has declined this job.');
    } else {
      // Display details of declined students
      navigation.navigate('DeclinedStudent', { declinedStudents: declinedStudents });
    }
  };

  const handleProfile = () => {
    navigation.navigate("Profile");
  };
  
  const handleNewStudent = () => {
    navigation.navigate("StudentRegistration");
  };
  
  const handleStudents = () => {
    navigation.navigate("StudentView");
  };

  const handleSelectedList = () => {
    navigation.navigate("SelectedStudentsAdmin");
  };

  const handleNonSelectedList = () => {
    navigation.navigate("NotSelectedStudents");
  };

  const handleLogout = async () => {
    navigation.navigate('Welcome'); 
  };

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <FontAwesome name="user-circle-o" size={80} color="#0a7e8c" style={styles.searchIcon} />
      <Text style={styles.text}>{userDetails.name}</Text>
      <Text style={styles.text}>{userDetails.email}</Text>
      <TouchableOpacity onPress={handleProfile}>
        <Text style={[styles.text2, styles.profileText]}>profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNewStudent}>
        <Text style={[styles.text2, styles.profileText]}>New Student</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleStudents}>
        <Text style={[styles.text2, styles.profileText]}>Students List</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleSelectedList}>
        <Text style={[styles.text2, styles.profileText]}>Selected List</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleNonSelectedList}>
        <Text style={[styles.text2, styles.profileText]}>Non-Selected List</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </TouchableOpacity>
    </View>
  );

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredJobs = jobDetails.filter(job => {
      const { companyName, jobRole, companyAddress, institution, campus, selectedCheckboxes } = job;
      const lowerCaseQuery = text.toLowerCase();
      return (
        companyName.toLowerCase().includes(lowerCaseQuery) ||
        jobRole.toLowerCase().includes(lowerCaseQuery) ||
        companyAddress.toLowerCase().includes(lowerCaseQuery) ||
        institution.toLowerCase().includes(lowerCaseQuery) ||
        campus.toLowerCase().includes(lowerCaseQuery) ||
        selectedCheckboxes.toLowerCase().includes(lowerCaseQuery) 
      );
    });
    setFilteredJobDetails(filteredJobs);
  };

  return (
    <DrawerLayoutAndroid
      ref={drawer}
      drawerWidth={300}
      renderNavigationView={navigationView}
      drawerPosition="left"
    >
      <View style={{marginTop:'10%'}}>
        <TouchableOpacity>
          <Text style={styles.name}>Hello! {userDetails.name}</Text>
          <Ionicons
            name="menu"
            size={35}
            color="white"
            style={styles.menuIcon}
            onPress={() => drawer.current.openDrawer()}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            onChangeText={handleSearch}
            value={searchQuery}
          />
        </TouchableOpacity>
      </View>
      
      <ScrollView>
        {renderJobItem()}
      </ScrollView>
      
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
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Adjust as needed
  },
  navigationContainer: {
    marginTop: '-100%',
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
  text: {
    fontSize: 20,
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
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 25,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    borderWidth: .5,
    borderColor: 'grey',
    width: '95%',
    marginLeft: '2.5%',
  },
  studentCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
    marginTop: 10,
  },
  studentCountBox: {
    backgroundColor: '#5DC761',
    padding: 10,
    borderRadius: 5,
    width: '60%', // Adjust this width as needed
  },
  studentCount: {
    backgroundColor: '#EE6C6C',
    padding: 10,
    borderRadius: 5,
    width: '60%', // Adjust this width as needed
  },
  studentCountText: {
    textAlign:'center',
    fontWeight: 'bold',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 10,
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
  searchInput: {
    height: 40,
    borderColor: 'black',
    borderWidth: 1,
    width: '80%',
    marginTop: '5%',
    marginBottom: '5%',
    paddingHorizontal: 10,
    borderRadius: 10,
    alignSelf:'center'
  },
});

export default FacultyDashboard;
