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

// ✅ OpenRouter API bilgileri
const API_KEY = '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';
const MODEL = 'deepseek/deepseek-r1-0528-qwen3-8b:free';

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
    console.log('📤 Gönderilen mesajlar (OpenRouter):', newMessages);
    
    try {
      const response = await axios.post(
        'https://openrouter.ai/api/v1/chat/completions',
        {
          model: MODEL,
          messages: newMessages,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:8081',
            'X-Title': 'Aquaram',
          },
        }
      );

      const reply = response.data.choices[0].message;
      console.log('📥 AquaBot cevabı:', reply);
      setMessages([...newMessages, reply]);
    } catch (err) {
      console.error('❌ Axios error:', err.response?.data || err.message);
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: '❌ AquaBot yanıt veremedi. Lütfen daha sonra tekrar deneyin.',
        },
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
    backgroundColor: '#f0fff4',
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  inputArea: {
    marginTop: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: '#e8f5e9',
    borderTopWidth: 1,
    borderColor: '#c8e6c9',
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
    backgroundColor: '#d1f5ff',
    alignSelf: 'flex-end',
  },
  bot: {
    backgroundColor: '#f1f8e9',
    alignSelf: 'flex-start',
  },
});
