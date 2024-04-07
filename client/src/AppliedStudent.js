import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Modal, Button, TextInput } from 'react-native';
import BASE_URL from '../config';

const AppliedStudent = ({ route }) => {
  const { appliedStudents } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [appliedStudentsData, setAppliedStudentsData] = useState(appliedStudents);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      // Fetch updated data here
      // For simplicity, I'm just setting state with the current time
      // No need to set appliedStudentsData here since it's not being updated
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handlePress = (regno, jobId) => {
    setSelectedOption('');
    setModalVisible(true);
    setSelectedStudentId(regno);
    setSelectedJobId(jobId);
  };

  const handleOkPress = async () => {
    setModalVisible(false);
    console.log('Selected Round:', selectedOption);
   
    // Update the status of the selected student
    const updatedStudents = appliedStudentsData.map(student => {
      if (student.regno === selectedStudentId && student.jobId === selectedJobId) {
        // Update the status with the selected option
        return {...student, status: selectedOption};
      }
      return student;
    });
    
    // Update the state with the updated students array
    setAppliedStudentsData(updatedStudents);
    // Prepare the data to send to the backend
    const postData = {
      regno: selectedStudentId,
      status: selectedOption,
    };

    // Send a POST request to the backend
    try {
      const response = await fetch(`${BASE_URL}/updateStudentStatus`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      });
      if (!response.ok) {
        throw new Error('Failed to update status');
      }
      // Handle successful response if needed
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error
    }
  };

  const renderOption = (option) => {
    return (
      <TouchableOpacity
        style={styles.optionContainer}
        onPress={() => setSelectedOption(option)}
      >
        <Text>{option}</Text>
        {selectedOption === option && <View style={styles.radioButton} />}
      </TouchableOpacity>
    );
  };

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity onPress={() => handlePress(item.regno, item.jobId)}>
        <View style={styles.tableRow}>
          <Text style={styles.cell}>{item.regno}</Text>
          <Text style={styles.cell}>{item.name}</Text>
          <Text style={styles.cell}>{item.department}</Text>
          <Text style={styles.cell}>{item.status}</Text>
        </View>
      </TouchableOpacity>
    );
  };

  const calculateDepartmentCount = (department) => {
    return appliedStudentsData.filter(student => student.department.toLowerCase() === department.toLowerCase()).length;
  };

  const filteredData = appliedStudentsData.filter(student =>
    student.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.regno.toLowerCase().includes(searchQuery.toLowerCase()) ||
    student.status.toLowerCase().includes(searchQuery.toLowerCase()) 
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Applied Students</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by department..."
        onChangeText={setSearchQuery}
        value={searchQuery}
      />
      <Text style={[styles.departmentCount, { color: 'orangered' }]}>
        {searchQuery ? `Count for ${searchQuery}: ${calculateDepartmentCount(searchQuery)}` : 'Enter a department to see the count '}
      </Text>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.headerRow]}>
          <Text style={styles.headerCell}>Reg No</Text>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Department</Text>
          <Text style={styles.headerCell}>Status</Text>
        </View>
        <FlatList
          data={filteredData}
          renderItem={renderItem}
          keyExtractor={item => item.regno.toString()}
        />
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select the Status</Text>
            {renderOption('1st Round')}
            {renderOption('2nd Round')}
            {renderOption('3rd Round')}
            {renderOption('4th Round')}
            {renderOption('5th Round')}
            {renderOption('Selected')}
            {renderOption('Not Selected')}
            <Button title="OK" onPress={handleOkPress} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: 20,
    backgroundColor: '#ecf0f1',
    padding: 3,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    textAlign: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    margin: 10,
    padding: 10,
    borderRadius: 5,
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
    backgroundColor: '#fff',
    borderRadius: 5,
    overflow: 'hidden', // To ensure the border radius is applied correctly
  },
  tableRow: {
    flexDirection: 'row',
    padding: 5,
    borderBottomWidth: 1,
    borderColor: '#000',
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
    overflow: 'hidden', // To ensure the border radius is applied correctly
  },
  headerRow: {
    backgroundColor: '#ddd',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    padding: 5, // Reduced padding
    textAlign: 'center',
    fontSize: 15, // Reduced font size
  },
  cell: {
    flex: 1,
    padding: 5, // Reduced padding
    textAlign: 'center',
    fontSize: 14, // Reduced font size
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  optionContainer: {
    flexDirection: 'row',
    backgroundColor: '#e0e0e0',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10, // Reduced padding
    borderRadius: 5,
  },
  radioButton: {
    width: 15, // Reduced size
    height: 15, // Reduced size
    borderRadius: 15, // Reduced size
    borderWidth: 1,
    borderColor: '#000',
    marginLeft: 10,
    backgroundColor: '#00A82E',
  },
  departmentCount: {
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 10,
    marginBottom: 10,
  },
});

export default AppliedStudent;
