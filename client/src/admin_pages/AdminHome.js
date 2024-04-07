import React, { useState } from 'react';
import {View,TextInput,Button,StyleSheet,Text,Alert,TouchableOpacity,ScrollView,Modal,} from 'react-native';
import axios from 'axios';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import BASE_URL from '../../config';


const AdminHome = ({ navigation }) => {
  const [companyName, setCompanyName] = useState('');
  const [campus, setCampus] = useState(''); 
  const [institution, setInstitution] = useState(''); 
  const [jobRole, setJobRole] = useState('');
  const [salary, setSalary] = useState('');
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [hrName, setHrName] = useState('');
  const [hrMobile, setHrMobile] = useState('');
  const [hrGmail, setHrGmail] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [offCampusDetails, setOffCampusDetails] = useState('');
  const [venue, setVenue] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [isButtonPressed, setIsButtonPressed] = useState(false);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState(''); 


  const buttonStyles = isButtonPressed
    ? [styles.button, styles.buttonPressed]
    : styles.button;
    
      
    const handleSubmit = async () => {
      const jobDetails = {
          companyName,
          campus,
          institution,
          jobRole,
          salary,
          hrName,
          hrMobile,
          hrGmail,
          companyAddress,
          venue,
          jobDescription,
          offCampusDetails,
          selectedCheckboxes: JSON.stringify(selectedCheckboxes),
      };
  
      if (
          !companyName ||
          !campus ||
          !institution ||
          !jobRole ||
          !date ||
          !salary ||
          !hrName ||
          !hrMobile ||
          !hrGmail ||
          !companyAddress ||
          !venue ||
          !jobDescription
      ) {
          Alert.alert('Please fill in all fields');
          return;
      } else if (!/^\d{10}$/.test(hrMobile)) {
          Alert.alert('Mobile number must be a 10-digit number.');
          return;
      } else {
          try {
              const formattedDate = date.toISOString().split('T')[0]; // Extract only date part without time and timezone
              const response = await axios.post(`${BASE_URL}/job`, {
                  ...jobDetails,
                  date: formattedDate,
              });
  
              if (response.status === 200) {
                  if (response.data.message === 'Already exists') {
                      Alert.alert('Already exists');
                  } else {
                      Alert.alert('Job Published Successfully');
  
                      // Reset all input fields
                      setCompanyName('');
                      setCampus('');
                      setInstitution('');
                      setJobRole('');
                      setDate(new Date());
                      setSalary('');
                      setHrName('');
                      setHrMobile('');
                      setHrGmail('');
                      setCompanyAddress('');
                      setVenue('');
                      setJobDescription('');
                      setSelectedCheckboxes('');
                      setOffCampusDetails(''),
  
                      // Navigate to List screen with jobDetails as params
                      navigation.navigate('List', { jobDetails });
                  }
              }
          } catch (error) {
              if (
                  error.response &&
                  error.response.data.message === 'Name already exists'
              ) {
                  Alert.alert('Name already exists');
              } else {
                  Alert.alert('Error publishing job: ' + error.message);
              }
          }
      }
  };
  

  const handleCheckboxToggle = (value) => {
    const updatedCheckboxes = selectedCheckboxes.split(', ');
    
    // Check if the checkbox is already selected
    const isSelected = updatedCheckboxes.includes(value);
    
    // Toggle selection status
    if (isSelected) {
      // If already selected, remove it
      const index = updatedCheckboxes.indexOf(value);
      updatedCheckboxes.splice(index, 1);
    } else {
      // If not selected, add it
      updatedCheckboxes.push(value);
    }
    
    // Filter out any empty strings and then join
    setSelectedCheckboxes(updatedCheckboxes.filter(Boolean).join(', '));
  };
    
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setShowModal(false); // Close the modal when date is selected
      setDate(selectedDate);
    }
  };

  const instituteDepartments = {
    'RVS College of Arts and Science': {
      'School of Commerce': ['B.Com', 'B.Com (IT)', 'B.Com (PA)', 'B.Com (CA)', 'B.Com (BA)', 'B.Com (A&F)','M.Com','M.Com (CA)','M.Com (IB)'],
      'School of Computer Studies': ['B.Sc (CS)', 'B.Sc (IT)','B.Sc (Data Science)', 'BCA','M.Sc (CS)','M.Sc (IT)','MCA'],
      'School of Business Management':['BBA','BBA (CA)','BBA (Logistics)'],
      'Department Of English': ['BA (English)','MA (English)'],
      'Department Of Mathematics': ['B.Sc (Mathemetics)','M.Sc (Mathematics)'],
      'Department Of Psychology': ['B.Sc (Psychology)'],
      'Department Of Social Work': ['MSW'],
      'Department Of Catering Science & Hotel Management': ['B.Sc (Catering Science & Hotel Management)'],
    },
    'RVS Institute of Health and Science': {
      'College of Pharmaceutical Science': ['B.Pharm', 'M.Pharm', 'Pharm.D', 'Ph.D'],
      'College of Physiotherapy': ['BPT', 'MPT','Ph.D'],
      'College of Nursing': ['B.Sc (Nursing)', 'M.Sc (Nursing)','Diploma in Nursing (GNM)'],
      'Ayurveda College': ['BAMS (Bachelor of Ayurveda Medicine and Surgery)'],
    },
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.text}>JOB DETAILS</Text>
        {/* Other input fields */}
        <TextInput
          placeholder="Company Name"
          placeholderTextColor="black"
          value={companyName}
          onChangeText={setCompanyName}
          required
          style={styles.input}
        />
        {/* Other input fields */}
        <TextInput
          placeholder="Company Address"
          placeholderTextColor="black"
          value={companyAddress}
          onChangeText={setCompanyAddress}
          required
          style={styles.input}
        />
        {/* Other input fields */}
        <TextInput
          placeholder="Job Role"
          placeholderTextColor="black"
          value={jobRole}
          onChangeText={setJobRole}
          required
          style={styles.input}
        />
        {/* Other input fields */}
        <TextInput
          placeholder="Job Description"
          placeholderTextColor="black"
          value={jobDescription}
          onChangeText={setJobDescription}
          required
          multiline
          style={styles.input}
        />
        {/* Other input fields */}
        <Picker
          selectedValue={campus}
          style={styles.input}
          onValueChange={(itemValue) => setCampus(itemValue)}
        >
          <Picker.Item label="Select Campus" value="" />
          <Picker.Item label="On-Campus" value="On-Campus" />
          <Picker.Item label="Off-Campus" value="Off-Campus" />
        </Picker>
        {/* Additional input fields for Off-Campus */}
        {campus === 'Off-Campus' && (
          <TextInput
            placeholder="Incharge Name"
            placeholderTextColor="black"
            value={offCampusDetails}
            onChangeText={setOffCampusDetails} // Changed here
            required
            style={styles.input}
          />
        )}
        {/* Other input fields */}
        <Picker
          selectedValue={institution}
          style={styles.input}
          onValueChange={(itemValue) => {
            setInstitution(itemValue);
          }}
        >
          <Picker.Item label="Select Institution" value="" />
          <Picker.Item label="RVS College of Arts and Science" value="RVS College of Arts and Science" />
          <Picker.Item label="RVS Institute of Health and Science" value="RVS Institute of Health and Science" />
        </Picker>

        {/* Checkbox section */}
        {institution && instituteDepartments[institution] && (
          <View>
            <Text style={styles.text}>Eligible Department</Text>
            {Object.keys(instituteDepartments[institution]).map(school => (
              <View key={school}>
                <Text style={{ color: 'blue', fontSize: 15, fontWeight: 'bold', marginBottom: 8 }}>{school}</Text>
                <View style={styles.checkboxRowWrapper}>
                  {instituteDepartments[institution][school].map((department, index) => (
                    <TouchableOpacity
                      key={department}
                      style={[
                        styles.checkbox,
                        selectedCheckboxes.includes(department) && styles.checkboxSelected
                      ]}
                      onPress={() => handleCheckboxToggle(department)}
                    >
                      <Text>{department}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            ))}
          </View>
        )}

        {/* Other input fields */}
        <TextInput
          placeholder="Venue"
          placeholderTextColor="black"
          value={venue}
          onChangeText={setVenue}
          required
          style={styles.input}
        />
        <Text style={styles.selectedDateText}>Date: {date.toDateString()}</Text>
        <Button title="Select Date" onPress={() => setShowModal(true)} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={showModal}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.innerContainer}>
              <DateTimePicker
                mode="date"
                value={date}
                onChange={handleDateChange}
              />
            </View>
          </View>
        </Modal>

        {/* Other input fields */}
        <TextInput
          placeholder="Salary"
          placeholderTextColor="black"
          value={salary}
          onChangeText={setSalary}
          required
          style={styles.input}
        />
        <Text style={styles.text}>HR DETAILS</Text>
        {/* Other input fields */}
        <TextInput
          placeholder="Name"
          placeholderTextColor="black"
          value={hrName}
          onChangeText={setHrName}
          required
          style={styles.input}
        />
        {/* Other input fields */}
        <TextInput
          placeholder="Contact"
          placeholderTextColor="black"
          value={hrMobile}
          onChangeText={setHrMobile}
          required
          style={styles.input}
        />
        {/* Other input fields */}
        <TextInput
          placeholder="Gmail"
          placeholderTextColor="black"
          value={hrGmail}
          onChangeText={setHrGmail}
          required
          style={styles.input}
        />

        {/* Submit button */}
        <TouchableOpacity
          style={buttonStyles}
          onPress={handleSubmit}
          onPressIn={() => setIsButtonPressed(true)}
          onPressOut={() => setIsButtonPressed(false)}
        >
          <Text style={styles.buttonText}>PUBLISH</Text>
        </TouchableOpacity>
      </View>

    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    // marginTop: 50,
    paddingBottom: 50
  },
  innerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    width: '80%',
    marginBottom: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#0a7e8c',
    borderRadius: 5,
    color: 'black',
    marginTop: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  innerContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  text: {
    paddingBottom: 15,
    fontWeight: 'bold',
    fontSize: 25,
    textAlign: 'center',
    color: '#0a7e8c',
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#0a7e8c',
    borderWidth: 3,
    borderColor: 'transparent',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    width: 150,
  },
  buttonPressed: {
    borderColor: 'dodgerblue',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  checkboxRowWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  checkbox: {
    borderWidth: 1,
    borderColor: '#0a7e8c',
    borderRadius: 5,
    padding: 3,
    marginBottom: 5,
    marginRight: 10,
  },
  checkboxSelected: {
    backgroundColor: '#43BCD4',
  },
  selectedDateText: {
    textAlign: 'center',
    fontSize: 16,
    marginBottom: 10,
    color: 'orangered',
    fontWeight: "bold"
  }

});

export default AdminHome;
