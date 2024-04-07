import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput } from 'react-native';
import axios from 'axios';
import BASE_URL from '../../config';

const Card = ({ companyName, selectedStudents }) => (
  <View style={styles.card}>
    <Text style={styles.companyName}>{companyName}</Text>
    <Text style={{ color: 'orangered', fontWeight: 'bold' }}>Total Students: {selectedStudents.length}</Text>
    <View style={styles.table}>
      <View style={styles.tableRow}>
        <Text style={[styles.cell, styles.columnHeader]}>Name</Text>
        <Text style={[styles.cell, styles.columnHeader]}>Reg No</Text>
        <Text style={[styles.cell, styles.columnHeader]}>Department</Text>
      </View>
      {selectedStudents.map((student, index) => (
        <View key={index} style={styles.tableRow}>
          <Text style={styles.cell}>{student.name}</Text>
          <Text style={styles.cell}>{student.regno}</Text>
          <Text style={styles.cell}>{student.department}</Text>
        </View>
      ))}
    </View>
  </View>
);

const AllSelectedStudents = () => {
  const [selectedStudentsData, setSelectedStudentsData] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/Selected`);
      setSelectedStudentsData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    const interval = setInterval(() => {
      fetchData(); // Fetch data every 5 seconds
    }, 1000);

    return () => {
      clearInterval(interval); // Cleanup interval on component unmount
    };
  }, []);

  // Filter students based on department
  const filteredStudents = selectedStudentsData.filter(job =>
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.selectedStudents.some(student =>
      student.department.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  return (
    <View style={{ flex: 1 }}>
    <Text style={styles.text1}>Selected List</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="Search by Department and Company"
        onChangeText={text => setSearchTerm(text)}
        value={searchTerm}
      />
      {searchTerm !== 'Total Students' && (
        <View style={styles.countContainer}>
          <Text style={styles.countText}>Total Students {searchTerm}:  {filteredStudents.length}</Text>
        </View>
      )}
      <ScrollView contentContainerStyle={styles.scrollView}>
        {filteredStudents.map((job, index) => (
          <Card key={index} companyName={job.company} selectedStudents={job.selectedStudents} />
        ))}
      </ScrollView>
    </View>
  );
};


const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    paddingVertical: 20,
    width: '90%',
    marginLeft: '5%',
    // top: '1%'
  },
  searchBar: {
    paddingHorizontal: 10,
    padding: 8,
    marginHorizontal: 20,
    marginTop: 10,
    // marginBottom: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    borderWidth:1
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 20,
    color:'blue',
    // paddingHorizontal: 20,
    paddingTop: 15,
  },  
  columnHeader: {
    color: 'purple',
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    elevation: 3, // for shadow
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  companyName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    // textAlign:'center',
    color: 'blue'
  },
  text1:{
    marginTop:50, 
    textAlign:'center',
    fontWeight:"bold",
    fontSize:25,
    color:'purple'
  }
});

export default AllSelectedStudents;
