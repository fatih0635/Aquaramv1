import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

export default function PlantItem({ name, room, onDelete }) {
  return (
    <View style={styles.item}>
      <View>
        <Text style={styles.name}>{name}</Text>
        <Text style={styles.room}>{room}</Text>
      </View>
      <Pressable onPress={onDelete}>
        <Text style={styles.delete}>🗑️</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#e6ffe6',
    marginVertical: 6,
    padding: 12,
    borderRadius: 8,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  name: { fontSize: 16, fontWeight: 'bold' },
  room: { fontSize: 14, color: 'gray' },
  delete: { fontSize: 20, color: 'red' },
});
