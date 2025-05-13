import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import { Plus, Edit, ListPlus, ListFilter } from 'lucide-react-native';
import Button from '@/components/common/Button';
import ListingCard from '@/components/listing/ListingCard';

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
    status: 'active',
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
    status: 'active',
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
    status: 'inactive',
  },
];

// Filter options
const filterOptions = [
  { id: 'all', label: 'All' },
  { id: 'active', label: 'Active' },
  { id: 'inactive', label: 'Inactive' },
];

const ListingsScreen = () => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const [listings, setListings] = useState(mockListings);
  const [isLoading, setIsLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');

  // Simulate loading listings
  useEffect(() => {
    // This would normally be a Firestore call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  }, []);

  // Filter listings based on status
  const filteredListings = 
    activeFilter === 'all'
      ? listings
      : listings.filter(listing => listing.status === activeFilter);

  // Navigate to add listing screen
  const navigateToAddListing = () => {
    router.push('/listings/add');
  };

  // Navigate to edit listing screen
  const navigateToEditListing = (id: string) => {
    router.push(`/listings/edit/${id}`);
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
        <View>
          <Text style={[styles.title, { color: theme.text }]}>My Listings</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Manage your properties
          </Text>
        </View>
        <Button
          title="Add New"
          size="small"
          leftIcon={<Plus size={16} color="#fff" />}
          onPress={navigateToAddListing}
        />
      </View>

      <View style={[styles.filterContainer, { borderColor: theme.border }]}>
        <ListFilter size={20} color={theme.primary} />
        <Text style={[styles.filterText, { color: theme.text }]}>Filter:</Text>
        <View style={styles.filterOptions}>
          {filterOptions.map((option) => (
            <TouchableOpacity
              key={option.id}
              style={[
                styles.filterOption,
                {
                  backgroundColor:
                    activeFilter === option.id
                      ? `${theme.primary}15`
                      : 'transparent',
                  borderColor:
                    activeFilter === option.id ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setActiveFilter(option.id)}
            >
              <Text
                style={[
                  styles.filterOptionText,
                  {
                    color:
                      activeFilter === option.id
                        ? theme.primary
                        : theme.textSecondary,
                  },
                ]}
              >
                {option.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {filteredListings.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ListPlus size={64} color={theme.textSecondary} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>
            No Listings Yet
          </Text>
          <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
            {activeFilter === 'all'
              ? "You haven't added any listings yet. Tap 'Add New' to get started."
              : `You don't have any ${activeFilter} listings.`}
          </Text>
          {activeFilter === 'all' && (
            <Button
              title="Add Your First Listing"
              onPress={navigateToAddListing}
              leftIcon={<Plus size={20} color="#fff" />}
              style={{ marginTop: 24 }}
            />
          )}
        </View>
      ) : (
        <FlatList
          data={filteredListings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.listingItemContainer}>
              <ListingCard {...item} />
              <TouchableOpacity
                style={[styles.editButton, { backgroundColor: theme.primary }]}
                onPress={() => navigateToEditListing(item.id)}
              >
                <Edit size={20} color="#fff" />
              </TouchableOpacity>
              {item.status === 'inactive' && (
                <View
                  style={[styles.statusBadge, { backgroundColor: `${theme.error}15` }]}
                >
                  <Text style={[styles.statusText, { color: theme.error }]}>
                    Inactive
                  </Text>
                </View>
              )}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
  },
  subtitle: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  filterText: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: 'Lato-Bold',
  },
  filterOptions: {
    flexDirection: 'row',
    marginLeft: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
  },
  filterOptionText: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
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
    maxWidth: 300,
  },
  listContainer: {
    padding: 16,
  },
  listingItemContainer: {
    position: 'relative',
  },
  editButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  statusBadge: {
    position: 'absolute',
    top: 16,
    left: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    zIndex: 10,
  },
  statusText: {
    fontSize: 12,
    fontFamily: 'Lato-Bold',
  },
});

export default ListingsScreen;