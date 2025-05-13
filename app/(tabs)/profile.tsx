import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Button from '@/components/common/Button';
import { User, LogOut, Moon, ChevronRight, Bell, MessageCircle, CircleHelp as HelpCircle, Shield } from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '@/services/supabase';
import { decode } from 'base64-arraybuffer';

const ProfileScreen = () => {
  const { theme, isDark, toggleTheme } = useTheme();
  const { userData, logout, isLoading, updateUserProfile } = useAuth();
  const [uploading, setUploading] = useState(false);

  // Pick image from library
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });
      
      if (!result.canceled && result.assets && result.assets[0].base64) {
        await uploadProfileImage(result.assets[0].base64);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to pick image. Please try again.');
    }
  };

  // Upload image to Supabase Storage
  const uploadProfileImage = async (base64Image: string) => {
    if (!userData) return;
    
    try {
      setUploading(true);
      
      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(base64Image);
      
      // Upload to Supabase Storage
      const { data: storageData, error: storageError } = await supabase.storage
        .from('profile-images')
        .upload(`${userData.id}.jpg`, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true,
        });

      if (storageError) throw storageError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('profile-images')
        .getPublicUrl(`${userData.id}.jpg`);
      
      // Update user profile with new image URL
      await updateUserProfile({ photo_url: publicUrl });
      
      Alert.alert('Success', 'Profile picture updated successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('Error', 'Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // Handle logout
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          onPress: logout,
          style: 'destructive',
        },
      ],
      { cancelable: true }
    );
  };

  if (isLoading) {
    return (
      <View style={[styles.loadingContainer, { backgroundColor: theme.background }]}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.profileHeader}>
        <View style={styles.profileImageContainer}>
          {uploading ? (
            <View style={[styles.profileImage, { backgroundColor: theme.secondary }]}>
              <ActivityIndicator size="small" color={theme.primary} />
            </View>
          ) : (
            <Image
              source={{
                uri: userData?.photo_url || 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg',
              }}
              style={styles.profileImage}
            />
          )}
          <TouchableOpacity
            style={[styles.editButton, { backgroundColor: theme.primary }]}
            onPress={pickImage}
          >
            <User size={16} color="#fff" />
          </TouchableOpacity>
        </View>
        <Text style={[styles.userName, { color: theme.text }]}>
          {userData?.display_name || 'User'}
        </Text>
        <Text style={[styles.userRole, { color: theme.textSecondary }]}>
          {userData?.role === 'landlord' ? 'Landlord' : 'Tenant'}
        </Text>
        <Button
          title="Edit Profile"
          variant="outline"
          onPress={() => {}}
          style={styles.editProfileButton}
        />
      </View>
      
      <View style={[styles.section, { borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Account Settings
        </Text>
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: theme.border }]}
          onPress={() => {}}
        >
          <View style={styles.settingLeftContent}>
            <User size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Personal Information
            </Text>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: theme.border }]}
          onPress={() => {}}
        >
          <View style={styles.settingLeftContent}>
            <Bell size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Notifications
            </Text>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: theme.border }]}
          onPress={() => {}}
        >
          <View style={styles.settingLeftContent}>
            <Shield size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Privacy & Security
            </Text>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <View style={[styles.section, { borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Preferences
        </Text>
        <View
          style={[styles.settingItem, { borderColor: theme.border }]}
        >
          <View style={styles.settingLeftContent}>
            <Moon size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Dark Mode
            </Text>
          </View>
          <Switch
            trackColor={{ false: theme.border, true: `${theme.primary}80` }}
            thumbColor={isDark ? theme.primary : '#f4f3f4'}
            onValueChange={toggleTheme}
            value={isDark}
          />
        </View>
      </View>
      
      <View style={[styles.section, { borderColor: theme.border }]}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Support
        </Text>
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: theme.border }]}
          onPress={() => {}}
        >
          <View style={styles.settingLeftContent}>
            <HelpCircle size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Help Center
            </Text>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.settingItem, { borderColor: theme.border }]}
          onPress={() => {}}
        >
          <View style={styles.settingLeftContent}>
            <MessageCircle size={20} color={theme.primary} />
            <Text style={[styles.settingText, { color: theme.text }]}>
              Contact Support
            </Text>
          </View>
          <ChevronRight size={20} color={theme.textSecondary} />
        </TouchableOpacity>
      </View>
      
      <Button
        title="Logout"
        variant="outline"
        onPress={handleLogout}
        leftIcon={<LogOut size={20} color={theme.error} />}
        style={[styles.logoutButton, { borderColor: theme.error }]}
        textStyle={{ color: theme.error }}
      />
      
      <Text style={[styles.versionText, { color: theme.textSecondary }]}>
        Version 1.0.0
      </Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  profileImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    marginBottom: 4,
  },
  userRole: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    marginBottom: 16,
  },
  editProfileButton: {
    marginBottom: 8,
  },
  section: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLeftContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingText: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    marginLeft: 12,
  },
  logoutButton: {
    margin: 16,
  },
  versionText: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default ProfileScreen;