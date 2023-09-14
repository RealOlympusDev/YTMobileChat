import React from 'react';
import Main from './components/Main';
import Channels from './components/Channels';

import 'react-native-get-random-values';


import TextEncodingPolyfill from 'text-encoding';
import {decode, encode} from 'base-64'


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

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


export default function App() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen
        name="Home"
        component={Main}
      />
      <Stack.Screen
        name="Channels"
        component={Channels}
      />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


// const generateColor = () => {
//   const randomColor = Math.floor(Math.random() * 16777215)
//     .toString(16)
//     .padStart(6, '0');
//   return `#${randomColor}`;
// };
