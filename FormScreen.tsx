// FormScreen.js
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import config from './config';


const FormScreen = ({ navigation, route }) => {
  const getCurrentDateFormatted = () => {
    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');  // Ensure two digits
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  };

  const [value, setValue] = useState('-');
  const [comment, setComment] = useState('');
  const [note, setNote] = useState('');
  const [date, setDate] = useState(getCurrentDateFormatted());

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://192.168.1.2:5000' + '/api/data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          date,
          value,
          comment,
          note,
        }),
      });

      if (response.ok) {
        Alert.alert('Success', 'Data submitted successfully', [{ text: 'OK', onPress: () => navigation.goBack() }]);
      } else {
        Alert.alert('Error', 'Failed to submit data');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text>Adding </Text>
      <TextInput
        style={styles.input}
        placeholder="Date"
        value={date}
        onChangeText={setDate}
      />
      <TextInput
        style={styles.input}
        placeholder="Value"
        value={value}
        onChangeText={setValue}
      />
      <TextInput
        style={styles.input}
        placeholder="Comment"
        value={comment}
        onChangeText={setComment}
      />
      <TextInput
        style={styles.input}
        placeholder="Note"
        value={note}
        onChangeText={setNote}
      />
      <Button title="Submit" onPress={handleSubmit} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default FormScreen;
