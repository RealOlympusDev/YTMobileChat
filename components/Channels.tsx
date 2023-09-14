import React, { useState } from 'react';

import {Text, SafeAreaView, StyleSheet, FlatList, Image, View, TextInput, TouchableOpacity} from 'react-native';

import { searchChannel } from '../api/youtube';

import { v4 as uuid } from 'uuid';

export default function Channels({navigation}) {

  // navigation.addListener('focus', () => {
  //   searchChannel(text).then((channels) => {
  //     channels.map((channels) => {
  //       setItems(channels.items)
  //     }
  //     );
  //   })
  // });

  const [items, setItems] = useState([])


  const [text, onChangeText] = useState("");

  

  return (
    <SafeAreaView style={styles.container}>
      
      <TextInput style={styles.input}
        onChangeText={onChangeText}
        value={text}
        keyboardType="default"
        returnKeyType="done"
        autoComplete="off"
        autoCapitalize="none"
        autoCorrect={false}
        onSubmitEditing={() => {
          searchChannel(text).then((channels) => {
            channels.map((channels) => {
              setItems(channels.items)
            }
            );
          })
        }}
        placeholder="Search"
        placeholderTextColor="gray" />
      <FlatList 
        data={items}
        renderItem={({ item }) =>  
        <TouchableOpacity style={styles.view} onPress={() => {
          navigation.navigate("Home", item.snippet)
        }}>
          <Image style={styles.profile} source={{uri: item.snippet.thumbnails.default.url}} />
          <Text style={styles.text}>{item.snippet.channelTitle}</Text>
        </TouchableOpacity>
        }
        keyExtractor={(item) => item.id.channelId}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
      padding: 5,
    },
    input: {
      height: 40,
      color: "white",
      borderColor: "gray",
      borderBottomWidth: 1,
    },
    view: {
      flex: 1,
      flexDirection: "row",
      padding: 7,
    },
    text: {
        color: "white",
        fontWeight: "bold",
        fontSize: 16,
        padding: 7,
        paddingLeft: 10,
    },
    profile: {
      height: 40,
      width: 40,
      borderRadius: 40 / 2,
    }
  });
  