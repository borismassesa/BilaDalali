import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { Wifi, WaterDroplet, Lightbulb, BedDouble, Shower, CookingPot, Car, Tv } from 'lucide-react-native';

export interface AmenityTagProps {
  name: string;
  active?: boolean;
}

const AmenityTag = ({ name, active = true }: AmenityTagProps) => {
  const { theme } = useTheme();
  
  // Get icon based on amenity type
  const getIcon = () => {
    const iconSize = 16;
    const iconColor = active ? theme.text : theme.textSecondary;
    
    switch (name.toLowerCase()) {
      case 'wifi':
        return <Wifi size={iconSize} color={iconColor} />;
      case 'water':
        return <WaterDroplet size={iconSize} color={iconColor} />;
      case 'electricity':
        return <Lightbulb size={iconSize} color={iconColor} />;
      case 'furnished':
        return <BedDouble size={iconSize} color={iconColor} />;
      case 'self-contained':
        return <Shower size={iconSize} color={iconColor} />;
      case 'kitchen':
        return <CookingPot size={iconSize} color={iconColor} />;
      case 'parking':
        return <Car size={iconSize} color={iconColor} />;
      case 'tv':
        return <Tv size={iconSize} color={iconColor} />;
      default:
        return <Wifi size={iconSize} color={iconColor} />;
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: active ? `${theme.primary}15` : theme.secondary,
          borderColor: active ? theme.primary : theme.border,
        },
      ]}
    >
      {getIcon()}
      <Text
        style={[
          styles.text,
          {
            color: active ? theme.text : theme.textSecondary,
            marginLeft: 4,
          },
        ]}
      >
        {name}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  text: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
});

export default AmenityTag;