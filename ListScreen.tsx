// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button  } from 'react-native';
import axios from 'axios';
import FormScreen from './FormScreen';

import { NavigationContainer,useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const ListScreen = ({ navigation }) => {

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

   const fetchListData = useCallback(async () => {
       try {
        const response = await axios.get('http://192.168.1.2:5000/api/data');
        setData(response.data.msg_ids);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    }, []); // Empty dependency array means this function doesn't depend on any props or state


  // Use focus effect to fetch data when the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchListData();
    }, [fetchListData])
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Loading...</Text>
      </View>
    );
  }

   const handleDelete = (itemId) => {
      Alert.alert(
        "Confirm Delete",
        "Are you sure you want to delete this item?",
        [
          {
            text: "Cancel",
            style: "cancel"
          },
          {
            text: "Delete",
            onPress: async () => {
              try {
                const response = await fetch(`http://10.0.2.2:5000/api/data/${itemId}`, {
                  method: 'DELETE'
                });
                if (response.ok) {
                  // Remove the item from the list
                  setListData(prevData => prevData.filter(item => item[1] !== itemId));
                } else {
                  console.error('Error deleting item:', response.statusText);
                }
              } catch (error) {
                console.error('Error deleting item:', error);
              }
            }
          }
        ]
      );
    };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.indexText}>Index: {index}</Text>
      <Text style={styles.itemText}>{item.name}</Text>
    </View>
  );

  return (
        <View style={styles.container}>
        <Button
                title="Add Item"
                onPress={() => navigation.navigate('Form')}
              />
          <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
               <TouchableOpacity
                  style={styles.item}
                  onPress={() => navigation.navigate('Form', { item })}
               >
                  <View style={styles.item}>
                    <Text style={styles.date}>{item[0]}</Text>
                    <Text style={styles.amount}>{item[1]}</Text>
                    <Text style={styles.description}>{item[3]}</Text>
                    <TouchableOpacity
                          onPress={() => handleDelete(index  )} // Assuming item[1] is the ID
                          style={{ marginTop: 10, backgroundColor: 'red', padding: 5 }}
                        >
                          <Text style={{ color: 'white' }}>Delete</Text>
                        </TouchableOpacity>
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
