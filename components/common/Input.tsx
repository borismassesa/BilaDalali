import React, { useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
  TextStyle,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Eye, EyeOff } from 'lucide-react-native';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  containerStyle?: ViewStyle;
  labelStyle?: TextStyle;
  inputStyle?: TextStyle;
  errorStyle?: TextStyle;
  optional?: boolean;
}

const Input = ({
  label,
  error,
  leftIcon,
  rightIcon,
  containerStyle,
  labelStyle,
  inputStyle,
  errorStyle,
  secureTextEntry,
  optional = false,
  ...rest
}: InputProps) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Handle password visibility toggle
  const handlePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  // Determine if it's a password field
  const isPassword = secureTextEntry !== undefined;
  
  // Toggle rightIcon for password fields
  const passwordIcon = isPasswordVisible ? (
    <EyeOff size={20} color={theme.textSecondary} />
  ) : (
    <Eye size={20} color={theme.textSecondary} />
  );

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelContainer}>
          <Text style={[styles.label, { color: theme.text }, labelStyle]}>
            {label}
          </Text>
          {optional && (
            <Text
              style={[styles.optional, { color: theme.textSecondary }]}
            >
              (Optional)
            </Text>
          )}
        </View>
      )}
      <View
        style={[
          styles.inputContainer,
          {
            borderColor: error
              ? theme.error
              : isFocused
              ? theme.primary
              : theme.border,
            backgroundColor: theme.background,
          },
        ]}
      >
        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
        <TextInput
          style={[
            styles.input,
            { color: theme.text },
            leftIcon && { paddingLeft: 8 },
            (rightIcon || isPassword) && { paddingRight: 8 },
            inputStyle,
          ]}
          placeholderTextColor={theme.textSecondary}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          secureTextEntry={isPassword && !isPasswordVisible}
          {...rest}
        />
        {isPassword ? (
          <TouchableOpacity
            style={styles.rightIcon}
            onPress={handlePasswordVisibility}
          >
            {passwordIcon}
          </TouchableOpacity>
        ) : (
          rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>
        )}
      </View>
      {error && (
        <Text
          style={[styles.error, { color: theme.error }, errorStyle]}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
  },
  optional: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Lato-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: 8,
    overflow: 'hidden',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  leftIcon: {
    paddingLeft: 16,
  },
  rightIcon: {
    paddingRight: 16,
  },
  error: {
    fontSize: 12,
    marginTop: 4,
    fontFamily: 'Lato-Regular',
  },
});

export default Input;