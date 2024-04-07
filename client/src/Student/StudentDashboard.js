import React, { useRef, useState, useEffect } from 'react';
import { DrawerLayoutAndroid, StyleSheet, Text, View, TextInput, FlatList, TouchableOpacity, Button, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

import BASE_URL from '../../config';

const StudentDashboard = () => {
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
    fetchJobDetails(); // Fetch job details when component mounts
    const intervalId = setInterval(fetchJobDetails, 1000); // Fetch job details every 1 seconds
  
    // Clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, [filteredJobDetails]); // Add filteredJobDetails as a dependency
  

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      if (response.status === 200) {
        const jobsData = response.data;
        setJobDetails(jobsData); // Update job details state
        filterJobsByDepartment(jobsData); // Filter job details based on department
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };
  
  
  const filterJobsByDepartment = (jobs) => {
    const filteredJobs = jobs.filter(job => userDetails.department && job.selectedCheckboxes.includes(userDetails.department));
    setFilteredJobDetails(filteredJobs);
  };
  


  const handleApply = async (jobId) => {
    try {
      const job = filteredJobDetails.find(item => item._id === jobId);
      if (!job) {
        console.error('Job not found');
        return;
      }
  
      const lastDate = new Date(job.date);
      const currentDate = new Date();
  
      if (currentDate > lastDate) {
        Alert.alert("Error", "The last date for submission has passed.");
        return;
      }
  
      const requestData = {
        regno: userDetails.regno,
        department: userDetails.department,
        name: userDetails.name,
        status: "Applied"
      };
  
      // Perform API call to update job status with applied student
      const response = await axios.post(`${BASE_URL}/jobs/${jobId}/apply`, requestData);
  
      // Handle response
      console.log(response.data); // Log response or handle as needed
      Alert.alert("Success", "Applied for the job successfully!");
    } catch (error) {
      console.error('Error applying for job:', error);
      Alert.alert("Error", "Failed to apply for the job");
    }
  };
  
  const handleDecline = async (jobId) => {
    try {
      const job = filteredJobDetails.find(item => item._id === jobId);
      if (!job) {
        console.error('Job not found');
        return;
      }
  
      const lastDate = new Date(job.date);
      const currentDate = new Date();
  
      if (currentDate > lastDate) {
        Alert.alert("Error", "The last date for submission has passed.");
        return;
      }
  
      const requestData = {
        regno: userDetails.regno,
        department: userDetails.department,
        name: userDetails.name
      };
  
      // Perform API call to update job status with declined student
      const response = await axios.post(`${BASE_URL}/jobs/${jobId}/decline`, requestData);
      // Handle response
      console.log(response.data); // Log response or handle as needed
      Alert.alert("Success", "Declined the job successfully!");
    } catch (error) {
      console.error('Error declining job:', error);
      Alert.alert("Error", "Failed to decline the job");
    }
  };
  


   const renderJobItem = () => {

    if (filteredJobDetails.length === 0) {
      return <Text style={{textAlign:'center',fontWeight:'bold',color:'orangered'}}>No Jobs Published For Your Department</Text>;
    }

    const allJobsApplied = filteredJobDetails.every(item => {
      const isApplied = item.Appliedstudent.some(student => student.regno === userDetails.regno);
      return isApplied;
    });
  
    if (allJobsApplied) {
      return <Text style={{textAlign:'center',fontWeight:'bold',color:'blue'}}>No Jobs Available</Text>;
    }

    return filteredJobDetails.map(item => {
      
      // Check if the student's regno is in the Appliedstudent array
      const isApplied = item.Appliedstudent.some(student => student.regno === userDetails.regno);
      
      const isDecline = item.DeclineStudent.some(student => student.regno === userDetails.regno);
      // If the student has applied, do not render the job card
      if (isApplied  || isDecline) {
        return null;
      }

      // If the student has not applied, render the job card
      return (
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
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ borderWidth: 1, borderRadius: 10, overflow: 'hidden', borderColor: 'green' }}>
            <Button title="Apply" onPress={() => handleApply(item._id)} color="green" />
          </View>
          <View style={{ borderWidth: 1, borderRadius: 10, overflow: 'hidden', borderColor: 'red' }}>
            <Button title="Decline" onPress={() => handleDecline(item._id)} color="#FF0000" />
          </View>
        </View>
      </View>
      );
    });
  };

  const navigationView = () => (
    <View style={[styles.container, styles.navigationContainer]}>
      <FontAwesome name="user-circle-o" size={80} color="#0a7e8c" style={styles.searchIcon} />
      <Text style={styles.text}>{userDetails.name}</Text>
      <Text style={styles.text}>{userDetails.email}</Text>
      <TouchableOpacity onPress={handleProfile}>
        <Text style={[styles.text2, styles.profileText]}>Profile</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleAppliedList}>
        <Text style={[styles.text2, styles.profileText]}>Interviews</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleProfileUpdate}>
        <Text style={[styles.text2, styles.profileText]}>Profile Update</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleUpdatePassword}>
        <Text style={[styles.text2, styles.profileText]}>Password Change</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );

  const handleProfile = () => {
    navigation.navigate("StudentProfile");
  };
  const handleAppliedList = () => {
    navigation.navigate("AppliedList");
  };
  const handleProfileUpdate = () => {
    navigation.navigate("MarksUpdate");
  };
  const handleUpdatePassword = () => {
    navigation.navigate("UpdatePassword");
  };
  const handleLogout = async () => {
    navigation.navigate('Welcome'); 
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredJobs = jobDetails.filter(job => {
      const { companyName, jobRole, companyAddress, institution, campus } = job;
      const lowerCaseQuery = text.toLowerCase();
      return (
        companyName.toLowerCase().includes(lowerCaseQuery) ||
        jobRole.toLowerCase().includes(lowerCaseQuery) ||
        companyAddress.toLowerCase().includes(lowerCaseQuery) ||
        institution.toLowerCase().includes(lowerCaseQuery) ||
        campus.toLowerCase().includes(lowerCaseQuery) 
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
      {/* <View style={styles.container}> */}
        {/* <Ionicons
          name="menu"
          size={35}
          color="white"
          style={styles.menuIcon}
          onPress={() => drawer.current.openDrawer()}
        /> */}
        {/* </View> */}
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
      {/* <View style={{marginTop:'10%'}}>
      <FlatList
          data={filteredJobDetails}
          renderItem={renderJobItem}
          keyExtractor={(item) => item._id}
          ListEmptyComponent={<Text style={{textAlign:"center", fontWeight:'bold',color:'orangered'}}>No Jobs Published for Your Department</Text>}
        />
      </View> */}
      
      <ScrollView >
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
  // scrollView: {
  //   display: 'flex',
  //   width: '100%',
  //   marginTop: '10%',
  //   height: '78%',
  //   padding: 10,
  // },
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

export default StudentDashboard;
