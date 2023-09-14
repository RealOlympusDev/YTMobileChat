import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, FlatList, Image, TextInput, KeyboardAvoidingView, TouchableHighlight } from 'react-native';
import FastImage from 'react-native-fast-image';

import 'react-native-get-random-values';

import { v4 as uuid } from 'uuid';

import { Continuation, LiveChatResponse } from '../util/types';
import { traverseJSON } from '../util/util';

import TextEncodingPolyfill from 'text-encoding';
import {decode, encode} from 'base-64'

import {
	getContinuationToken,
	parseChatAction,
	VideoData,
  getVideoData
} from '../util/youtube';

import Icon from 'react-native-vector-icons/Entypo';
import { get7TVEmotes, getBTTVEmotes, getFFZEmotes, getTruffleEmotes } from '../api/youtube';
import { BTTVEmotes } from '../api/BTTV';

import {
    GoogleSignin,
  } from '@react-native-google-signin/google-signin';
import Chat from './Chat';

if (!global.btoa) {
    global.btoa = encode;
}

if (!global.atob) {
    global.atob = decode;
}
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder,
});



export default function Main({ navigation, route }) {


  let initialized = false;

  const [videoData, setVideoData] = useState(null);

  navigation.addListener('focus', async () => {
    if (route.params !== undefined) {

      setChannels(prevItems => {
        if (prevItems.filter((yo) => {yo.channelId === route.params.channelId}).length === 0){
          return [...prevItems, route.params];
        }
      })

      GoogleSignin.configure({
        scopes:[
          "https://www.googleapis.com/auth/youtube"
        ],
        webClientId:'{WEB_CLIENT_ID}',
        iosClientId: '{IOS_CLIENT_ID}',
        });
  
      const userInfo = await GoogleSignin.signIn();

      console.log((await GoogleSignin.getTokens()).accessToken);

    }
  });

  const [text, onChangeText] = React.useState("");

  const [channels, setChannels] = React.useState([]);


  return (
    <SafeAreaView style={styles.container}>
      <Chat navigation={navigation} channelId={(route.params !== undefined) ? route.params.channelId : undefined} />
      <View style={{height: 40, flexDirection:"row"}} >
      <Icon name="menu" size={20} color="white" style={{ paddingRight: 10 }}/> 
      <FlatList 
        horizontal
        removeClippedSubviews={true}
        data={channels}
        renderItem={({ item }) => 
          <Text>
              <TouchableHighlight onPress={() => console.info(item.channelTitle)}>
                <Text style={{color: "white", fontWeight: "bold"}}>{item.channelTitle} </Text>
              </TouchableHighlight>
              <Icon name="cross" size={20} color="white"/> 
          </Text>
        }
        keyExtractor={(item) => item.channelId}
      />
        <TouchableHighlight onPress={() => { navigation.navigate('Channels') }}>
          <Icon name="plus" size={20} color="white" style={{ paddingLeft: 10 }}/> 
        </TouchableHighlight>
      </View>
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
    borderTopWidth: 1,
  },
  badge: {
    width: 15,
    height: 15,
  },
  emote: {
    width: 25,
    height: 25,
    transform: [{ translateY: 5 }],
  },
  text: {
    fontSize: 15,
    transform: [{ translateY: -5 }],
    paddingBottom: 5,
  },
  message: {
    color: "white",
  }
});
