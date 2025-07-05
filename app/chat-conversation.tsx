import { IconSymbol } from '@/components/ui/IconSymbol';
import { MagicGradients, MagicPalette } from '@/constants/Colors';
import { LinearGradient } from 'expo-linear-gradient';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Types for chat data
interface ChatMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  timestamp: string;
}

interface ChatUser {
  name: string;
  avatar: string;
  title: string;
  company: string;
  isOnline: boolean;
}

// Mock chat messages for different conversations
const mockChatMessages: Record<string, ChatMessage[]> = {
  '1': [
    {
      id: '1',
      text: 'Hey! I saw you\'re into tech startups. Would love to connect!',
      sender: 'them' as const,
      timestamp: '2:30 PM',
    },
    {
      id: '2',
      text: 'Hi! Thanks for reaching out. I\'d love to chat about your experience!',
      sender: 'me' as const,
      timestamp: '2:32 PM',
    },
    {
      id: '3',
      text: 'Absolutely! I\'ve been working in the startup space for about 5 years now. What specifically interests you?',
      sender: 'them' as const,
      timestamp: '2:35 PM',
    },
    {
      id: '4',
      text: 'I\'m particularly interested in product development and user experience. Do you have any advice for someone just starting out?',
      sender: 'me' as const,
      timestamp: '2:37 PM',
    },
  ],
  '2': [
    {
      id: '1',
      text: 'Thanks for the connection request! Let\'s chat about design collaboration.',
      sender: 'them' as const,
      timestamp: '15m ago',
    },
    {
      id: '2',
      text: 'I\'d love to collaborate on some design projects! What kind of work are you looking for?',
      sender: 'me' as const,
      timestamp: '10m ago',
    },
  ],
  '3': [
    {
      id: '1',
      text: 'Your startup idea sounds interesting. When are you free to discuss?',
      sender: 'them' as const,
      timestamp: '1h ago',
    },
    {
      id: '2',
      text: 'I\'m available tomorrow afternoon. Would that work for you?',
      sender: 'me' as const,
      timestamp: '45m ago',
    },
    {
      id: '3',
      text: 'Perfect! Let\'s schedule it for 2 PM tomorrow.',
      sender: 'them' as const,
      timestamp: '30m ago',
    },
  ],
};

// Mock user data for different chat conversations
const mockChatUsers: Record<string, ChatUser> = {
  '1': {
    name: 'Alex Chen',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    title: 'Senior Product Manager',
    company: 'TechCorp',
    isOnline: true,
  },
  '2': {
    name: 'Sarah Johnson',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    title: 'UX Designer',
    company: 'Design Studio',
    isOnline: false,
  },
  '3': {
    name: 'Mike Rodriguez',
    avatar: 'https://randomuser.me/api/portraits/men/45.jpg',
    title: 'Startup Founder',
    company: 'InnovateLab',
    isOnline: true,
  },
};

export default function ChatConversationScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const { t } = useTranslation();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState(mockChatMessages[chatId as string] || []);

  const chatUser = mockChatUsers[chatId as string];

  const sendMessage = () => {
    if (message.trim()) {
      const newMessage: ChatMessage = {
        id: Date.now().toString(),
        text: message.trim(),
        sender: 'me',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages([...messages, newMessage]);
      setMessage('');
    }
  };

  const renderMessage = ({ item }: { item: ChatMessage }) => (
    <View style={[
      styles.messageContainer,
      item.sender === 'me' ? styles.myMessage : styles.theirMessage
    ]}>
      <LinearGradient 
        colors={item.sender === 'me' 
          ? MagicGradients.purple as [string, string, ...string[]]
          : ['#f0f0f0', '#f0f0f0']
        } 
        style={[
          styles.messageBubble,
          item.sender === 'me' ? styles.myBubble : styles.theirBubble
        ]}
      >
        <Text style={[
          styles.messageText,
          item.sender === 'me' ? styles.myMessageText : styles.theirMessageText
        ]}>
          {item.text}
        </Text>
        <Text style={[
          styles.timestamp,
          item.sender === 'me' ? styles.myTimestamp : styles.theirTimestamp
        ]}>
          {item.timestamp}
        </Text>
      </LinearGradient>
    </View>
  );

  if (!chatUser) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>Chat not found</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient colors={MagicGradients.main as [string, string, ...string[]]} style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="chevron.left" size={24} color={MagicPalette.white} />
        </TouchableOpacity>
        
        <View style={styles.userInfo}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: chatUser.avatar }} style={styles.avatar} />
            {chatUser.isOnline && <View style={styles.onlineIndicator} />}
          </View>
          <View style={styles.userDetails}>
            <Text style={styles.userName}>{chatUser.name}</Text>
            <Text style={styles.userStatus}>
              {chatUser.isOnline ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.aiTranslatorButton}>
            <IconSymbol name="translate" size={20} color={MagicPalette.white} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.moreButton}>
            <IconSymbol name="ellipsis" size={20} color={MagicPalette.white} />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Messages */}
      <FlatList
        data={messages}
        keyExtractor={item => item.id}
        renderItem={renderMessage}
        style={styles.messagesList}
        contentContainerStyle={styles.messagesContent}
        inverted={false}
      />

      {/* Message Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          placeholder={t('chat.inputPlaceholder')}
          value={message}
          onChangeText={setMessage}
          multiline
          maxLength={500}
        />
        <TouchableOpacity 
          style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]} 
          onPress={sendMessage}
          disabled={!message.trim()}
        >
          <IconSymbol 
            name="arrow.up.circle.fill" 
            size={32} 
            color={message.trim() ? MagicPalette.purple : MagicPalette.darkGray} 
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingTop: 50,
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: MagicPalette.white,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: MagicPalette.green,
    borderWidth: 2,
    borderColor: MagicPalette.white,
  },
  userDetails: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: MagicPalette.white,
    marginBottom: 2,
  },
  userStatus: {
    fontSize: 12,
    color: MagicPalette.white,
    opacity: 0.8,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiTranslatorButton: {
    padding: 8,
    marginRight: 8,
  },
  moreButton: {
    padding: 8,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  myMessage: {
    alignItems: 'flex-end',
  },
  theirMessage: {
    alignItems: 'flex-start',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
    shadowColor: MagicPalette.purple,
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  myBubble: {
    borderBottomRightRadius: 4,
  },
  theirBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  myMessageText: {
    color: MagicPalette.white,
  },
  theirMessageText: {
    color: MagicPalette.darkGray,
  },
  timestamp: {
    fontSize: 11,
    opacity: 0.7,
  },
  myTimestamp: {
    color: MagicPalette.white,
    textAlign: 'right',
  },
  theirTimestamp: {
    color: MagicPalette.darkGray,
    textAlign: 'left',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 16,
    backgroundColor: MagicPalette.white,
    borderTopWidth: 1,
    borderTopColor: MagicPalette.lightGray,
  },
  textInput: {
    flex: 1,
    backgroundColor: MagicPalette.lightGray,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
    fontSize: 16,
  },
  sendButton: {
    padding: 4,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  errorText: {
    textAlign: 'center',
    marginTop: 100,
    fontSize: 16,
    color: MagicPalette.darkGray,
  },
}); 