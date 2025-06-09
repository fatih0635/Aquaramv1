import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// 📍 Bildirim izinlerini iste
export async function requestNotificationPermission() {
  try {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      const { status: newStatus } = await Notifications.requestPermissionsAsync();
      if (newStatus !== 'granted') {
        alert('⚠️ Notification permission is required!');
      }
    }
  } catch (error) {
    console.error('Bildirim izni alınamadı:', error);
  }
}

// 🔔 Bitki için bildirim planla (test: 10 saniye sonra)
export async function scheduleWateringNotification(plantName) {
  try {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: `💧 Water ${plantName}`,
        body: `It's time to water your plant!`,
        sound: 'default',
      },
      trigger: { seconds: 10 }, // test için 10 saniye sonra
    });
  } catch (error) {
    console.error('Bildirim gönderilemedi:', error);
  }
}
