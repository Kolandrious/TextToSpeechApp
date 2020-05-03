import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import Home from './Home';
import Camera from './Camera';
import Photos from './Photos';
import PhotoDetails from './PhotoDetails';
import Voice from './Voice';

const Stack = createStackNavigator();

export default () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Photos">
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Camera" component={Camera} />
      <Stack.Screen
        options={{ title: 'Выберыце фота' }}
        name="Photos"
        component={Photos}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="PhotoDetails"
        component={PhotoDetails}
      />
      <Stack.Screen
        options={{ title: 'Вынік' }}
        name="Voice"
        component={Voice}
      />
    </Stack.Navigator>
  </NavigationContainer>
);
