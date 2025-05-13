import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import ListingCard from '@/components/listing/ListingCard';
import { Heart, X } from 'lucide-react-native';

// Mock data for favorites
const mockFavorites = [
  {
    id: '1',
    title: 'Spacious 2 Bedroom Apartment',
    location: 'Kinondoni, Dar es Salaam',
    price: 450000,
    imageUrl: 'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    beds: 2,
    baths: 1,
    area: 85,
    propertyType: 'Apartment',
  },
  {
    id: '3',
    title: 'Furnished 3 Bedroom House',
    location: 'Mbezi Beach, Dar es Salaam',
    price: 750000,
    imageUrl: 'https://images.pexels.com/photos/1396122/pexels-photo-1396122.jpeg',
    beds: 3,
    baths: 2,
    area: 120,
    propertyType: 'House',
  },
];

const FavoritesScreen = () => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const [favorites, setFavorites] = useState(mockFavorites);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading favorites
  useEffect(() => {
    // This would normally be a Firestore call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Remove from favorites
  const removeFavorite = (id: string) => {
    setFavorites(prev => prev.filter(item => item.id !== id));
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
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.text }]}>Your Favorites</Text>
        {favorites.length > 0 && (
          <Text style={[styles.count, { color: theme.textSecondary }]}>
            {favorites.length} {favorites.length === 1 ? 'property' : 'properties'}
          </Text>
        )}
      </View>

      {favorites.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Heart size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Favorites Yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            Properties you favorite will appear here for easy access.
          </Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.favoriteItemContainer}>
              <ListingCard {...item} isFavorite={true} onToggleFavorite={removeFavorite} />
              <TouchableOpacity
                style={[styles.removeButton, { backgroundColor: `${theme.error}15` }]}
                onPress={() => removeFavorite(item.id)}
              >
                <X size={20} color={theme.error} />
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
  },
  count: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
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
  },
  listContainer: {
    padding: 16,
  },
  favoriteItemContainer: {
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});

export default FavoritesScreen;