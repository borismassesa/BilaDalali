import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacityProps,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'small' | 'medium' | 'large';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

const Button = ({
  title,
  variant = 'primary',
  size = 'medium',
  isLoading = false,
  leftIcon,
  rightIcon,
  style,
  textStyle,
  disabled,
  ...rest
}: ButtonProps) => {
  const { theme } = useTheme();

  // Define container styles based on variant
  const getContainerStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          borderColor: theme.secondary,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderColor: theme.primary,
          borderWidth: 1,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderColor: 'transparent',
        };
      default:
        return {
          backgroundColor: theme.primary,
          borderColor: theme.primary,
        };
    }
  };

  // Define text styles based on variant
  const getTextStyle = () => {
    switch (variant) {
      case 'primary':
        return {
          color: '#FFFFFF',
        };
      case 'secondary':
        return {
          color: theme.text,
        };
      case 'outline':
      case 'ghost':
        return {
          color: theme.primary,
        };
      default:
        return {
          color: '#FFFFFF',
        };
    }
  };

  // Define sizes for the button
  const getSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          paddingVertical: 8,
          paddingHorizontal: 16,
          borderRadius: 4,
        };
      case 'medium':
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 6,
        };
      case 'large':
        return {
          paddingVertical: 16,
          paddingHorizontal: 24,
          borderRadius: 8,
        };
      default:
        return {
          paddingVertical: 12,
          paddingHorizontal: 20,
          borderRadius: 6,
        };
    }
  };

  // Get text size based on button size
  const getTextSizeStyle = () => {
    switch (size) {
      case 'small':
        return {
          fontSize: 12,
        };
      case 'medium':
        return {
          fontSize: 14,
        };
      case 'large':
        return {
          fontSize: 16,
        };
      default:
        return {
          fontSize: 14,
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getContainerStyle(),
        getSizeStyle(),
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || isLoading}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? '#FFFFFF' : theme.primary}
          size="small"
        />
      ) : (
        <>
          {leftIcon && <>{leftIcon}</>}
          <Text
            style={[
              styles.text,
              getTextStyle(),
              getTextSizeStyle(),
              leftIcon && { marginLeft: 8 },
              rightIcon && { marginRight: 8 },
              textStyle,
            ]}
          >
            {title}
          </Text>
          {rightIcon && <>{rightIcon}</>}
        </>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  text: {
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
  },
  disabled: {
    opacity: 0.7,
  },
});

export default Button;