import { IconSymbol } from '@/components/ui/IconSymbol';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRef, useState } from 'react';
import { Animated, Easing, FlatList, Image, KeyboardAvoidingView, Platform, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const userId = 'me';
const otherId = 'alex';
const avatars: { [key: string]: string } = {
  me: 'https://randomuser.me/api/portraits/men/32.jpg',
  alex: 'https://randomuser.me/api/portraits/men/31.jpg',
};

const palette = ['#7F7FD5', '#E684AE', '#86A8E7', '#91EAE4', '#FEC163', '#FF6F91'];

export default function ChatScreen() {
  const [messages, setMessages] = useState<{ id: string; text: string; sender: string; reactions: { [key: string]: number } }[]>([
    { id: '1', text: 'Welcome to the chat!', sender: otherId, reactions: {} },
    { id: '2', text: 'Hi Alex!', sender: userId, reactions: {} },
  ]);
  const [input, setInput] = useState('');
  const [confetti, setConfetti] = useState(false);
  const animValue = useRef(new Animated.Value(0)).current;

  const sendMessage = () => {
    if (input.trim()) {
      setMessages(prev => [
        ...prev,
        { id: Date.now().toString(), text: input, sender: userId, reactions: {} },
      ]);
      setInput('');
      setConfetti(true);
      Animated.sequence([
        Animated.timing(animValue, { toValue: 1, duration: 400, useNativeDriver: true, easing: Easing.out(Easing.exp) }),
        Animated.timing(animValue, { toValue: 0, duration: 200, useNativeDriver: true }),
      ]).start(() => setConfetti(false));
    }
  };

  const addReaction = (msgId: string, emoji: string) => {
    setMessages(prev => prev.map(m => m.id === msgId ? { ...m, reactions: { ...m.reactions, [emoji]: (m.reactions[emoji] || 0) + 1 } } : m));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={80}
    >
      <LinearGradient colors={palette} style={{ flex: 1 }} start={{x:0,y:0}} end={{x:1,y:1}}>
        <View style={{ flex: 1, justifyContent: 'flex-end' }}>
          <FlatList
            data={messages}
            keyExtractor={item => item.id}
            renderItem={({ item }) => {
              const isMe = item.sender === userId;
              return (
                <Animated.View style={{
                  transform: [{ scale: animValue.interpolate({ inputRange: [0, 1], outputRange: [1, item.id === messages[messages.length-1]?.id ? 1.08 : 1] }) }],
                  opacity: animValue.interpolate({ inputRange: [0, 1], outputRange: [1, item.id === messages[messages.length-1]?.id ? 1 : 1] })
                }}>
                  <View style={[styles.row, { justifyContent: isMe ? 'flex-end' : 'flex-start' }] }>
                    {!isMe && <View style={styles.avatarRing}><Image source={{ uri: avatars[item.sender] }} style={styles.avatar} /></View>}
                    <View style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleOther, { shadowColor: palette[isMe ? 0 : 1] }] }>
                      <Text style={[styles.text, isMe ? styles.textMe : styles.textOther]}>{item.text}</Text>
                      <View style={styles.reactionRow}>
                        {['👍','😂','🔥','💜','🎉'].map(emoji => (
                          <TouchableOpacity key={emoji} onPress={() => addReaction(item.id, emoji)}><Text style={{ fontSize: 18, marginHorizontal: 2 }}>{emoji}{item.reactions[emoji] ? ` ${item.reactions[emoji]}` : ''}</Text></TouchableOpacity>
                        ))}
                      </View>
                    </View>
                    {isMe && <View style={styles.avatarRing}><Image source={{ uri: avatars[item.sender] }} style={styles.avatar} /></View>}
                  </View>
                </Animated.View>
              );
            }}
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingVertical: 16 }}
            keyboardShouldPersistTaps="handled"
          />
          <BlurView intensity={60} tint="light" style={styles.inputBarBlur}>
            <View style={styles.inputRow}>
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                style={styles.input}
                placeholderTextColor="#8e9edb"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
                <IconSymbol name="paperplane.fill" size={22} color="#fff" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.fab}>
                <Text style={{ fontSize: 24 }}>➕</Text>
              </TouchableOpacity>
            </View>
          </BlurView>
          {confetti && <View style={styles.confetti}><Text style={{ fontSize: 40 }}>🎊🎉✨</Text></View>}
        </View>
      </LinearGradient>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  bg: {
    flex: 1,
    backgroundColor: 'linear-gradient(180deg, #e6f0fa 0%, #f8f9fa 100%)',
    padding: 0,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 10,
    paddingHorizontal: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginHorizontal: 4,
  },
  bubble: {
    maxWidth: '70%',
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 16,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bubbleMe: {
    backgroundColor: '#7F7FD5',
    borderBottomRightRadius: 4,
  },
  bubbleOther: {
    backgroundColor: '#fff',
    borderBottomLeftRadius: 4,
    borderWidth: 1,
    borderColor: '#e0e8f0',
  },
  text: {
    fontSize: 16,
  },
  textMe: {
    color: '#fff',
  },
  textOther: {
    color: '#222',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  input: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 24,
    backgroundColor: '#f0f4f8',
    paddingVertical: 10,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 8,
    color: '#222',
  },
  sendBtn: {
    backgroundColor: '#7F7FD5',
    borderRadius: 24,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7F7FD5',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  avatarRing: { borderWidth: 2, borderColor: '#E684AE', borderRadius: 20, padding: 2, marginHorizontal: 2 },
  inputBarBlur: { position: 'absolute', left: 0, right: 0, bottom: 0, zIndex: 10 },
  reactionRow: { flexDirection: 'row', marginTop: 4, justifyContent: 'flex-end' },
  fab: { backgroundColor: '#FEC163', borderRadius: 24, padding: 10, marginLeft: 6, shadowColor: '#FEC163', shadowOpacity: 0.2, shadowRadius: 6, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  confetti: { position: 'absolute', top: 60, left: 0, right: 0, alignItems: 'center', zIndex: 20 },
  text: { fontFamily: 'System', fontWeight: '700', fontSize: 18 },
}); 