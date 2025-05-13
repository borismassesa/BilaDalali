import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Alert,
  Share,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';
import PhotoGallery from '@/components/listing/PhotoGallery';
import Button from '@/components/common/Button';
import AmenityTag from '@/components/listing/AmenityTag';
import {
  MapPin,
  Bed,
  Bath,
  Grid3X3,
  Heart,
  Share as ShareIcon,
  ChevronLeft,
  MessageCircle,
  Phone,
  Calendar,
  Banknote,
} from 'lucide-react-native';
import { formatCurrency, formatDate } from '@/utils/formatting';

// Screen width for responsive sizing
const { width } = Dimensions.get('window');

// Mock listing data
const mockListingData = {
  id: '1',
  title: 'Spacious 2 Bedroom Apartment',
  description:
    'Beautiful and spacious apartment located in a quiet and secure area of Kinondoni. Featuring 2 bedrooms, 1 bathroom, a living room, dining area, and kitchen. The apartment has great natural light, and is close to schools, public transportation, and shopping centers.',
  location: 'Kinondoni, Dar es Salaam',
  price: 450000,
  photos: [
    'https://images.pexels.com/photos/1918291/pexels-photo-1918291.jpeg',
    'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
    'https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg',
  ],
  beds: 2,
  baths: 1,
  area: 85,
  propertyType: 'Apartment',
  amenities: [
    'WiFi',
    'Water',
    'Electricity',
    'Furnished',
    'Self-Contained',
    'Kitchen',
  ],
  landlord: {
    id: 'landlord1',
    name: 'John Doe',
    photo: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg',
    phone: '+255 712 345 678',
    responseRate: '95%',
    responseTime: 'Within a day',
  },
  publishedAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3), // 3 days ago
  availableFrom: new Date(Date.now() + 1000 * 60 * 60 * 24 * 14), // 14 days from now
};

const ListingDetailScreen = () => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const params = useLocalSearchParams();
  const listingId = params.id as string;
  
  const [listing, setListing] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFavorite, setIsFavorite] = useState(false);

  // Load listing data
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setListing(mockListingData);
      setIsLoading(false);
    }, 1000);
  }, [listingId]);

  // Toggle favorite status
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
    // In a real app, you would update Firestore here
  };

  // Share listing
  const shareListing = async () => {
    try {
      await Share.share({
        message: `Check out this property: ${listing.title} in ${listing.location} for ${formatCurrency(listing.price)}/month. View it on Pango Nyumba!`,
      });
    } catch (error) {
      console.error('Error sharing listing:', error);
    }
  };

  // Contact landlord via message
  const contactLandlord = () => {
    router.push(`/chat/${listing?.landlord.id}`);
  };

  // Call landlord
  const callLandlord = () => {
    // In a real app, this would use Linking to make a phone call
    Alert.alert(
      'Call Landlord',
      `Would you like to call ${listing?.landlord.name} at ${listing?.landlord.phone}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Call',
          onPress: () => console.log('Call initiated'),
        },
      ]
    );
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
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.backButton, { backgroundColor: `${theme.background}99` }]}
          onPress={() => router.back()}
        >
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <View style={styles.headerActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.background}99` }]}
            onPress={toggleFavorite}
          >
            <Heart
              size={24}
              color={isFavorite ? theme.accent : theme.text}
              fill={isFavorite ? theme.accent : 'transparent'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.background}99` }]}
            onPress={shareListing}
          >
            <ShareIcon size={24} color={theme.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Photo Gallery */}
        <PhotoGallery photos={listing.photos} height={300} />

        {/* Main Content */}
        <View style={styles.contentContainer}>
          {/* Title and Price */}
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: theme.text }]}>{listing.title}</Text>
            <Text style={[styles.price, { color: theme.primary }]}>
              {formatCurrency(listing.price)}/mo
            </Text>
          </View>

          {/* Location */}
          <View style={styles.locationContainer}>
            <MapPin size={16} color={theme.textSecondary} />
            <Text style={[styles.location, { color: theme.textSecondary }]}>
              {listing.location}
            </Text>
          </View>

          {/* Property Details */}
          <View style={[styles.detailsContainer, { borderColor: theme.border }]}>
            {listing.beds && (
              <View style={styles.detailItem}>
                <Bed size={20} color={theme.primary} />
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {listing.beds}
                </Text>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  {listing.beds === 1 ? 'Bedroom' : 'Bedrooms'}
                </Text>
              </View>
            )}
            {listing.baths && (
              <View style={styles.detailItem}>
                <Bath size={20} color={theme.primary} />
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {listing.baths}
                </Text>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  {listing.baths === 1 ? 'Bathroom' : 'Bathrooms'}
                </Text>
              </View>
            )}
            {listing.area && (
              <View style={styles.detailItem}>
                <Grid3X3 size={20} color={theme.primary} />
                <Text style={[styles.detailValue, { color: theme.text }]}>
                  {listing.area}
                </Text>
                <Text style={[styles.detailLabel, { color: theme.textSecondary }]}>
                  Sq. meters
                </Text>
              </View>
            )}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Description
            </Text>
            <Text style={[styles.description, { color: theme.text }]}>
              {listing.description}
            </Text>
          </View>

          {/* Additional Details */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Details
            </Text>
            <View style={styles.detailsGrid}>
              <View style={styles.detailsRow}>
                <View style={styles.detailsCol}>
                  <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>
                    Property Type
                  </Text>
                  <Text style={[styles.detailsValue, { color: theme.text }]}>
                    {listing.propertyType}
                  </Text>
                </View>
                <View style={styles.detailsCol}>
                  <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>
                    Available From
                  </Text>
                  <Text style={[styles.detailsValue, { color: theme.text }]}>
                    {formatDate(listing.availableFrom)}
                  </Text>
                </View>
              </View>
              <View style={styles.detailsRow}>
                <View style={styles.detailsCol}>
                  <Text style={[styles.detailsLabel, { color: theme.textSecondary }]}>
                    Published
                  </Text>
                  <Text style={[styles.detailsValue, { color: theme.text }]}>
                    {formatDate(listing.publishedAt)}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Amenities */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: theme.text }]}>
              Amenities
            </Text>
            <View style={styles.amenitiesContainer}>
              {listing.amenities.map((amenity: string, index: number) => (
                <AmenityTag key={`amenity-${index}`} name={amenity} />
              ))}
            </View>
          </View>

          {/* Landlord Info */}
          <View style={[styles.landlordSection, { borderColor: theme.border }]}>
            <View style={styles.landlordHeader}>
              <Text style={[styles.landlordTitle, { color: theme.text }]}>
                Contact Landlord
              </Text>
              <View style={styles.responseMeta}>
                <Text style={[styles.responseText, { color: theme.textSecondary }]}>
                  Response rate: {listing.landlord.responseRate}
                </Text>
                <Text style={[styles.responseText, { color: theme.textSecondary }]}>
                  Response time: {listing.landlord.responseTime}
                </Text>
              </View>
            </View>
            <View style={styles.contactActions}>
              <Button
                title="Message"
                leftIcon={<MessageCircle size={20} color="#fff" />}
                onPress={contactLandlord}
                style={{ flex: 1, marginRight: 8 }}
              />
              <Button
                title="Call"
                variant="outline"
                leftIcon={<Phone size={20} color={theme.primary} />}
                onPress={callLandlord}
                style={{ flex: 1 }}
              />
            </View>
          </View>

          {/* Book Viewing */}
          <View style={styles.section}>
            <View style={[styles.viewingCard, { backgroundColor: `${theme.primary}10` }]}>
              <Calendar size={24} color={theme.primary} />
              <View style={styles.viewingTextContainer}>
                <Text style={[styles.viewingTitle, { color: theme.text }]}>
                  Schedule a Viewing
                </Text>
                <Text style={[styles.viewingDescription, { color: theme.textSecondary }]}>
                  Contact the landlord to arrange a visit to this property.
                </Text>
              </View>
              <Button
                title="Book"
                size="small"
                onPress={contactLandlord}
              />
            </View>
          </View>

          {/* Payment Information */}
          <View style={[styles.section, styles.lastSection]}>
            <View style={[styles.paymentCard, { backgroundColor: `${theme.accent}10` }]}>
              <Banknote size={24} color={theme.accent} />
              <View style={styles.viewingTextContainer}>
                <Text style={[styles.viewingTitle, { color: theme.text }]}>
                  Payment Information
                </Text>
                <Text style={[styles.viewingDescription, { color: theme.textSecondary }]}>
                  First month rent of {formatCurrency(listing.price)} plus deposit of {formatCurrency(listing.price)} required.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Fixed Bottom Action Bar */}
      <View style={[styles.bottomBar, { backgroundColor: theme.background, borderColor: theme.border }]}>
        <View>
          <Text style={[styles.bottomBarPrice, { color: theme.primary }]}>
            {formatCurrency(listing.price)}
          </Text>
          <Text style={[styles.bottomBarPeriod, { color: theme.textSecondary }]}>
            per month
          </Text>
        </View>
        <Button
          title="Contact Landlord"
          onPress={contactLandlord}
        />
      </View>
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
    position: 'absolute',
    top: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    zIndex: 10,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerActions: {
    flexDirection: 'row',
  },
  actionButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  contentContainer: {
    padding: 16,
  },
  titleContainer: {
    marginBottom: 8,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Lato-Bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    fontFamily: 'Lato-Bold',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  location: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    marginLeft: 4,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    marginBottom: 24,
  },
  detailItem: {
    alignItems: 'center',
  },
  detailValue: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    marginTop: 8,
    marginBottom: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  section: {
    marginBottom: 24,
  },
  lastSection: {
    marginBottom: 100, // Extra space for bottom bar
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Lato-Regular',
    lineHeight: 22,
  },
  detailsGrid: {
    width: '100%',
  },
  detailsRow: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  detailsCol: {
    flex: 1,
  },
  detailsLabel: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    marginBottom: 4,
  },
  detailsValue: {
    fontSize: 14,
    fontFamily: 'Lato-Bold',
  },
  amenitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  landlordSection: {
    marginBottom: 24,
    paddingBottom: 24,
    borderBottomWidth: 1,
  },
  landlordHeader: {
    marginBottom: 16,
  },
  landlordTitle: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
    marginBottom: 8,
  },
  responseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  responseText: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
    marginRight: 16,
    marginBottom: 4,
  },
  contactActions: {
    flexDirection: 'row',
  },
  viewingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  viewingTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  viewingTitle: {
    fontSize: 16,
    fontFamily: 'Lato-Bold',
    marginBottom: 4,
  },
  viewingDescription: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
  },
  bottomBarPrice: {
    fontSize: 18,
    fontFamily: 'Lato-Bold',
  },
  bottomBarPeriod: {
    fontSize: 12,
    fontFamily: 'Lato-Regular',
  },
});

export default ListingDetailScreen;