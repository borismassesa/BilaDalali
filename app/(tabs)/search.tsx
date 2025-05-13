import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Dimensions,
  Modal,
  ScrollView,
  Platform,
} from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { useLocalSearchParams } from 'expo-router';
import {
  Search as SearchIcon,
  MapPin,
  Filter,
  X,
  List,
  Map as MapIcon,
} from 'lucide-react-native';
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import ListingCard from '@/components/listing/ListingCard';
import AmenityTag from '@/components/listing/AmenityTag';

// Only import MapView when not on web platform
let MapView: any = null;
let Marker: any = null;
let PROVIDER_GOOGLE: any = null;

if (Platform.OS !== 'web') {
  const Maps = require('react-native-maps');
  MapView = Maps.default;
  Marker = Maps.Marker;
  PROVIDER_GOOGLE = Maps.PROVIDER_GOOGLE;
}

// Get screen dimensions for responsive sizing
const { width } = Dimensions.get('window');

// Mock data for listings
const mockListings = [
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
    coordinates: { latitude: -6.7724, longitude: 39.2376 },
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
    coordinates: { latitude: -6.7654, longitude: 39.2536 },
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
    coordinates: { latitude: -6.7354, longitude: 39.2176 },
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
    coordinates: { latitude: -6.7554, longitude: 39.2696 },
  },
  {
    id: '5',
    title: 'Cozy 1 Bedroom Apartment',
    location: 'Kijitonyama, Dar es Salaam',
    price: 250000,
    imageUrl: 'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
    beds: 1,
    baths: 1,
    area: 60,
    propertyType: 'Apartment',
    coordinates: { latitude: -6.7824, longitude: 39.2406 },
  },
];

// Mock data for amenities
const amenities = [
  'WiFi',
  'Water',
  'Electricity',
  'Furnished',
  'Self-Contained',
  'Kitchen',
  'Parking',
  'TV',
];

// Mock data for property types
const propertyTypes = ['House', 'Apartment', 'Room', 'Studio'];

const SearchScreen = () => {
  const { theme } = useTheme();
  const params = useLocalSearchParams();
  const [searchQuery, setSearchQuery] = useState(params.query as string || '');
  const [location, setLocation] = useState(params.location as string || '');
  const [isLoading, setIsLoading] = useState(false);
  const [viewMode, setViewMode] = useState(Platform.OS === 'web' ? 'list' : (params.view as string === 'map' ? 'map' : 'list'));
  const [showFilterModal, setShowFilterModal] = useState(params.filter === 'true');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [filteredListings, setFilteredListings] = useState(mockListings);
  
  // Filter states
  const [priceRange, setPriceRange] = useState({ min: '', max: '' });
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([]);
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([]);
  const [numBeds, setNumBeds] = useState('');
  const [numBaths, setNumBaths] = useState('');

  // Initial map region (centered on Dar es Salaam)
  const [mapRegion, setMapRegion] = useState({
    latitude: -6.7924,
    longitude: 39.2083,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  
  // Apply filters
  const applyFilters = () => {
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      let results = [...mockListings];
      
      // Filter by search query
      if (searchQuery) {
        results = results.filter(listing => 
          listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          listing.location.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      // Filter by location
      if (location) {
        results = results.filter(listing => 
          listing.location.toLowerCase().includes(location.toLowerCase())
        );
      }
      
      // Filter by price range
      if (priceRange.min) {
        results = results.filter(listing => 
          listing.price >= parseInt(priceRange.min)
        );
      }
      
      if (priceRange.max) {
        results = results.filter(listing => 
          listing.price <= parseInt(priceRange.max)
        );
      }
      
      // Filter by property types
      if (selectedPropertyTypes.length > 0) {
        results = results.filter(listing => 
          selectedPropertyTypes.includes(listing.propertyType)
        );
      }
      
      // Filter by number of beds/baths
      if (numBeds) {
        results = results.filter(listing => 
          listing.beds >= parseInt(numBeds)
        );
      }
      
      if (numBaths) {
        results = results.filter(listing => 
          listing.baths >= parseInt(numBaths)
        );
      }
      
      setFilteredListings(results);
      setIsLoading(false);
      setShowFilterModal(false);
    }, 500);
  };
  
  const resetFilters = () => {
    setPriceRange({ min: '', max: '' });
    setSelectedAmenities([]);
    setSelectedPropertyTypes([]);
    setNumBeds('');
    setNumBaths('');
  };
  
  // Toggle favorite status
  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      if (prev.includes(id)) {
        return prev.filter(itemId => itemId !== id);
      } else {
        return [...prev, id];
      }
    });
  };
  
  // Toggle amenity selection
  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities(prev => {
      if (prev.includes(amenity)) {
        return prev.filter(item => item !== amenity);
      } else {
        return [...prev, amenity];
      }
    });
  };
  
  // Toggle property type selection
  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes(prev => {
      if (prev.includes(type)) {
        return prev.filter(item => item !== type);
      } else {
        return [...prev, type];
      }
    });
  };
  
  // Initial search
  useEffect(() => {
    applyFilters();
  }, [searchQuery, location]);

  // Render map or placeholder for web
  const renderMap = () => {
    if (Platform.OS === 'web' || !MapView) {
      return (
        <View style={[styles.mapPlaceholder, { backgroundColor: theme.secondary }]}>
          <Text style={[styles.mapPlaceholderText, { color: theme.text }]}>
            Map view is not available on web.
            Please use the list view or our mobile app for the full map experience.
          </Text>
        </View>
      );
    }

    return (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        region={mapRegion}
      >
        {filteredListings.map((listing) => (
          <Marker
            key={listing.id}
            coordinate={listing.coordinates}
            title={listing.title}
            description={`${listing.propertyType} - ${listing.price} TSh/mo`}
          >
            <View style={[styles.markerContainer, { backgroundColor: theme.primary }]}>
              <Text style={styles.markerPrice}>
                {listing.price >= 1000000
                  ? `${(listing.price / 1000000).toFixed(1)}M`
                  : `${(listing.price / 1000).toFixed(0)}K`}
              </Text>
            </View>
          </Marker>
        ))}
      </MapView>
    );
  };
  
  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.searchBarContainer}>
        <Input
          placeholder="Search by location or keywords"
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon={<SearchIcon size={20} color={theme.textSecondary} />}
          rightIcon={
            searchQuery ? (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={20} color={theme.textSecondary} />
              </TouchableOpacity>
            ) : null
          }
          containerStyle={{ marginBottom: 0, flex: 1 }}
        />
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.primary }]}
          onPress={() => setShowFilterModal(true)}
        >
          <Filter size={20} color="#fff" />
        </TouchableOpacity>
      </View>
      
      {Platform.OS !== 'web' && (
        <View style={styles.viewToggleContainer}>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'list' && {
                backgroundColor: `${theme.primary}15`,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => setViewMode('list')}
          >
            <List
              size={20}
              color={viewMode === 'list' ? theme.primary : theme.textSecondary}
            />
            <Text
              style={[
                styles.viewToggleText,
                {
                  color: viewMode === 'list' ? theme.primary : theme.textSecondary,
                },
              ]}
            >
              List
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.viewToggleButton,
              viewMode === 'map' && {
                backgroundColor: `${theme.primary}15`,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => setViewMode('map')}
          >
            <MapIcon
              size={20}
              color={viewMode === 'map' ? theme.primary : theme.textSecondary}
            />
            <Text
              style={[
                styles.viewToggleText,
                {
                  color: viewMode === 'map' ? theme.primary : theme.textSecondary,
                },
              ]}
            >
              Map
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isLoading ? (
        <ActivityIndicator size="large" color={theme.primary} style={styles.loader} />
      ) : (
        <>
          {viewMode === 'list' ? (
            <FlatList
              data={filteredListings}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <ListingCard
                  {...item}
                  isFavorite={favorites.includes(item.id)}
                  onToggleFavorite={toggleFavorite}
                />
              )}
              contentContainerStyle={styles.listingsContainer}
              ListEmptyComponent={
                <View style={styles.emptyContainer}>
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    No properties found matching your criteria.
                  </Text>
                  <Button
                    title="Reset Filters"
                    variant="outline"
                    onPress={() => {
                      resetFilters();
                      setSearchQuery('');
                      setLocation('');
                      applyFilters();
                    }}
                    style={{ marginTop: 16 }}
                  />
                </View>
              }
            />
          ) : (
            <View style={styles.mapContainer}>
              {renderMap()}
              {filteredListings.length === 0 && (
                <View style={[styles.mapOverlay, { backgroundColor: `${theme.background}cc` }]}>
                  <Text style={[styles.overlayText, { color: theme.text }]}>
                    No properties found in this area
                  </Text>
                  <Button
                    title="Reset Filters"
                    variant="outline"
                    onPress={() => {
                      resetFilters();
                      setSearchQuery('');
                      setLocation('');
                      applyFilters();
                    }}
                    style={{ marginTop: 16 }}
                  />
                </View>
              )}
            </View>
          )}
        </>
      )}
      
      {/* Filter Modal */}
      <Modal
        visible={showFilterModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowFilterModal(false)}
      >
        <View style={styles.modalContainer}>
          <View
            style={[styles.modalContent, { backgroundColor: theme.background }]}
          >
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: theme.text }]}>
                Search Filters
              </Text>
              <TouchableOpacity
                onPress={() => setShowFilterModal(false)}
                style={styles.closeButton}
              >
                <X size={24} color={theme.text} />
              </TouchableOpacity>
            </View>
            
            <ScrollView style={styles.filtersScrollView}>
              {/* Price Range */}
              <Text style={[styles.filterTitle, { color: theme.text }]}>
                Price Range (TSh)
              </Text>
              <View style={styles.priceInputsContainer}>
                <Input
                  placeholder="Min"
                  value={priceRange.min}
                  onChangeText={(text) => setPriceRange({ ...priceRange, min: text })}
                  keyboardType="numeric"
                  containerStyle={{ flex: 1, marginRight: 8 }}
                />
                <Input
                  placeholder="Max"
                  value={priceRange.max}
                  onChangeText={(text) => setPriceRange({ ...priceRange, max: text })}
                  keyboardType="numeric"
                  containerStyle={{ flex: 1 }}
                />
              </View>
              
              {/* Property Type */}
              <Text style={[styles.filterTitle, { color: theme.text }]}>
                Property Type
              </Text>
              <View style={styles.propertyTypesContainer}>
                {propertyTypes.map((type, index) => (
                  <TouchableOpacity
                    key={`type-${index}`}
                    style={[
                      styles.typeButton,
                      {
                        backgroundColor: selectedPropertyTypes.includes(type)
                          ? `${theme.primary}15`
                          : theme.secondary,
                        borderColor: selectedPropertyTypes.includes(type)
                          ? theme.primary
                          : theme.border,
                      },
                    ]}
                    onPress={() => togglePropertyType(type)}
                  >
                    <Text
                      style={[
                        styles.typeText,
                        {
                          color: selectedPropertyTypes.includes(type)
                            ? theme.primary
                            : theme.text,
                        },
                      ]}
                    >
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              
              {/* Beds & Baths */}
              <Text style={[styles.filterTitle, { color: theme.text }]}>
                Beds & Baths
              </Text>
              <View style={styles.priceInputsContainer}>
                <Input
                  placeholder="Min Beds"
                  value={numBeds}
                  onChangeText={setNumBeds}
                  keyboardType="numeric"
                  containerStyle={{ flex: 1, marginRight: 8 }}
                />
                <Input
                  placeholder="Min Baths"
                  value={numBaths}
                  onChangeText={setNumBaths}
                  keyboardType="numeric"
                  containerStyle={{ flex: 1 }}
                />
              </View>
              
              {/* Amenities */}
              <Text style={[styles.filterTitle, { color: theme.text }]}>
                Amenities
              </Text>
              <View style={styles.amenitiesContainer}>
                {amenities.map((amenity, index) => (
                  <TouchableOpacity
                    key={`amenity-${index}`}
                    onPress={() => toggleAmenity(amenity)}
                  >
                    <AmenityTag
                      name={amenity}
                      active={selectedAmenities.includes(amenity)}
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
            
            <View style={styles.filterButtons}>
              <Button
                title="Reset"
                variant="outline"
                onPress={resetFilters}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Apply Filters"
                onPress={applyFilters}
                style={{ flex: 2 }}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchBarContainer: {
    flexDirection: 'row',
    padding: 16,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 8,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewToggleContainer: {
    flexDirection: 'row',
    padding: 16,
    paddingTop: 0,
  },
  viewToggleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 12,
  },
  viewToggleText: {
    marginLeft: 4,
    fontSize: 14,
    fontFamily: 'Lato-Bold',
  },
  listingsContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
  },
  mapContainer: {
    flex: 1,
    position: 'relative',
  },
  map: {
    width: '100%',
    height: '100%',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  mapPlaceholderText: {
    fontSize: 16,
    fontFamily: 'Lato-Regular',
    textAlign: 'center',
    lineHeight: 24,
  },
  markerContainer: {
    padding: 8,
    borderRadius: 20,
    alignItems: 'center',
  },
  markerPrice: {
    color: 'white',
    fontFamily: 'Lato-Bold',
    fontSize: 12,
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: 'Lato-Bold',
  },
  closeButton: {
    padding: 4,
  },
  filtersScrollView: {
    marginBottom: 16,
  },
  filterTitle: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    marginTop: 16,
    marginBottom: 8,
  },
  priceInputsContainer: {
    flexDirection: 'row',
  },
  propertyTypesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  typeButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
  },
  typeText: {
    fontFamily: 'Lato-Regular',
    fontSize: 14,
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  filterButtons: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
  },
  mapOverlay: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -150 }, { translateY: -50 }],
    width: 300,
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  overlayText: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    textAlign: 'center',
  },
});

export default SearchScreen;