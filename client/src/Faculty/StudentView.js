import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TextInput, ScrollView } from 'react-native';
import { DataTable } from 'react-native-paper';
import BASE_URL from '../../config';

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentCounts, setDepartmentCounts] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch(`${BASE_URL}/students`);
        if (!response.ok) {
          throw new Error('Failed to fetch student data');
        }
        const data = await response.json();
        setStudents(data);
      } catch (error) {
        console.error(error);
        // Handle error
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const countDepartments = () => {
      const counts = {};
      filteredStudents.forEach(student => {
        const department = student.department;
        counts[department] = counts[department] ? counts[department] + 1 : 1;
      });
      setDepartmentCounts(counts);
    };

    countDepartments();
  }, [searchQuery, students]);

  const handleRowPress = (student) => {
    const message = `
      Name:   ${student.name}
      Course:   ${student.department}
      Reg No:   ${student.regno}
      Phone:    ${student.phone}
      Email:    ${student.email}
      DOB:  ${student.dob}
      Address:  ${student.address}
      SSCL:  ${student.sslc}%
      HSC:  ${student.hsc}%
      UG:  ${student.ug}%
      PG:  ${student.pg}%
    `;

    Alert.alert('Student Details', message);
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.regno.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.department.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  const sortedStudents = filteredStudents.sort((a, b) => a.name.localeCompare(b.name));

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Student's List</Text>
      <TextInput
        style={styles.input}
        placeholder="Search..."
        onChangeText={text => setSearchQuery(text)}
        value={searchQuery}
      />
      <View style={styles.countContainer}>
  <ScrollView horizontal>
    {Object.keys(departmentCounts).map(department => (
      <Text key={department} style={{color:'orangered',fontWeight:'bold', marginRight: 10,padding:5}}>{`${department}: ${departmentCounts[department]}`}</Text>
    ))}
  </ScrollView>
</View>

      <ScrollView style={styles.scrollView}>
        <DataTable>
          <DataTable.Header style={styles.title}>
            <DataTable.Title style={styles.Title}>Name</DataTable.Title>
            <DataTable.Title style={styles.Title}>Reg No</DataTable.Title>
            <DataTable.Title style={styles.Title}>Dept</DataTable.Title>
            <DataTable.Title style={styles.Title}>Phone</DataTable.Title>
          </DataTable.Header>

          {sortedStudents.map((student, index) => (
            <DataTable.Row key={index} onPress={() => handleRowPress(student)}>
              <DataTable.Cell style={styles.cell}>{student.name}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{student.regno}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{student.department}</DataTable.Cell>
              <DataTable.Cell style={styles.cell}>{student.phone}</DataTable.Cell>
            </DataTable.Row>
          ))}
        </DataTable>
      </ScrollView>
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    marginTop: 30,
    textAlign: "center",
  },
  title: {
    backgroundColor: 'turquoise',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
  cell: {
    justifyContent: 'center', 
    flex: 1,
  },
  Title: {
    justifyContent: 'center', 
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  scrollView: {
    maxHeight: '100%', // Adjust the max height as needed
  },
});

export default StudentList;
