import { db } from '../firebase';
import { push, ref } from 'firebase/database';

// 📌 Firebase'e sulama verisi gönder
export async function logWatering(amount) {
  const today = new Date().toISOString().split('T')[0]; // örnek: 2025-06-04

  try {
    await push(ref(db, 'watering/'), {
      date: today,
      amount,
    });
  } catch (error) {
    console.error('Water log error:', error);
  }
}
