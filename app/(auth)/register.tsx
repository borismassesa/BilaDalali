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
} from 'react-native';
import { router, Link } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import { Mail, Lock, User, Check, ArrowRight } from 'lucide-react-native';
import { isValidEmail, isValidPassword, getPasswordStrength } from '@/utils/validation';
import { UserRole } from '@/contexts/AuthContext';

const RegisterScreen = () => {
  const { theme } = useTheme();
  const { register, error, isLoading } = useAuth();
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('tenant');
  const [formErrors, setFormErrors] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  // Calculate password strength
  const passwordStrength = getPasswordStrength(password);
  const getStrengthLabel = () => {
    if (!password) return '';
    switch (passwordStrength) {
      case 0: return 'Very weak';
      case 1: return 'Weak';
      case 2: return 'Medium';
      case 3: return 'Strong';
      case 4: return 'Very strong';
      default: return '';
    }
  };
  
  const getStrengthColor = () => {
    if (!password) return theme.border;
    switch (passwordStrength) {
      case 0: return theme.error;
      case 1: return theme.warning;
      case 2: return theme.warning;
      case 3: return theme.success;
      case 4: return theme.success;
      default: return theme.border;
    }
  };

  // Validate form fields
  const validateForm = () => {
    const errors = {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    };
    
    if (!name) {
      errors.name = 'Name is required';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!isValidEmail(email)) {
      errors.email = 'Invalid email address';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (!isValidPassword(password)) {
      errors.password = 'Password must be at least 8 characters with numbers and letters';
    }
    
    if (!confirmPassword) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return !errors.name && !errors.email && !errors.password && !errors.confirmPassword;
  };

  // Handle registration
  const handleRegister = async () => {
    if (validateForm()) {
      await register(email, password, role, name);
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
            Create an account to get started
          </Text>
        </View>
        
        <View style={styles.formContainer}>
          <Text style={[styles.formTitle, { color: theme.text }]}>Register</Text>
          
          {error && (
            <View style={[styles.errorContainer, { backgroundColor: `${theme.error}20` }]}>
              <Text style={[styles.errorText, { color: theme.error }]}>{error}</Text>
            </View>
          )}
          
          <Input
            label="Full Name"
            placeholder="Enter your full name"
            value={name}
            onChangeText={setName}
            leftIcon={<User size={20} color={theme.textSecondary} />}
            error={formErrors.name}
          />
          
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
            placeholder="Create a password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={theme.textSecondary} />}
            error={formErrors.password}
          />
          
          {password && (
            <View style={styles.passwordStrengthContainer}>
              <View style={styles.strengthBars}>
                {[0, 1, 2, 3].map((index) => (
                  <View
                    key={`strength-${index}`}
                    style={[
                      styles.strengthBar,
                      {
                        backgroundColor:
                          passwordStrength > index ? getStrengthColor() : theme.border,
                      },
                    ]}
                  />
                ))}
              </View>
              <Text
                style={[styles.strengthText, { color: getStrengthColor() }]}
              >
                {getStrengthLabel()}
              </Text>
            </View>
          )}
          
          <Input
            label="Confirm Password"
            placeholder="Confirm your password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            leftIcon={<Lock size={20} color={theme.textSecondary} />}
            error={formErrors.confirmPassword}
          />
          
          <Text style={[styles.roleLabel, { color: theme.text }]}>
            I am a:
          </Text>
          
          <View style={styles.roleContainer}>
            <TouchableOpacity
              style={[
                styles.roleOption,
                {
                  backgroundColor:
                    role === 'tenant' ? `${theme.primary}15` : theme.secondary,
                  borderColor: role === 'tenant' ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setRole('tenant')}
            >
              {role === 'tenant' && (
                <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                  <Check size={12} color="#fff" />
                </View>
              )}
              <Text
                style={[
                  styles.roleText,
                  { color: role === 'tenant' ? theme.primary : theme.text },
                ]}
              >
                Tenant
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={[
                styles.roleOption,
                {
                  backgroundColor:
                    role === 'landlord' ? `${theme.primary}15` : theme.secondary,
                  borderColor: role === 'landlord' ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setRole('landlord')}
            >
              {role === 'landlord' && (
                <View style={[styles.checkCircle, { backgroundColor: theme.primary }]}>
                  <Check size={12} color="#fff" />
                </View>
              )}
              <Text
                style={[
                  styles.roleText,
                  { color: role === 'landlord' ? theme.primary : theme.text },
                ]}
              >
                Landlord
              </Text>
            </TouchableOpacity>
          </View>
          
          <Button
            title="Create Account"
            onPress={handleRegister}
            isLoading={isLoading}
            rightIcon={<ArrowRight size={18} color="#fff" />}
            style={styles.registerButton}
          />
          
          <View style={styles.loginContainer}>
            <Text style={[styles.loginText, { color: theme.textSecondary }]}>
              Already have an account?
            </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text style={[styles.loginLink, { color: theme.primary }]}>
                  Log In
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
    marginBottom: 32,
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
  passwordStrengthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  strengthBars: {
    flexDirection: 'row',
    marginRight: 12,
  },
  strengthBar: {
    width: 20,
    height: 4,
    marginRight: 4,
    borderRadius: 2,
  },
  strengthText: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  roleLabel: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    marginBottom: 12,
  },
  roleContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 8,
  },
  checkCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
  },
  roleText: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
  },
  registerButton: {
    marginBottom: 24,
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  loginLink: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    marginLeft: 4,
  },
});

export default RegisterScreen;