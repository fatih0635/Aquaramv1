import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Button } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../firebase';
import { ref, onValue, remove } from 'firebase/database';

export default function WaterStatsScreen() {
  const screenWidth = Dimensions.get('window').width;
  const [dailyTotals, setDailyTotals] = useState([0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    const wateringRef = ref(db, 'watering/');
    const unsubscribe = onValue(wateringRef, (snapshot) => {
      const data = snapshot.val();
      const totals = [0, 0, 0, 0, 0, 0, 0]; // Mon-Sun

      if (data) {
        Object.values(data).forEach((entry) => {
          const dayIndex = new Date(entry.date).getDay(); // 0=pazar
          const adjustedDay = dayIndex === 0 ? 6 : dayIndex - 1;
          totals[adjustedDay] += entry.amount;
        });
      }

      setDailyTotals(totals);
    });

    return () => unsubscribe(); // Cleanup
  }, []);

  const resetChartData = async () => {
    try {
      await remove(ref(db, 'watering/'));
      alert('✅ Watering data has been cleared.');
    } catch (error) {
      console.error('Reset failed:', error);
      alert('❌ Failed to reset data.');
    }
  };

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
      <View style={styles.buttonWrapper}>
        <Button title="Reset Chart Data" onPress={resetChartData} color="#d32f2f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: 'center', backgroundColor: '#f0fff4' },
  title: { fontSize: 20, marginBottom: 16, fontWeight: 'bold', color: '#2e7d32' },
  chart: { borderRadius: 12 },
  buttonWrapper: { marginTop: 20, width: '80%' },
});
