import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import PlantIdentifier from './src/screens/PlantIdentifier';
import ChatScreen from './src/screens/ChatScreen';
import WaterStatsScreen from './src/screens/WaterStatsScreen';
import PlantSelectionScreen from './src/screens/PlantSelectionScreen';
import AIChatScreen from './src/screens/AIChatScreen';
import MainMenu from './src/screens/MainMenu';
import PlantSicknessScreen from './src/screens/PlantSicknessScreen'; // ✅ yeni

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Menu" component={MainMenu} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Identify" component={PlantIdentifier} />
        <Stack.Screen name="Chat" component={ChatScreen} />
        <Stack.Screen name="WaterStats" component={WaterStatsScreen} />
        <Stack.Screen name="SelectPlant" component={PlantSelectionScreen} />
        <Stack.Screen name="ChatBot" component={AIChatScreen} />
        <Stack.Screen name="PlantSickness" component={PlantSicknessScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

