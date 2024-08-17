// App.js
import React, { useState, useEffect, useCallback } from 'react';
import { View, ScrollView, Text, FlatList, TouchableOpacity, StyleSheet, Alert, Button  } from 'react-native';
import axios from 'axios';
import FormScreen from './FormScreen';
import config from './config';

import { NavigationContainer,useFocusEffect } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

const ListScreen = ({ navigation }) => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshFlag, setRefreshFlag] = useState(false);
    const fetchListData = useCallback(async () => {
       try {
        const response = await axios.get('http://45.92.108.19:5000'  + '/api/data');
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

   const handleDelete = (index) => {
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
                const response = await fetch('http://45.92.108.19:5000' + `/api/data/${index}`, {
                  method: 'DELETE'
                });
                fetchListData();
              } catch (error) {
                console.error('Error deleting item:', error);
              }
            }
          }
        ]
      );
    };

   const handleMainRun = async  () => {
       console.log('handleMainRun');
      try {
         await fetch('http://192.168.1.2:5000' + `/api/run`, {
           method: 'POST'
         });
       } catch (error) {
         console.error('Error while run item:', error);
       }
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
           <Button
                   title="Run main"
                   onPress={handleMainRun}
           />
           <FlatList
            data={data}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
                  <View style={styles.item}>
                    <Text style={styles.date}>{item[0]}</Text>
                    <Text style={styles.amount}>{item[1]}</Text>
                    <Text style={styles.description}>{item[3]}</Text>
                    <TouchableOpacity
                          onPress={() => handleDelete(index)} // Assuming item[1] is the ID
                          style={{ marginTop: 10, backgroundColor: 'red', padding: 5 }}
                        >
                          <Text style={{ color: 'white' }}>Delete</Text>
                        </TouchableOpacity>
                  </View>
            )}
          />
        </View>
  )
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-start', // Align items to the start
    alignItems: 'flex-start', // Align items to the start
    padding: 15,
    backgroundColor: '#f5f5f5'
  },
  item: {
    flexDirection: 'row', // Arrange items in a row
    justifyContent: 'space-between', // Distribute space between first and last item
    alignItems: 'center', // Center items vertically
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  date: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    flex: 2, // Flex 1 to take available space
  },
  description: {
    fontSize: 14,
    color: '#666',
    flex: 2, // Flex 2 for a bit more space
    marginHorizontal: 10, // Add some horizontal margin for spacing
  },
  amount: {
    color: '#ff0000',
    fontSize: 16,
    flex: 1, // Flex 1 to take available space
    textAlign: 'right', // Align to the right
  },
   button: {
      flexDirection: 'row',   // Aligns children horizontally
      justifyContent: 'space-between',  // Spreads them out
      paddingHorizontal: 20,  // Adds space on the sides
      marginHorizontal: 10,  // Adds space between buttons
   }
});


export default ListScreen;
