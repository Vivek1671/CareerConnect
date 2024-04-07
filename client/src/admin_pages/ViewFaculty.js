import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Button, Alert } from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config';

const ViewFaculty = () => {
  const [facultyDetails, setFacultyDetails] = useState([]);

  useEffect(() => {
    fetchFacultyDetails();
  }, []);

  const fetchFacultyDetails = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/faculties`);
      if (response.status === 200) {
        setFacultyDetails(response.data);
      }
    } catch (error) {
      console.error('Error fetching faculty details:', error);
    }
  };

  const handleDeleteFaculty = async (id) => {
    Alert.alert(
      'Confirmation',
      'Are you sure you want to delete this faculty member?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const response = await axios.delete(`${BASE_URL}/faculties/${id}/delete`);
              if (response.status === 200) {
                fetchFacultyDetails(); // Refresh the faculty list after deletion
              } else {
                console.error('Error deleting faculty member:', response.data);
                Alert.alert('Error', 'Failed to delete faculty member. Please try again later.');
              }
            } catch (error) {
              console.error('Error deleting faculty member:', error);
              Alert.alert('Error', 'Failed to delete faculty member. Please try again later.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };
  
  const renderFacultyItem = ({ item }) => (
    <View style={styles.facultyItem}>
      <Text style={styles.facultyText}>Name: {item.name}</Text>
      <Text style={styles.facultyText}>Email: {item.email}</Text>
      <Text style={styles.facultyText}>Department: {item.department}</Text>
      <Text style={styles.facultyText}>Designation: {item.designation}</Text>
      <Text style={styles.facultyText}>Phone: {item.phone}</Text>
      <Button title='Delete' color='red' onPress={() => handleDeleteFaculty(item._id)} />
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Faculty Details</Text>
      <FlatList
        data={facultyDetails}
        renderItem={renderFacultyItem}
        keyExtractor={(item) => item._id}
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
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
  },
  facultyItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
  },
  facultyText: {
    marginBottom: 8, // Adjust the margin bottom as needed
  },
});

export default ViewFaculty;
