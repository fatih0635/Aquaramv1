import React from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { plantCategories } from '../data/plantCategories';

export default function PlantSelectionScreen({ navigation }) {
  const onSelect = (plant) => {
    navigation.navigate('Home', { selectedPlant: plant });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {plantCategories.map((group) => (
        <View key={group.category} style={styles.group}>
          <Text style={styles.category}>{group.category}</Text>
          {group.plants.map((plant) => (
            <Button
              key={plant.name}
              title={plant.name}
              onPress={() => onSelect(plant)}
            />
          ))}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f0fff4',
  },
  group: {
    marginBottom: 24,
  },
  category: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2e7d32',
  },
});
