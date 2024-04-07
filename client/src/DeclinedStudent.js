import React, { useState } from 'react';
import { StyleSheet, Text, View, FlatList, TextInput } from 'react-native';

const DeclinedStudent = ({ route }) => {
  const { declinedStudents } = route.params;
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredData, setFilteredData] = useState(declinedStudents);

  const handleSearch = (text) => {
    setSearchQuery(text);
    const filteredStudents = declinedStudents.filter((student) =>
      student.regno.includes(text) || student.name.toLowerCase().includes(text.toLowerCase()) || student.department.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredData(filteredStudents);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Declined Students</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search by Reg No, Name, or Department"
        onChangeText={handleSearch}
        value={searchQuery}
      />
      <View style={styles.countContainer}>
        <Text style={styles.countText}>Displayed {searchQuery}: {filteredData.length}</Text>
      </View>
      <View style={styles.table}>
        <View style={[styles.tableRow, styles.headerRow]}>
          <Text style={styles.headerCell}>Reg No</Text>
          <Text style={styles.headerCell}>Name</Text>
          <Text style={styles.headerCell}>Department</Text>
          {/* Add more headers as needed */}
        </View>
        <FlatList
          data={filteredData}
          renderItem={({ item }) => {
            return (
              <View style={styles.tableRow}>
                <Text style={styles.cell}>{item.regno}</Text>
                <Text style={styles.cell}>{item.name}</Text>
                <Text style={styles.cell}>{item.department}</Text>
              </View>
            );
          }}
          keyExtractor={(item) => item.regno.toString()}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: '10%',
    marginBottom: 20,
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  countContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  countText: {
    fontWeight: 'bold',
    fontSize: 16,
    color:'orangered'
  },
  table: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#000',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
  },
  headerRow: {
    backgroundColor: '#f0f0f0',
  },
  headerCell: {
    flex: 1,
    fontWeight: 'bold',
    padding: 10,
    textAlign: 'center',
  },
  cell: {
    flex: 1,
    padding: 10,
    textAlign: 'center',
  },
});

export default DeclinedStudent;
