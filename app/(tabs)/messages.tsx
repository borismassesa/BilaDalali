import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Search, MessageCircle } from 'lucide-react-native';
import Input from '@/components/common/Input';
import { getRelativeTime } from '@/utils/formatting';

// Mock data for conversations
const mockConversations = [
  {
    id: '1',
    recipientId: 'user1',
    recipientName: 'Maria Joseph',
    recipientPhoto: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg',
    lastMessage: 'Is the apartment still available?',
    timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
    unread: 2,
    propertyTitle: 'Spacious 2 Bedroom Apartment',
  },
  {
    id: '2',
    recipientId: 'user2',
    recipientName: 'John Mbwambo',
    recipientPhoto: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    lastMessage: 'Thank you for your interest. When would you like to view the property?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    unread: 0,
    propertyTitle: 'Modern Single Room, Self-Contained',
  },
  {
    id: '3',
    recipientId: 'user3',
    recipientName: 'Sarah Kimaro',
    recipientPhoto: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg',
    lastMessage: 'Is water included in the rent?',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 day ago
    unread: 0,
    propertyTitle: 'Furnished 3 Bedroom House',
  },
];

const MessagesScreen = () => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const [conversations, setConversations] = useState(mockConversations);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading conversations
  useEffect(() => {
    // This would normally be a Firestore call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter conversations based on search query
  const filteredConversations = searchQuery
    ? conversations.filter(
        (conversation) =>
          conversation.recipientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          conversation.propertyTitle.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : conversations;

  // Navigate to chat
  const navigateToChat = (conversationId: string) => {
    router.push(`/chat/${conversationId}`);
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={[styles.searchContainer, { borderColor: theme.border }]}>
        <Input
          placeholder="Search messages..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<Search size={20} color={theme.textSecondary} />}
          containerStyle={{ marginBottom: 0 }}
        />
      </View>

      {filteredConversations.length === 0 ? (
        <View style={styles.emptyContainer}>
          <MessageCircle size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Messages Yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {searchQuery
              ? "No messages match your search criteria."
              : "When you contact landlords or receive messages, they'll appear here."}
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredConversations}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={[
                styles.conversationItem,
                { borderColor: theme.border },
              ]}
              onPress={() => navigateToChat(item.id)}
            >
              <Image
                source={{ uri: item.recipientPhoto }}
                style={styles.avatar}
              />
              <View style={styles.conversationDetails}>
                <View style={styles.conversationHeader}>
                  <Text
                    style={[styles.recipientName, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {item.recipientName}
                  </Text>
                  <Text
                    style={[styles.timestamp, { color: theme.textSecondary }]}
                  >
                    {getRelativeTime(item.timestamp)}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.propertyTitle,
                    { color: theme.primary },
                  ]}
                  numberOfLines={1}
                >
                  {item.propertyTitle}
                </Text>
                <View style={styles.messageRow}>
                  <Text
                    style={[
                      styles.lastMessage,
                      {
                        color: item.unread > 0 ? theme.text : theme.textSecondary,
                        fontFamily: item.unread > 0 ? 'Lato-Bold' : 'Lato-Regular',
                      },
                    ]}
                    numberOfLines={1}
                  >
                    {item.lastMessage}
                  </Text>
                  {item.unread > 0 && (
                    <View
                      style={[styles.unreadBadge, { backgroundColor: theme.primary }]}
                    >
                      <Text style={styles.unreadCount}>{item.unread}</Text>
                    </View>
                  )}
                </View>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={
            filteredConversations.length === 0 && styles.emptyList
          }
        />
      )}
    </View>
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
  searchContainer: {
    padding: 16,
    borderBottomWidth: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: 'Lato-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 300,
  },
  emptyList: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  conversationItem: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 12,
  },
  conversationDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  recipientName: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    flex: 1,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  propertyTitle: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    marginBottom: 4,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    flex: 1,
  },
  unreadBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Lato-Bold',
  },
});

export default MessagesScreen;