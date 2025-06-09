import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../firebase';
import { ref, onValue } from 'firebase/database';

export default function WaterStatsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [dailyTotals, setDailyTotals] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const wateringRef = ref(db, 'watering/');
    onValue(wateringRef, (snapshot) => {
      const data = snapshot.val();
      const totals = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun

      if (data) {
        Object.values(data).forEach((entry) => {
          const dayIndex = new Date(entry.date).getDay(); // 0=pazar
          const adjustedDay = dayIndex === 0 ? 6 : dayIndex - 1; // 0'ı sona at
          totals[adjustedDay] += entry.amount;
        });
      }

      setDailyTotals(totals);
    });
  }, []);

  const data = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [
      {
        data: dailyTotals,
        strokeWidth: 2,
      },
    ],
  };

  const chartConfig = {
    backgroundColor: '#e6ffe6',
    backgroundGradientFrom: '#f0fff4',
    backgroundGradientTo: '#ffffff',
    decimalPlaces: 0,
    color: (opacity = 1) => `rgba(46, 125, 50, ${opacity})`,
    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    style: { borderRadius: 8 },
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📊 Weekly Water Usage</Text>
      <LineChart
        data={data}
        width={screenWidth - 32}
        height={220}
        chartConfig={chartConfig}
        bezier
        style={styles.chart}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#f0fff4' },
  title: { fontSize: 20, marginBottom: 16, fontWeight: 'bold', color: '#2e7d32' },
  chart: { borderRadius: 12 },
});

