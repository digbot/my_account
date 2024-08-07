// App.js
import React, { useState, useEffect } from 'react';
import { View, ScrollView, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import axios from 'axios';
import FormScreen from './FormScreen';

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const ListScreen = ({ navigation }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.0.2.2:5000/api/data');
        setData(response.data.msg_ids);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
        <View style={styles.container}>
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => (
               <TouchableOpacity
                  style={styles.item}
                  onPress={() => navigation.navigate('Form', { item })}
               >
                  <View style={styles.item}>
                    <Text style={styles.date}>{item[0]}</Text>
                    <Text style={styles.amount}>{item[1]}</Text>
                    <Text style={styles.description}>{item[3]}</Text>
                  </View>
              </TouchableOpacity>
            )}
          />
    </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'left',
    alignItems: 'left',
    padding: 15,
    color: '#ff0000',
    backgroundColor: '#f5f5f5'
  },
  item: {

    alignItems: 'left',
    alignContent: 'space-between',
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    color: '#ff0000',
    width: '100%',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  amount: {
    color: '#ff0000',
    fontSize: 16
  },
  description: {
    fontSize: 14,
    color: '#666',
  },
});

export default ListScreen;
