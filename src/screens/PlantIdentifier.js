import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const PLANT_ID_API_KEY = 'MzZqUVyyEVH48dSRjYgmwwMiNHSriQS9rAsVlipgp6pKJMYTA2';

export default function PlantIdentifier() {
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setResult(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.granted === false) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      base64: true,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      identifyPlant(result.assets[0].base64);
    }
  };

  const identifyPlant = async (base64) => {
    setLoading(true);
    try {
      const response = await axios.post('https://api.plant.id/v2/identify', {
        images: [`data:image/jpeg;base64,${base64}`],
        organs: ['leaf'],
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Api-Key': PLANT_ID_API_KEY,
        },
      });

      const suggestion = response.data?.suggestions?.[0];
      if (suggestion) {
        setResult({
          name: suggestion.plant_name,
          probability: Math.round(suggestion.probability * 100),
        });
      } else {
        setResult({ name: 'Not Found', probability: 0 });
      }
    } catch (error) {
      console.error('API Error:', error);
      setResult({ name: 'Error', probability: 0 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🌿 Identify Plant by Photo</Text>
      <Button title="Pick an Image" onPress={pickImage} />
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      {loading && <ActivityIndicator size="large" color="#2e7d32" />}
      {result && (
        <Text style={styles.result}>
          {result.name} ({result.probability}% match)
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, paddingTop: 60, backgroundColor: '#f0fff4' },
  title: { fontSize: 20, textAlign: 'center', marginBottom: 20, color: '#2e7d32' },
  image: { width: '100%', height: 300, marginVertical: 20, borderRadius: 12 },
  result: { fontSize: 18, textAlign: 'center', color: '#1b5e20', marginTop: 10 },
});
