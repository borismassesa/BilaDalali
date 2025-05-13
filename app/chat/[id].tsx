import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Send, ArrowLeft, Phone, Info, Image as ImageIcon } from 'lucide-react-native';
import MessageBubble, { MessageData } from '@/components/chat/MessageBubble';
import * as ImagePicker from 'expo-image-picker';

// Mock conversation data
const mockConversation = {
  id: '1',
  recipientId: 'user1',
  recipientName: 'Maria Joseph',
  recipientPhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
  property: {
    id: '1',
    title: 'Spacious 2 Bedroom Apartment',
    imageUrl: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
  },
};

// Mock messages data
const mockMessages: MessageData[] = [
  {
    id: 'm1',
    text: 'Hello, I\'m interested in your property listing. Is it still available?',
    senderId: 'user1',
    timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
    read: true,
  },
  {
    id: 'm2',
    text: 'Yes, it\'s still available! When would you like to view it?',
    senderId: 'current_user', // This will be replaced with actual user ID
    timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
    read: true,
  },
  {
    id: 'm3',
    text: 'Great! Is tomorrow afternoon around 3 PM possible?',
    senderId: 'user1',
    timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
    read: true,
  },
  {
    id: 'm4',
    text: 'That works for me. I\'ll see you at the property tomorrow at 3 PM.',
    senderId: 'current_user',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
    read: true,
  },
  {
    id: 'm5',
    text: 'Perfect, thank you! Could you also please confirm the exact address?',
    senderId: 'user1',
    timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
    read: true,
  },
];

const ChatScreen = () => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const params = useLocalSearchParams();
  const conversationId = params.id as string;
  
  const [conversation, setConversation] = useState<any>(null);
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSending, setIsSending] = useState(false);
  
  const flatListRef = useRef<FlatList>(null);

  // Load conversation and messages data
  useEffect(() => {
    // This would normally be a Firestore call
    setTimeout(() => {
      setConversation(mockConversation);
      
      // Replace the current_user placeholder with the actual user ID
      const formattedMessages = mockMessages.map(msg => ({
        ...msg,
        senderId: msg.senderId === 'current_user' ? userData?.uid || 'current_user' : msg.senderId,
      }));
      
      setMessages(formattedMessages);
      setIsLoading(false);
    }, 1000);
  }, [conversationId, userData?.uid]);

  // Send a message
  const sendMessage = () => {
    if (!messageText.trim()) return;
    
    // Prepare new message object
    const newMessage: MessageData = {
      id: `m${Date.now()}`,
      text: messageText.trim(),
      senderId: userData?.uid || 'current_user',
      timestamp: new Date(),
      read: false,
    };
    
    // Add to messages state (optimistic update)
    setMessages(prevMessages => [...prevMessages, newMessage]);
    setMessageText('');
    setIsSending(true);
    
    // Simulate API call to send message
    setTimeout(() => {
      setIsSending(false);
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 500);
  };

  // Pick and send image
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.8,
      });
      
      if (!result.canceled && result.assets && result.assets[0].uri) {
        // In a real app, you would upload the image to storage
        // and send a message with the image URL
        console.log('Image selected:', result.assets[0].uri);
        
        // For now, we'll just mock sending an image message
        const newMessage: MessageData = {
          id: `m${Date.now()}`,
          text: '📷 Image sent', // This would be an image URL in a real app
          senderId: userData?.uid || 'current_user',
          timestamp: new Date(),
          read: false,
        };
        
        setMessages(prevMessages => [...prevMessages, newMessage]);
        
        // Scroll to bottom
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <ArrowLeft size={24} color={theme.text} />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.userInfo}
          onPress={() => router.push(`/users/${conversation.recipientId}`)}
        >
          <Image source={{ uri: conversation.recipientPhoto }} style={styles.userPhoto} />
          <View>
            <Text style={[styles.userName, { color: theme.text }]}>
              {conversation.recipientName}
            </Text>
            <Text style={[styles.userStatus, { color: theme.primary }]}>
              Online
            </Text>
          </View>
        </TouchableOpacity>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Phone size={20} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Info size={20} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Property Card (if available) */}
      {conversation.property && (
        <TouchableOpacity 
          style={[styles.propertyCard, { backgroundColor: theme.card, borderColor: theme.border }]}
          onPress={() => router.push(`/listings/${conversation.property.id}`)}
        >
          <Image source={{ uri: conversation.property.imageUrl }} style={styles.propertyImage} />
          <View style={styles.propertyInfo}>
            <Text style={[styles.propertyTitle, { color: theme.text }]} numberOfLines={1}>
              {conversation.property.title}
            </Text>
            <Text style={[styles.propertyTag, { color: theme.primary }]}>
              Conversation about this property
            </Text>
          </View>
        </TouchableOpacity>
      )}
      
      {/* Messages */}
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MessageBubble
            message={item}
            isOwnMessage={item.senderId === userData?.uid}
          />
        )}
        contentContainerStyle={styles.messagesContainer}
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />
      
      {/* Message Input */}
      <View style={[styles.inputContainer, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <TouchableOpacity style={styles.attachButton} onPress={pickImage}>
          <ImageIcon size={24} color={theme.primary} />
        </TouchableOpacity>
        
        <TextInput
          style={[styles.input, { color: theme.text, backgroundColor: theme.secondary }]}
          placeholder="Type a message..."
          placeholderTextColor={theme.textSecondary}
          value={messageText}
          onChangeText={setMessageText}
          multiline
        />
        
        <TouchableOpacity
          style={[
            styles.sendButton,
            { backgroundColor: messageText.trim() ? theme.primary : theme.secondary },
          ]}
          onPress={sendMessage}
          disabled={!messageText.trim() || isSending}
        >
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Send size={20} color={messageText.trim() ? '#fff' : theme.textSecondary} />
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  backButton: {
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 12,
  },
  userName: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
  },
  userStatus: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  headerActions: {
    flexDirection: 'row',
  },
  headerButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  propertyCard: {
    flexDirection: 'row',
    padding: 12,
    borderBottomWidth: 1,
  },
  propertyImage: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginRight: 12,
  },
  propertyInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  propertyTitle: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    marginBottom: 4,
  },
  propertyTag: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  messagesContainer: {
    flexGrow: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderTopWidth: 1,
  },
  attachButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    maxHeight: 100,
    marginHorizontal: 8,
    fontFamily: 'Lato-Regular',
    fontSize: 14,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChatScreen;