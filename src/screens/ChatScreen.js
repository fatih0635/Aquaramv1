import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, StyleSheet } from 'react-native';
import { db } from '../firebase';
import { ref, push, onValue, remove } from 'firebase/database';

export default function ChatScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const messagesRef = ref(db, 'messages/');
    onValue(messagesRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formatted = Object.values(data);
        setMessages(formatted.reverse());
      } else {
        setMessages([]); // boşsa listeyi temizle
      }
    });
  }, []);

  const sendMessage = () => {
    if (!message.trim()) return;
    push(ref(db, 'messages/'), {
      text: message,
      timestamp: Date.now(),
    });
    setMessage('');
  };

  const resetChat = async () => {
    try {
      await remove(ref(db, 'messages/'));
      alert('🧹 Chat has been cleared.');
    } catch (error) {
      console.error('Chat reset failed:', error);
      alert('❌ Failed to reset chat.');
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <Text style={styles.msg}>{item.text}</Text>}
        inverted
      />
      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Write a message..."
        style={styles.input}
      />
      <Button title="Send" onPress={sendMessage} />
      <View style={{ marginTop: 12 }}>
        <Button title="Reset Chat" onPress={resetChat} color="#d32f2f" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f0fff4' },
  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    marginTop: 12,
  },
  msg: {
    backgroundColor: '#e6ffe6',
    padding: 10,
    marginVertical: 4,
    borderRadius: 6,
  },
});
