import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const PLANT_ID_API_KEY = 'MzZqUVyyEVH48dSRjYgmwwMiNHSriQS9rAsVlipgp6pKJMYTA2';

export default function PlantSicknessScreen() {
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setResult(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      detectDisease(result.assets[0].base64);
    }
  };

  const detectDisease = async (base64) => {
    setLoading(true);
    try {
      const response = await axios.post(
        'https://api.plant.id/v2/health_assessment',
        {
          images: [`data:image/jpeg;base64,${base64}`],
          // Optional: add "similar_images": true
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Api-Key': PLANT_ID_API_KEY,
          },
        }
      );

      const issues = response.data?.health_assessment?.diseases;
      if (issues?.length > 0) {
        const main = issues[0];
        setResult(`${main.name} (${Math.round(main.probability * 100)}%)`);
      } else {
        setResult('Your plant looks healthy!');
      }
    } catch (error) {
      console.error('Health API Error:', error);
      setResult('❌ Failed to detect plant sickness.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🧪 Detect Plant Sickness</Text>
      <Button title="Pick a Leaf Photo" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#2e7d32" />}
      {result && <Text style={styles.result}>{result}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f0fff4' },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20, color: '#2e7d32' },
  image: { width: '100%', height: 300, marginVertical: 20, borderRadius: 12 },
  result: { fontSize: 18, textAlign: 'center', color: '#1b5e20', marginTop: 10 },
});
