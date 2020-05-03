import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Camera from './Camera';
import Photos from './Photos';
import PhotoDetails from './PhotoDetails';

const Stack = createStackNavigator();

export default () => (
  <NavigationContainer>
    <Stack.Navigator
      initialRouteName="Photos"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen name="Photos" component={Photos} />
      <Stack.Screen name="PhotoDetails" component={PhotoDetails} />
    </Stack.Navigator>
  </NavigationContainer>
);
