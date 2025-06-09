import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Image,
  TouchableOpacity,
} from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import PlantItem from '../components/PlantItem';
import {
  getWeatherByCity,
  calculateWeatherEffect,
} from '../utils/WeatherHelper';
import {
  requestNotificationPermission,
  scheduleWateringNotification,
} from '../utils/NotificationHelper';
import { playWaterSound } from '../utils/AudioHelper';
import { logWatering } from '../utils/FirebaseWaterHelper';

export default function HomeScreen() {
  const navigation = useNavigation();
  const route = useRoute();

  const [plants, setPlants] = useState([]);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [city, setCity] = useState('');
  const [selectedPlant, setSelectedPlant] = useState(null);
  const [lastWateredMessage, setLastWateredMessage] = useState('');
  const [waterMessage, setWaterMessage] = useState('');
  const [weatherIcon, setWeatherIcon] = useState('');
  const [weatherDesc, setWeatherDesc] = useState('');
  const [temperature, setTemperature] = useState(null);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      if (route.params?.selectedPlant) {
        setSelectedPlant(route.params.selectedPlant);
      }
    }, [route.params])
  );

  const addPlant = () => {
    if (!name || !room) return;

    if (!city) {
      setLastWateredMessage('⚠️ Please enter a city before adding a plant.');
      return;
    } else {
      setLastWateredMessage('');
    }

    if (temperature === null) {
      setLastWateredMessage('❗ Please fetch weather and select a plant.');
      return;
    }

    const base = selectedPlant?.base || 200;
    const rain = 0;
    const weatherEffect = calculateWeatherEffect(temperature, rain);
    const finalAmount = Math.max(base + weatherEffect, 50);

    setPlants([
      ...plants,
      {
        id: Date.now().toString(),
        name,
        room,
        type: selectedPlant?.name || 'manual',
      },
    ]);

    scheduleWateringNotification(name);
    playWaterSound();
    logWatering(finalAmount);

    setLastWateredMessage(`${selectedPlant?.name || name} → ${finalAmount}ml logged.`);

    setName('');
    setRoom('');
  };

  const deletePlant = (id) => {
    setPlants(plants.filter((p) => p.id !== id));
  };

  const fetchWeather = async () => {
    if (!city) {
      setWaterMessage('Please enter a city name.');
      return;
    }

    const weather = await getWeatherByCity(city);
    if (!weather) {
      setWaterMessage('⚠️ Weather data unavailable.');
      return;
    }

    setWeatherIcon(weather.icon);
    setWeatherDesc(weather.description);
    setTemperature(weather.temp);

    const base = selectedPlant?.base || 200;
    const weatherEffect = calculateWeatherEffect(weather.temp, weather.rain);
    const finalAmount = Math.max(base + weatherEffect, 50);
    const plantLabel = selectedPlant?.name || name;

    setWaterMessage(
      `🌿 ${plantLabel} in ${city} → Suggest watering ${finalAmount}ml today.`
    );
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.outerContainer}
    >
      <Text style={styles.title}>🌱 AquaRam - Smart Plant Care</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Plant Name"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />
        <TextInput
          placeholder="Room"
          value={room}
          onChangeText={setRoom}
          style={styles.input}
        />

        <View style={styles.row}>
          <TouchableOpacity
            style={styles.selectButton}
            onPress={() => navigation.navigate('SelectPlant')}
          >
            <Text style={styles.selectButtonText}>
              {selectedPlant ? `🌿 ${selectedPlant.name}` : 'Select Plant'}
            </Text>
          </TouchableOpacity>

          {selectedPlant && (
            <TouchableOpacity
              onPress={() => setSelectedPlant(null)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteButtonText}>❌</Text>
            </TouchableOpacity>
          )}
        </View>

        <Button title="Add Plant" onPress={addPlant} />
      </View>

      <FlatList
        data={plants}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PlantItem name={item.name} room={item.room} onDelete={() => deletePlant(item.id)} />
        )}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No plants yet. Add one above.</Text>
        }
        contentContainerStyle={
          plants.length === 0 && { flexGrow: 1, justifyContent: 'center' }
        }
      />

      <View style={styles.weatherContainer}>
        <TextInput
          placeholder="Enter your city"
          value={city}
          onChangeText={(text) => {
            setCity(text);
            if (text) setLastWateredMessage('');
          }}
          style={styles.input}
        />
        <Button title="Get Water Suggestion" onPress={fetchWeather} />

        {weatherIcon && (
          <View style={{ alignItems: 'center', marginTop: 10 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {city} - {weatherDesc}
            </Text>
            <Image
              source={{ uri: `https://openweathermap.org/img/wn/${weatherIcon}@2x.png` }}
              style={{ width: 80, height: 80 }}
            />
            <Text style={{ fontSize: 16 }}>{temperature}°C</Text>
          </View>
        )}

        {waterMessage ? <Text style={styles.waterMsg}>{waterMessage}</Text> : null}
        {lastWateredMessage ? (
          <Text style={styles.confirmMsg}>{lastWateredMessage}</Text>
        ) : null}
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#f0fff4',
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2e7d32',
    textAlign: 'center',
    marginBottom: 20,
  },
  inputContainer: {
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
  },
  selectButton: {
    flex: 1,
    backgroundColor: '#c8e6c9',
    padding: 10,
    borderRadius: 6,
  },
  selectButtonText: {
    textAlign: 'center',
    color: '#2e7d32',
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: '#ffcdd2',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 6,
    marginLeft: 10,
  },
  deleteButtonText: {
    color: 'red',
    fontSize: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
    gap: 10,
  },
  emptyText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#999',
    marginTop: 50,
  },
  weatherContainer: {
    marginTop: 24,
    paddingBottom: 20,
  },
  waterMsg: {
    marginTop: 10,
    fontSize: 16,
    color: '#2e7d32',
    textAlign: 'center',
  },
  confirmMsg: {
    marginTop: 10,
    fontSize: 16,
    color: '#388e3c',
    textAlign: 'center',
    fontStyle: 'italic',
  },
});
