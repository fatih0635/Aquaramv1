import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
  ImageBackground,
  Dimensions,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const screenWidth = Dimensions.get('window').width;

export default function MainMenu() {
  const navigation = useNavigation();

  const MenuItem = ({ label, emoji, screen }) => (
    <TouchableOpacity
      style={styles.menuItem}
      onPress={() => navigation.navigate(screen)}
    >
      <Text style={styles.emoji}>{emoji}</Text>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <ImageBackground
      source={require('../../assets/menu-bg.png')}
      style={styles.fullScreen}
      resizeMode="cover"
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Image
          source={require('../../assets/splash-icon.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <MenuItem emoji="🪴" label="Plant List & Water Suggestion" screen="Home" />
        <MenuItem emoji="📷" label="Identify Plant by Photo" screen="Identify" />
        <MenuItem emoji="💬" label="Chat with Others" screen="Chat" />
        <MenuItem emoji="📊" label="Water Stats" screen="WaterStats" />
        <MenuItem emoji="🤖" label="Ask AquaBot" screen="ChatBot" />
        <MenuItem emoji="🧪" label="Detect Plant Sickness" screen="PlantSickness" />
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
  },
  container: {
    paddingBottom: 40,
    alignItems: 'center',
    paddingTop: 0,
    gap: 18,
  },
  logo: {
    width: screenWidth,
    height: 200,
    marginBottom: 16,
  },
  menuItem: {
    width: '90%',
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: '#dcedc8',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
  },
  emoji: {
    fontSize: 22,
  },
  label: {
    fontSize: 18,
    color: '#2e7d32',
    fontWeight: '500',
  },
});
