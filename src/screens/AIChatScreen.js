import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Button,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import axios from 'axios';

// ✅ Ana ve Yedek API Anahtarları
const PRIMARY_KEY = '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';
const BACKUP_KEY = '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';

let currentKey = PRIMARY_KEY;

export default function AIChatScreen() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: 'deepseek/deepseek-r1-0528-qwen3-8b:free',
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${currentKey}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const reply = response.data.choices[0].message;
      setMessages([...newMessages, reply]);
    } catch (err) {
      if (err.response?.status === 401 && currentKey !== BACKUP_KEY) {
        console.warn('⛔ Ana key reddedildi. Yedek keye geçiliyor...');
        currentKey = BACKUP_KEY;
        sendMessage(); // 🔁 Yeniden dene
        return;
      }

      console.log('OpenRouter Hatası:', err.response?.data || err.message);
      const errorMsg =
        err.response?.data?.error?.message || '⚠️ AquaBot error.';
      setMessages([
        ...newMessages,
        { role: 'assistant', content: errorMsg },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.message,
        item.role === 'user' ? styles.user : styles.bot,
      ]}
    >
      <Text>{item.content}</Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingBottom: 10 }}
        keyboardShouldPersistTaps="handled"
      />

      <View style={styles.inputArea}>
        <TextInput
          placeholder="Ask AquaBot anything..."
          value={input}
          onChangeText={setInput}
          style={styles.input}
          editable={!loading}
        />
        <Button
          title={loading ? 'Thinking...' : 'Send'}
          onPress={sendMessage}
          disabled={loading}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fff9',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inputArea: {
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#f0fff4',
    borderTopWidth: 1,
    borderColor: '#e0e0e0',
    gap: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 14,
    borderRadius: 8,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  message: {
    padding: 10,
    marginVertical: 4,
    borderRadius: 6,
    maxWidth: '80%',
  },
  user: {
    backgroundColor: '#e0f7fa',
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: '#e8f5e9',
    alignSelf: 'flex-start',
  },
});
