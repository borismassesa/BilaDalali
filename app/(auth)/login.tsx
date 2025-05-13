import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Image,
  ActivityIndicator,
} from 'react-native';
import { router, Link } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Mail, Lock, ArrowRight } from 'lucide-react-native';
import { isValidEmail, isValidPassword } from '@/utils/validation';

const LoginScreen = () => {
  const { theme } = useTheme();
  const { login, error, isLoading } = useAuth();
  
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formErrors, setFormErrors] = useState({
    email: '',
    password: '',
  });

  // Validate form fields
  const validateForm = () => {
    const errors = {
      email: '',
      password: '',
    };
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return !errors.email && !errors.password;
  };

  // Handle login
  const handleLogin = async () => {
    if (validateForm()) {
      await login(email, password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: theme.background }]}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 64 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Image
            source={{ uri: 'https://images.pexels.com/photos/2102587/pexels-photo-2102587.jpeg' }}
            style={styles.logo}
          />
          <Text style={[styles.title, { color: theme.text }]}>Pango Nyumba</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Find your next home without middlemen
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.formTitle, { color: theme.text }]}>Log In</Text>
          
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: `${theme.error}20` }]}>
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            </View>
          )}
          
          <Input
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            leftIcon={<Mail size={20} color={theme.textSecondary} />}
            error={formErrors.email}
          />
          
          <Input
            label="Password"
            placeholder="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={theme.textSecondary} />}
            error={formErrors.password}
          />
          
          <TouchableOpacity 
            onPress={() => router.push('/(auth)/reset-password')}
            style={styles.forgotPassword}
          >
            <Text style={[styles.forgotPasswordText, { color: theme.primary }]}>
              Forgot Password?
            </Text>
          </TouchableOpacity>
          
          <Button
            title="Log In"
            onPress={handleLogin}
            isLoading={isLoading}
            rightIcon={<ArrowRight size={18} color="#fff" />}
            style={styles.loginButton}
          />
          
          <View style={styles.divider}>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OR</Text>
            <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
          </View>
          
          <Button
            title="Continue with Google"
            variant="outline"
            onPress={() => {}}
            leftIcon={
              <Image
                source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                style={styles.googleIcon}
              />
            }
            style={styles.googleButton}
          />
          
          <View style={styles.registerContainer}>
            <Text style={[styles.registerText, { color: theme.textSecondary }]}>
              Don't have an account?
            </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text style={[styles.registerLink, { color: theme.primary }]}>
                  Register
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontFamily: 'Lato-Bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    fontFamily: 'Lato-Regular',
  },
  formContainer: {
    width: '100%',
  },
  formTitle: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    marginBottom: 24,
  },
  errorContainer: {
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
  forgotPasswordText: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  loginButton: {
    marginBottom: 24,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    marginHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  googleButton: {
    marginBottom: 24,
  },
  googleIcon: {
    width: 20,
    height: 20,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  registerLink: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    marginLeft: 4,
  },
});

export default LoginScreen;