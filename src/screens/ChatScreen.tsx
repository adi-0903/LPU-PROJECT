import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../theme';
import { PRESET_CHAT_REPLIES } from '../data/mentors';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { Icon } from '../components/Icon';
import { Avatar } from '../components/Avatar';

interface ChatScreenProps {
  onBack: () => void;
  initialMessage?: string;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({ onBack, initialMessage }) => {
  const { chatMessages, sendChatMessage } = useApp();
  const { t } = useLanguage();

  const [inputText, setInputText] = useState(initialMessage || '');
  const scrollRef = useRef<any>(null);

  useEffect(() => {
    // Scroll to bottom on new messages
    setTimeout(() => {
      scrollRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [chatMessages]);

  const handleSend = (textToSend?: string) => {
    const msg = (textToSend !== undefined ? textToSend : inputText).trim();
    if (!msg) return;
    sendChatMessage(msg);
    setInputText('');
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      {/* Chat Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={onBack}
          style={styles.backButton}
          accessibilityRole="button"
          accessibilityLabel="Back to Buddy tab"
        >
          <Icon name="arrow-left" size={20} color={colors.secondary} />
        </TouchableOpacity>

        <Avatar name="Rohan Sharma" size="sm" showStatus status="online" />

        <View style={styles.headerInfo}>
          <Text style={styles.mentorName}>Rohan Sharma</Text>
          <Text style={styles.mentorStatus}>Senior Mentor • Online</Text>
        </View>

        <View style={styles.hostelTag}>
          <Text style={styles.hostelTagText}>BH-4</Text>
        </View>
      </View>

      {/* Messages ScrollView */}
      <ScrollView
        ref={scrollRef}
        contentContainerStyle={styles.messagesContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.encryptionNotice}>
          <Icon name="lock" size={12} color={colors.textMuted} style={{ marginRight: 4 }} />
          <Text style={styles.encryptionText}>
            First 15 Days Senior Peer Chat • Safe & Moderated
          </Text>
        </View>

        {chatMessages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <View
              key={msg.id}
              style={[
                styles.messageRow,
                isUser ? styles.messageRowUser : styles.messageRowSenior,
              ]}
            >
              {!isUser && (
                <Avatar name="Rohan Sharma" size="sm" />
              )}

              <View
                style={[
                  styles.bubble,
                  isUser ? styles.bubbleUser : styles.bubbleSenior,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isUser ? styles.messageTextUser : styles.messageTextSenior,
                  ]}
                >
                  {msg.text}
                </Text>
                <Text
                  style={[
                    styles.timestamp,
                    isUser ? styles.timestampUser : styles.timestampSenior,
                  ]}
                >
                  {msg.timestamp}
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Preset Replies Bar */}
      <View style={styles.presetsContainer}>
        <Text style={styles.presetHeading}>Quick Question Starters:</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.presetsScroll}
        >
          {PRESET_CHAT_REPLIES.map((reply, idx) => (
            <TouchableOpacity
              key={idx}
              onPress={() => handleSend(reply)}
              style={styles.presetChip}
              activeOpacity={0.8}
            >
              <Text style={styles.presetChipText}>{reply}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Input Bar */}
      <View style={styles.inputBar}>
        <TextInput
          value={inputText}
          onChangeText={setInputText}
          placeholder={t('chatPlaceholder')}
          placeholderTextColor={colors.textLight}
          style={styles.inputField}
          multiline={false}
          onSubmitEditing={() => handleSend()}
        />

        <TouchableOpacity
          onPress={() => handleSend()}
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          disabled={!inputText.trim()}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Send message"
        >
          <Icon name="send" size={16} color={colors.white} />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    height: 56,
    backgroundColor: colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 6,
    marginRight: 6,
    marginLeft: -4,
  },
  headerInfo: {
    flex: 1,
    marginLeft: 10,
  },
  mentorName: {
    fontSize: typography.fontSizes.sm + 1,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  mentorStatus: {
    fontSize: 11,
    color: colors.success,
    fontFamily: typography.fontFamily,
  },
  hostelTag: {
    backgroundColor: colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: borderRadius.sm,
  },
  hostelTagText: {
    fontSize: 11,
    fontWeight: typography.fontWeights.bold,
    color: colors.secondary,
    fontFamily: typography.fontFamily,
  },
  messagesContainer: {
    padding: spacing.md,
    paddingBottom: spacing.lg,
  },
  encryptionNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  encryptionText: {
    fontSize: 10,
    color: colors.textMuted,
    fontFamily: typography.fontFamily,
  },
  messageRow: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  messageRowSenior: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  bubble: {
    maxWidth: '78%',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  bubbleSenior: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    borderBottomLeftRadius: 4,
    marginLeft: 8,
  },
  bubbleUser: {
    backgroundColor: colors.primary,
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: typography.fontSizes.sm,
    fontFamily: typography.fontFamily,
    lineHeight: 20,
  },
  messageTextSenior: {
    color: colors.textDark,
  },
  messageTextUser: {
    color: colors.white,
  },
  timestamp: {
    fontSize: 9,
    fontFamily: typography.fontFamily,
    marginTop: 4,
    alignSelf: 'flex-end',
  },
  timestampSenior: {
    color: colors.textMuted,
  },
  timestampUser: {
    color: 'rgba(255, 255, 255, 0.75)',
  },
  presetsContainer: {
    backgroundColor: colors.surface,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingTop: 8,
    paddingBottom: 4,
  },
  presetHeading: {
    fontSize: 10,
    fontWeight: typography.fontWeights.bold,
    color: colors.textMuted,
    paddingHorizontal: spacing.md,
    marginBottom: 6,
    fontFamily: typography.fontFamily,
    textTransform: 'uppercase',
  },
  presetsScroll: {
    paddingHorizontal: spacing.md,
    gap: 8,
    paddingBottom: 6,
  },
  presetChip: {
    backgroundColor: '#FFF8E7',
    borderWidth: 1,
    borderColor: '#FFE082',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: borderRadius.pill,
  },
  presetChipText: {
    fontSize: 11,
    color: colors.primaryDark,
    fontFamily: typography.fontFamily,
    fontWeight: typography.fontWeights.medium,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  inputField: {
    flex: 1,
    backgroundColor: colors.surfaceSubtle,
    borderRadius: 22,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: typography.fontSizes.sm,
    color: colors.textDark,
    fontFamily: typography.fontFamily,
    minHeight: 44,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
