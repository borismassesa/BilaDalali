import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { Heart, MapPin, Hotel, BathShower, Grid, Home, Star } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { formatCurrency } from '@/utils/formatting';

// Get screen width for responsive sizing
const { width } = Dimensions.get('window');

export interface ListingCardProps {
  id: string;
  title: string;
  location: string;
  price: number;
  imageUrl: string;
  beds?: number;
  baths?: number;
  area?: number;
  propertyType: string;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string) => void;
}

const ListingCard = ({
  id,
  title,
  location,
  price,
  imageUrl,
  beds,
  baths,
  area,
  propertyType,
  isFavorite = false,
  onToggleFavorite,
}: ListingCardProps) => {
  const { theme } = useTheme();

  const handlePress = () => {
    router.push(`/listings/${id}`);
  };

  const handleFavoritePress = () => {
    if (onToggleFavorite) {
      onToggleFavorite(id);
    }
  };

  // Determine property icon based on type
  const getPropertyIcon = () => {
    switch (propertyType.toLowerCase()) {
      case 'house':
        return <Home size={14} color={theme.textSecondary} />;
      case 'apartment':
        return <Grid size={14} color={theme.textSecondary} />;
      case 'room':
        return <Hotel size={14} color={theme.textSecondary} />;
      default:
        return <Home size={14} color={theme.textSecondary} />;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: theme.card }]}
      onPress={handlePress}
      activeOpacity={0.9}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="cover"
        />
        <TouchableOpacity
          style={[styles.favoriteButton, { backgroundColor: theme.background }]}
          onPress={handleFavoritePress}
        >
          <Heart
            size={18}
            color={isFavorite ? theme.accent : theme.textSecondary}
            fill={isFavorite ? theme.accent : 'transparent'}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.contentContainer}>
        <View style={styles.priceRow}>
          <Text style={[styles.price, { color: theme.primary }]}>
            {formatCurrency(price)}/mo
          </Text>
          <View style={styles.propertyTypeContainer}>
            {getPropertyIcon()}
            <Text style={[styles.propertyType, { color: theme.textSecondary }]}>
              {propertyType}
            </Text>
          </View>
        </View>
        <Text
          style={[styles.title, { color: theme.text }]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title}
        </Text>
        <View style={styles.locationContainer}>
          <MapPin size={14} color={theme.textSecondary} />
          <Text
            style={[styles.location, { color: theme.textSecondary }]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {location}
          </Text>
        </View>
        {(beds !== undefined || baths !== undefined || area !== undefined) && (
          <View style={styles.featuresContainer}>
            {beds !== undefined && (
              <View style={styles.feature}>
                <Hotel size={14} color={theme.textSecondary} />
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  {beds} {beds === 1 ? 'Bed' : 'Beds'}
                </Text>
              </View>
            )}
            {baths !== undefined && (
              <View style={styles.feature}>
                <BathShower size={14} color={theme.textSecondary} />
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  {baths} {baths === 1 ? 'Bath' : 'Baths'}
                </Text>
              </View>
            )}
            {area !== undefined && (
              <View style={styles.feature}>
                <Grid size={14} color={theme.textSecondary} />
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  {area} m²
                </Text>
              </View>
            )}
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    width: width - 32, // Responsive width
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  imageContainer: {
    position: 'relative',
    height: 180,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  favoriteButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  contentContainer: {
    padding: 16,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  price: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  propertyTypeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  propertyType: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Lato-Regular',
  },
  title: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    marginBottom: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  location: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Lato-Regular',
  },
  featuresContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 12,
  },
  featureText: {
    fontSize: 12,
    marginLeft: 4,
    fontFamily: 'Lato-Regular',
  },
});

export default ListingCard;