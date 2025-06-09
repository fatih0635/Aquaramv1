import { Audio } from 'expo-av';

export async function playWaterSound() {
  try {
    const { sound } = await Audio.Sound.createAsync(
      require('../../assets/notification.mp3')  // ✅ Artık sade ve kesin dosya adı
    );
    await sound.playAsync();
  } catch (error) {
    console.error('Ses çalma hatası:', error);
  }
}
