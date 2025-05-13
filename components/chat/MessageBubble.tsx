import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

export interface MessageData {
  id: string;
  text: string;
  senderId: string;
  timestamp: any; // Firestore timestamp
  read?: boolean;
}

interface MessageBubbleProps {
  message: MessageData;
  isOwnMessage: boolean;
  showAvatar?: boolean;
  showTime?: boolean;
}

const MessageBubble = ({
  message,
  isOwnMessage,
  showAvatar = true,
  showTime = true,
}: MessageBubbleProps) => {
  const { theme } = useTheme();
  
  // Format timestamp
  const formatTime = (timestamp: any) => {
    if (!timestamp) return '';
    
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    
    // Return time in 12-hour format (e.g., 2:30 PM)
    return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  };

  return (
    <View
      style={[
        styles.container,
        isOwnMessage ? styles.rightContainer : styles.leftContainer,
      ]}
    >
      <View
        style={[
          styles.bubble,
          isOwnMessage
            ? [styles.ownBubble, { backgroundColor: theme.primary }]
            : [styles.otherBubble, { backgroundColor: theme.secondary }],
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: isOwnMessage ? '#ffffff' : theme.text },
          ]}
        >
          {message.text}
        </Text>
        {showTime && (
          <Text
            style={[
              styles.timeText,
              { color: isOwnMessage ? 'rgba(255,255,255,0.7)' : theme.textSecondary },
            ]}
          >
            {formatTime(message.timestamp)}
          </Text>
        )}
      </View>
      {isOwnMessage && message.read && (
        <Text style={[styles.readIndicator, { color: theme.textSecondary }]}>
          Read
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  leftContainer: {
    alignSelf: 'flex-start',
  },
  rightContainer: {
    alignSelf: 'flex-end',
  },
  bubble: {
    padding: 12,
    borderRadius: 16,
  },
  ownBubble: {
    borderBottomRightRadius: 4,
  },
  otherBubble: {
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: 'flex-end',
    fontFamily: 'Lato-Regular',
  },
  readIndicator: {
    fontSize: 10,
    marginTop: 2,
    alignSelf: 'flex-end',
    fontFamily: 'Lato-Regular',
  },
});

export default MessageBubble;