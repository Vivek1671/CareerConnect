import { StyleSheet, Text, View, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import BASE_URL from '../../config';
import axios from 'axios';

const AppliedList = () => {
  const [userDetails, setUserDetails] = useState({});
  const [jobDetails, setJobDetails] = useState([]);

  // Fetch user details and job details on component mount
  useEffect(() => {
    async function fetchData() {
      // Fetch user details
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
          setUserDetails(data);
        } else {
          console.error('Error fetching user details:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    }

    fetchData();
    fetchJobDetails();
  }, [userDetails, jobDetails]);

  // Fetch job details
  const fetchJobDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/jobs`);
      if (response.status === 200) {
        setJobDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching job details:', error);
    }
  };

  // Filter jobs where the user has applied
  const filteredJobs = jobDetails.filter(job =>
    job.Appliedstudent.some(student => student.regno === userDetails.regno)
  );

  // Filter jobs where the user has declined
  const declinedJobs = jobDetails.filter(job =>
    job.DeclineStudent.some(student => student.regno === userDetails.regno)
  );

  // Reverse the array to display the last applied job at the top
  filteredJobs.reverse();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Jobs Applied</Text>
      {filteredJobs.length > 0 ? (
        <ScrollView>
          {filteredJobs.map(job => (
            <TouchableOpacity key={job._id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.name}>Company Name: {job.companyName}</Text>
                <Text style={styles.text}>Role: {job.jobRole}</Text>
                <Text style={styles.text}>Campus: {job.campus}</Text>
                <Text
                  style={[
                    styles.status,
                    {
                      color: job.Appliedstudent.find(student => student.regno === userDetails.regno)?.status === 'Selected' ? 'green' : 'blue'
                    }
                  ]}
                >
                  Status: {job.Appliedstudent.find(student => student.regno === userDetails.regno)?.status}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
          {/* Display declined job details */}
          {declinedJobs.map(job => (
            <TouchableOpacity key={job._id} style={styles.card}>
              <View style={styles.cardContent}>
                <Text style={styles.name}>Company Name: {job.companyName}</Text>
                <Text style={styles.text}>Role: {job.jobRole}</Text>
                <Text style={styles.text}>Campus: {job.campus}</Text>
                <Text style={styles.status}>Status: Declined</Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      ) : (
        <Text style={styles.message}>You haven't applied for any jobs.</Text>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 25,
    marginBottom: 20,
    textAlign:'center',
  },
  card: {
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: '#f0f0f0',
    elevation: 3,
  },
  cardContent: {
    padding: 20,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  status: {
    fontSize: 16,
    fontWeight: 'bold',
    color:'red'
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
    color:'red'
  },
});

export default AppliedList;
