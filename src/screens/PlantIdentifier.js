import React, { useState } from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

const PLANTNET_API_KEY = '2b10qWxRmFdICB5EHcjWwYwQ9e'; // kendi API anahtarın

export default function PlantIdentifier() {
  const [imageUri, setImageUri] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async () => {
    setResult(null);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission required', 'Photo access is needed to identify plants.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: true,
      quality: 0.8,
      base64: false,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      setImageUri(image.uri);
      identifyPlant(image.uri);
    }
  };

  const identifyPlant = async (uri) => {
    setLoading(true);
    const formData = new FormData();

    formData.append('images', {
      uri: uri,
      name: 'plant.jpg',
      type: 'image/jpeg',
    });

    formData.append('organs', 'leaf'); // flower, fruit, bark da olabilir

    try {
      const response = await axios.post(
        `https://my-api.plantnet.org/v2/identify/all?api-key=${PLANTNET_API_KEY}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      const best = response.data?.results?.[0];
      if (best) {
        setResult({
          name: best.species?.scientificNameWithoutAuthor,
          common: best.species?.commonNames?.[0],
          score: Math.round(best.score * 100),
        });
      } else {
        setResult({ name: 'Not Found', score: 0 });
      }
    } catch (err) {
      console.error('PlantNet error:', err.response?.data || err.message);
      setResult({ name: 'Error', score: 0 });
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
          {result.name}
          {result.common ? ` (${result.common})` : ''} — {result.score}% match
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
