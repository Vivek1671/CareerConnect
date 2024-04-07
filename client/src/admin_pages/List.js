import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, FlatList, Button, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import BASE_URL from '../../config';

const List = () => {
  const navigation = useNavigation();
  const [jobDetails, setJobDetails] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    fetchJobDetails();
  }, []);

  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      if (response.status === 200) {
        setJobDetails(response.data); // Assuming the response contains an array of job details
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  

  useEffect(() => {
    const interval = setInterval(() => {
      fetchJobDetails();
    }, 3000); // Fetch job details every 5 seconds

    // Clear the interval when the component is unmounted
    return () => clearInterval(interval);
  }, []); // Run only on component mount

  const renderJobItem = ({ item }) => (
    <View style={styles.card}>
    <Text style={styles.label}>Company Name: <Text style={{color:"#0097FF", fontWeight:900,fontSize:25}}>{item.companyName}</Text></Text>
    <Text style={styles.label}>Job Role: <Text style={styles.jobDetail}>{item.jobRole}</Text></Text>
    <Text style={styles.label}>Company Address: <Text style={styles.jobDetail}>{item.companyAddress}</Text></Text>
    <Text style={styles.label}>Campus: <Text style={styles.jobDetail}>{item.campus}</Text></Text>
{item.campus === 'Off-Campus' && (
  <Text style={styles.label}>
    Off-Campus Incharge: <Text style={{color:'orangered'}}>{item.offCampusDetails}</Text>
  </Text>
)}
    <Text style={styles.label}>Venue: <Text style={styles.jobDetail}>{item.venue}</Text></Text>
    <Text style={styles.label}>Institution: <Text style={styles.jobDetail}>{item.institution}</Text></Text>
    <Text style={styles.label}>Eligible: <Text style={{color:'blue'}}>{item.selectedCheckboxes}</Text></Text>
    <Text style={styles.label}>Job Description: <Text style={styles.jobDetail}>{item.jobDescription}</Text></Text>
    <Text style={styles.label}>Salary: <Text style={styles.jobDetail}>{item.salary}</Text></Text>
    <Text style={styles.label}>Last Date: <Text style={{color:'orangered'}}>{item.date}</Text></Text>
    <TouchableOpacity onPress={toggleExpanded} style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={{color:'purple',fontWeight:"bold",fontSize:20}}>Hr Details</Text>
        <Ionicons name={isExpanded ? 'chevron-up-circle-outline' : 'chevron-down-circle-outline'} size={24} color="black" />
      </TouchableOpacity>
      {isExpanded && (
        <View>
        <Text style={styles.label}>Hr Name: <Text style={styles.jobDetail}>{item.hrName}</Text></Text>
          <Text style={styles.label}>Hr mobile: <Text style={styles.jobDetail}>{item.hrMobile}</Text></Text>
          <Text style={styles.label}>Hr Gmail: <Text style={styles.jobDetail}>{item.hrGmail}</Text></Text>
        </View>
      )}
    {/* <Button title="Delete Company" onPress={() => handleDeleteCompany(item._id)}  color="red" /> */}
    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>

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
    <Button title="Delete Company" onPress={() => handleDeleteCompany(item._id)}  color="red" />
    </View>
  );

  const handleAppliedStudents = (appliedStudents) => {
    if (appliedStudents.length === 0) {
      Alert.alert('Applied Students', 'No one has applied for this job.');
    } else {
      // Navigate to AppliedStudent page with applied student details
      navigation.navigate('AppliedStudent', { appliedStudents: appliedStudents });
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

  
  const handleDeleteCompany = async (companyId) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete the company?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await axios.delete(`${BASE_URL}/jobs/${companyId}/delete`);
              if (response.status === 200) {
                Alert.alert('Success', 'Company deleted successfully.');
                fetchJobDetails(); // Fetch job details again to reflect the changes
              } else {
                Alert.alert('Error', 'Failed to delete company.');
              }
            } catch (error) {
              console.error('Error deleting company:', error);
              Alert.alert('Error', 'Failed to delete company.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Published Job's</Text>
      <FlatList
        data={jobDetails}
        renderItem={renderJobItem}
        keyExtractor={(item) => item._id} // Assuming each job detail has a unique identifier
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign:'center',
    marginTop: 30,
    marginBottom: 20,
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
    borderWidth:.5,
    borderColor:'grey'
  },
  studentCountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: 8,
    marginTop: 10,
    marginBottom:20
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
  jobTitle: {
    fontSize: 18,
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
});

export default List;
