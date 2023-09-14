import React, {useState, useEffect} from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, FlatList, Image, TextInput, KeyboardAvoidingView, TouchableHighlight } from 'react-native';
import FastImage from 'react-native-fast-image';

import 'react-native-get-random-values';

import { v4 as uuid } from 'uuid';

import { Continuation, LiveChatResponse } from '../util/types';
import { traverseJSON } from '../util/util';

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



export default function Chat({ navigation, channelId }) {

  const [items, setItems] = useState([])

  const addItem = (username: string, text: string, color: string, badges: {
    tooltip: string;
    type: 'icon' | 'custom';
    badge: string;
  }[]) => {
    setItems(prevItems => {
      return [{id: uuid(), username: username, text: text, color: color, badges: badges}, ...prevItems.slice(0, 30)]
    })
  }

const chatInterval = 250;

let seenMessages = new Map<string, number>();
let nextContinuationToken: string;

const fetchChat = async (videoData: VideoData, continuationToken: string) => {
  let nextToken = continuationToken;
  try {
    const res = await fetch(
      `https://www.youtube.com/youtubei/v1/live_chat/get_live_chat?key=${videoData.config.INNERTUBE_API_KEY}`,
      {
        method: 'POST',
        body: JSON.stringify({
          context: videoData.config.INNERTUBE_CONTEXT,
          continuation: continuationToken,
          webClientInfo: { isDocumentHidden: false },
        }),
      }
    );
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = await res.json();
    const nextContinuation =
      data?.continuationContents?.liveChatContinuation?.continuations?.[0];
    nextToken =
      (nextContinuation
        ? getContinuationToken(nextContinuation)
        : undefined) ?? continuationToken;

    const actions =
      data.continuationContents.liveChatContinuation.actions ?? [];

    for (const action of actions) {
      const parsed = parseChatAction(action);
      if (parsed) {
        if (seenMessages.has(parsed.id)) continue;
        seenMessages.set(parsed.id, parsed.unix);
        addItem(parsed.author.name, parsed.message, generateColor(parsed.author.name), parsed.author.badges)
      }
    }
  } catch (e) {
    console.error(e);
  } finally {
    nextContinuationToken = nextToken;
    setTimeout(() => fetchChat(videoData, nextToken), chatInterval);
  }
}

function getChannelLiveUrl(channelId: string) {
	const isId = /^UC.{22}$/.test(channelId);
	let urlParts: string[];
	if (isId) urlParts = ['channel', 'c', 'user'];
	else urlParts = ['c', 'user', 'channel'];
	return urlParts.map(
		(part) => `https://www.youtube.com/${part}/${channelId}/live`
	);
}

  const [videoData, setVideoData] = useState(null);

  useEffect(() => {

    let initialized = false;

    let unsubscribe = navigation.addListener('focus', async () => {
      if (channelId !== undefined && !initialized && nextContinuationToken === undefined) {
  
        console.log("FOCUS!");
  
        const seventv = get7TVEmotes(channelId);
  
        const BTTV = getBTTVEmotes(channelId);
      
        const FFZ = getFFZEmotes(channelId);
      
        const Truffle = getTruffleEmotes(channelId);
  
        seventv.then(yo => {
          yo.map(emotes => {
              set7TVEmotes(emotes)
          })
        });
  
        BTTV.then(yo => {
          yo.map(emotes => {
              setBTTVEmotes(emotes)
          })
        })
  
        FFZ.then(yo => {
          yo.map(emotes => {
              setFFZEmotes(emotes)
          })
        })
  
        Truffle.then(yo => {
          yo.map(emotes => {
              setTruffleEmotes(emotes)
          })
        })
  
        getVideoData(getChannelLiveUrl(channelId)).then(yo => {
          yo.map(videoData => {
            setVideoData(videoData)
            if (initialized) return new Response();
            initialized = true;
            const continuation = traverseJSON(videoData.initialData, (value) => {
              if (value.title === 'Live chat') {
                return value.continuation as Continuation;
              }
            });
            if (!continuation)
              return new Response('Failed to load chat', { status: 404 });
            const token = getContinuationToken(continuation);
            if (!token) return new Response('Failed to load chat', { status: 404 });
            fetchChat(videoData, token)
          })
        });
      }
    });

    return unsubscribe;

  });

  var nameStyle = function(color: string) {
    return {
      fontWeight: "bold",
      color: color,
    }
  }

  const [text, onChangeText] = React.useState("");

  const [sevenTVEmotes, set7TVEmotes] = useState([])
  const [FFZEmotes, setFFZEmotes] = useState([])
  const [TruffleEmotes, setTruffleEmotes] = useState([])
  const [BTTVEmotes, setBTTVEmotes] = useState<BTTVEmotes>({
    "id": "5b4fd7ad8576ce7474e74d90",
    "bots": [
        "thezanysidekick"
    ],
    "avatar": "https://static-cdn.jtvnw.net/jtv_user_pictures/bde8aaf5-35d4-4503-9797-842401da900f-profile_image-300x300.png",
    "channelEmotes": [
        {
            "id": "5fe268d9a02cf1347ffa41d6",
            "code": "ludwigCD",
            "imageType": "png",
            "userId": "5b4fd7ad8576ce7474e74d90"
        },
    ],
    "sharedEmotes": [
        {
            "id": "5590b223b344e2c42a9e28e3",
            "code": "EZ",
            "imageType": "png",
            "user": {
                "id": "558f7862b344e2c42a9e2822",
                "name": "helloboat",
                "displayName": "helloboat",
                "providerId": "39819556"
            }
        }
    ]
})

  function ParsedText({ text }) {
    return text.split(/(\s+)/).map(elem => {
      if (!elem) return null;

      if(elem.startsWith(":customYTEmoji:")){
        let url = elem.replace(":customYTEmoji:", "")
        return <FastImage key={uuid()} style={styles.emote} source={{uri: url}} />;
      }

      if(sevenTVEmotes !== undefined && sevenTVEmotes.length > 0) {
        let sevenTVEmote = sevenTVEmotes.filter(e => e.name === elem);
        if (sevenTVEmote.length !== 0){
            return <FastImage key={uuid()} style={styles.emote} source={{uri: sevenTVEmote[0].urls[3][1]}} />;
          }
      }

      if(FFZEmotes !== undefined && FFZEmotes.length > 0) {
        let FFZTVEmote = FFZEmotes.filter(e => e.code === elem);
        if (FFZTVEmote.length !== 0){
            return <FastImage key={uuid()} style={styles.emote} source={{uri: FFZTVEmote[0].images["1x"]}} />;
          }
      }

      if(TruffleEmotes !== undefined && TruffleEmotes.length > 0) {
        let TruffleEmote = TruffleEmotes.filter(e => e.name === elem);
        if (TruffleEmote.length !== 0){
            if(TruffleEmote[0].provider == 0) {
                return <FastImage key={uuid()} style={styles.emote} source={{uri: `https://static-cdn.jtvnw.net/emoticons/v2/${TruffleEmote[0].id}/static/dark/1.0`}} />;
            } else if(TruffleEmote[0].provider == 1) {
                return <FastImage key={uuid()} style={styles.emote} source={{uri: `https://cdn.frankerfacez.com/emote/${TruffleEmote[0].id}/1`}} />;
            } else if(TruffleEmote[0].provider == 2) {
                return <FastImage key={uuid()} style={styles.emote} source={{uri: `https://cdn.betterttv.net/emote/${TruffleEmote[0].id}/1x`}} />;
            } else if(TruffleEmote[0].provider == 3) {
                return <FastImage key={uuid()} style={styles.emote} source={{uri: `https://v2.truffle.vip/emotes/${TruffleEmote[0].id}`}} />;
            } else if(TruffleEmote[0].provider == 4) {
                return <FastImage key={uuid()} style={styles.emote} source={{uri: `https://cdn.bio/ugc/collectible/${TruffleEmote[0].id}.tiny.${TruffleEmote[0].ext}`}} />;
            }
          }
      }

      if(BTTVEmotes !== undefined) {
        if(BTTVEmotes.channelEmotes !== undefined) {
            let BTTVEmote = BTTVEmotes.channelEmotes.filter(e => e.code === elem);
            if (BTTVEmote.length !== 0){
                return <FastImage key={uuid()} style={styles.emote} source={{uri: `https://cdn.betterttv.net/emote/${BTTVEmote[0].id}/1x`}} />;
            }
        }
        if(BTTVEmotes.sharedEmotes !== undefined) {
            let SharedBTTVEmote = BTTVEmotes.sharedEmotes.filter(e => e.code === elem);
            if (SharedBTTVEmote.length !== 0){
            return <FastImage key={uuid()} style={styles.emote} source={{uri: `https://cdn.betterttv.net/emote/${SharedBTTVEmote[0].id}/1x`}} />;
            }
        }
      }

      return <Text key={uuid()}>{elem}</Text>;
    });
  }

  return (
      <KeyboardAvoidingView behavior="padding" keyboardVerticalOffset={10} style={{flex: 1}}>
      <FlatList 
        inverted
        removeClippedSubviews={true}
        data={items}
        renderItem={({ item }) => 
        <Text style={styles.text}>
          { 
            item.badges.map(badges => {
              if (badges.badge == "MODERATOR") {
                return <Text key={uuid()}><Image style={styles.badge} source={require("../assets/TMODERATOR.png")}></Image> </Text>
              } else if (badges.badge == "VERIFIED") {
                return <Text key={uuid()}><Image style={styles.badge} source={require("../assets/VERIFIED.png")}></Image> </Text>
              } else {
                return <Text key={uuid()}><FastImage style={styles.badge} source={{uri: badges.badge}}></FastImage> </Text>
              }
            })
          }
          <Text style={nameStyle(item.color)}>{item.username}</Text><Text style={styles.message}>: <ParsedText text={item.text} /></Text>
        </Text>
        }
        keyExtractor={(item) => item.id}
      />
      <TextInput
        style={styles.input}
        onChangeText={onChangeText}
        value={text}
        placeholder="Message"
        placeholderTextColor="gray" 
      />
      </KeyboardAvoidingView>
  );
}


// const generateColor = () => {
//   const randomColor = Math.floor(Math.random() * 16777215)
//     .toString(16)
//     .padStart(6, '0');
//   return `#${randomColor}`;
// };

function generateRandom(maxInt, stringParam) {
  let sum = 0;
  for (let i = 0; i < stringParam.length; i++){
    sum += stringParam.charCodeAt(i);
  }
  let result = sum % maxInt;
  return result;
}

const generateColor = (username) => {
  const color = "hsl(" + generateRandom(360, username) + ", 100%, 50%)";
  return color;
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
