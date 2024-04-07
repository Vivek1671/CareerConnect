import React, { useState } from 'react';
import { Button, Modal, StyleSheet, Text, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateComponent = () => {
  const [date, setDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);

  const handleDateChange = (event, selectedDate) => {
    if (selectedDate !== undefined) {
      setShowModal(false); // Close the modal when date is selected
      setDate(selectedDate);
    }
  };

  return (
    <View style={styles.container}>
      <Text>Date: {date.toDateString()}</Text>
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
});

export default DateComponent;
