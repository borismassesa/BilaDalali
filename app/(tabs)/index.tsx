import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowUpRight, Filter, Map, MapPin } from 'lucide-react-native';
import ListingCard from '@/components/listing/ListingCard';
import Input from '@/components/common/Input';
import AmenityTag from '@/components/listing/AmenityTag';
import { supabase } from '@/services/supabase';

// Mock data for amenities
const popularAmenities = [
  'WiFi',
  'Water',
  'Electricity',
  'Furnished',
  'Self-Contained',
  'Kitchen',
];

// Mock data for popular areas
const popularAreas = [
  { name: 'Kinondoni', count: 124 },
  { name: 'Mikocheni', count: 86 },
  { name: 'Mbezi Beach', count: 78 },
  { name: 'Msasani', count: 65 },
  { name: 'Kijitonyama', count: 59 },
];

const HomeScreen = () => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [recentListings, setRecentListings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [favorites, setFavorites] = useState<string[]>([]);

  // Fetch recent listings from Supabase
  const fetchRecentListings = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('status', 'active')
        .order('created_at', { ascending: false })
        .limit(10);

      if (error) throw error;
      setRecentListings(data || []);
    } catch (error) {
      console.error('Error fetching listings:', error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  // Mock data for recent listings
  const mockRecentListings = [
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
      id: '2',
      title: 'Modern Single Room, Self-Contained',
      location: 'Mikocheni B, Dar es Salaam',
      price: 150000,
      imageUrl: 'https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg',
      beds: 1,
      baths: 1,
      propertyType: 'Room',
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
    {
      id: '4',
      title: 'Executive Studio Apartment',
      location: 'Msasani, Dar es Salaam',
      price: 350000,
      imageUrl: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
      beds: 1,
      baths: 1,
      area: 45,
      propertyType: 'Apartment',
    },
  ];

  useEffect(() => {
    // For now, use mock data
    setRecentListings(mockRecentListings);
    setIsLoading(false);
    
    // In a real app, you'd fetch from Supabase
    // fetchRecentListings();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    // fetchRecentListings();
    // For now, simulate refresh with mock data
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleSearch = () => {
    router.push({
      pathname: '/search',
      params: { query: searchQuery },
    });
  };

  const toggleFavorite = async (id: string) => {
    if (!userData) return;

    try {
      if (favorites.includes(id)) {
        // Remove from favorites
        await supabase
          .from('favorites')
          .delete()
          .eq('user_id', userData.id)
          .eq('listing_id', id);
        
        setFavorites(prev => prev.filter(itemId => itemId !== id));
      } else {
        // Add to favorites
        await supabase
          .from('favorites')
          .insert({
            user_id: userData.id,
            listing_id: id,
          });
        
        setFavorites(prev => [...prev, id]);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  // Navigate to a specific area search
  const navigateToAreaSearch = (area: string) => {
    router.push({
      pathname: '/search',
      params: { location: area },
    });
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: theme.background }]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
      }
    >
      <View style={styles.header}>
        <View style={styles.headerTextContainer}>
          <Text style={[styles.greeting, { color: theme.text }]}>
            Hello, {userData?.display_name?.split(' ')[0] || 'there'}
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Find your perfect home in Tanzania
          </Text>
        </View>
        <Image
          source={{ 
            uri: userData?.photo_url || 'https://images.pexels.com/photos/1081685/pexels-photo-1081685.jpeg' 
          }}
          style={styles.profileImage}
        />
      </View>

      <View style={styles.searchContainer}>
        <Input
          placeholder="Search for location or property"
          value={searchQuery}
          onChangeText={setSearchQuery}
          onSubmitEditing={handleSearch}
          leftIcon={<Search size={20} color={theme.textSecondary} />}
          containerStyle={{ marginBottom: 0 }}
        />
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.primary }]}
          onPress={() => router.push('/search?filter=true')}
        >
          <Filter size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.amenitiesContainer}>
        <Text style={[styles.sectionTitle, { color: theme.text }]}>
          Popular Amenities
        </Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.amenitiesScrollView}
        >
          {popularAmenities.map((amenity, index) => (
            <AmenityTag key={`amenity-${index}`} name={amenity} />
          ))}
        </ScrollView>
      </View>

      <View style={styles.areasContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Popular Areas
          </Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/search?view=map')}
          >
            <Text style={[styles.viewAllText, { color: theme.primary }]}>View Map</Text>
            <Map size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.areasScrollView}
        >
          {popularAreas.map((area, index) => (
            <TouchableOpacity
              key={`area-${index}`}
              style={[
                styles.areaCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
              onPress={() => navigateToAreaSearch(area.name)}
            >
              <MapPin size={16} color={theme.primary} />
              <Text style={[styles.areaName, { color: theme.text }]}>
                {area.name}
              </Text>
              <Text style={[styles.areaCount, { color: theme.textSecondary }]}>
                {area.count} listings
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.recentListingsContainer}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Recent Listings
          </Text>
          <TouchableOpacity
            style={styles.viewAllButton}
            onPress={() => router.push('/search')}
          >
            <Text style={[styles.viewAllText, { color: theme.primary }]}>
              View All
            </Text>
            <ArrowUpRight size={16} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
        ) : (
          <FlatList
            data={recentListings}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <ListingCard
                {...item}
                isFavorite={favorites.includes(item.id)}
                onToggleFavorite={toggleFavorite}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.listingsScrollView}
            snapToInterval={320}
            decelerationRate="fast"
          />
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTextContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  profileImage: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  searchContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  amenitiesContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    marginBottom: 12,
  },
  amenitiesScrollView: {
    flexDirection: 'row',
    paddingRight: 16,
  },
  areasContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    marginRight: 4,
  },
  areasScrollView: {
    paddingHorizontal: 16,
  },
  areaCard: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    marginRight: 12,
    alignItems: 'center',
    width: 120,
  },
  areaName: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  areaCount: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  recentListingsContainer: {
    marginBottom: 32,
  },
  listingsScrollView: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  loader: {
    marginVertical: 20,
  },
});

export default HomeScreen;