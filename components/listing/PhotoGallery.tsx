import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface PhotoGalleryProps {
  photos: string[];
  height?: number;
}

const PhotoGallery = ({ photos, height = 250 }: PhotoGalleryProps) => {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const opacity = useSharedValue(0);

  // Show controls briefly when index changes
  const showControls = () => {
    opacity.value = withTiming(1, { duration: 200 });
    setTimeout(() => {
      opacity.value = withTiming(0, { duration: 200 });
    }, 3000);
  };

  // Animated style for controls
  const controlsStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const handleScroll = (event: any) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / width);
    if (index !== activeIndex) {
      setActiveIndex(index);
      showControls();
    }
  };

  const goToNext = () => {
    if (activeIndex < photos.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex + 1,
        animated: true,
      });
      setActiveIndex(activeIndex + 1);
      showControls();
    }
  };

  const goToPrevious = () => {
    if (activeIndex > 0) {
      flatListRef.current?.scrollToIndex({
        index: activeIndex - 1,
        animated: true,
      });
      setActiveIndex(activeIndex - 1);
      showControls();
    }
  };

  // Show controls on first render
  React.useEffect(() => {
    showControls();
  }, []);

  return (
    <View style={[styles.container, { height }]}>
      <FlatList
        ref={flatListRef}
        data={photos}
        keyExtractor={(item, index) => `photo-${index}`}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        renderItem={({ item }) => (
          <View style={[styles.photoContainer, { width }]}>
            <Image source={{ uri: item }} style={styles.photo} resizeMode="cover" />
          </View>
        )}
        onTouchStart={() => {
          showControls();
        }}
      />

      {/* Photo counter */}
      <View
        style={[
          styles.counterContainer,
          { backgroundColor: `${theme.background}80` },
        ]}
      >
        <Text style={[styles.counterText, { color: theme.text }]}>
          {activeIndex + 1} / {photos.length}
        </Text>
      </View>

      {/* Navigation controls */}
      {photos.length > 1 && (
        <Animated.View style={[styles.controls, controlsStyle]}>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.leftButton,
              { backgroundColor: `${theme.background}80` },
              activeIndex === 0 && styles.disabledButton,
            ]}
            onPress={goToPrevious}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={24} color={theme.text} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.navButton,
              styles.rightButton,
              { backgroundColor: `${theme.background}80` },
              activeIndex === photos.length - 1 && styles.disabledButton,
            ]}
            onPress={goToNext}
            disabled={activeIndex === photos.length - 1}
          >
            <ChevronRight size={24} color={theme.text} />
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Indicators */}
      {photos.length > 1 && (
        <View style={styles.indicatorsContainer}>
          {photos.map((_, index) => (
            <View
              key={`indicator-${index}`}
              style={[
                styles.indicator,
                {
                  backgroundColor:
                    index === activeIndex ? theme.primary : `${theme.text}50`,
                  width: index === activeIndex ? 20 : 8,
                },
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    width: '100%',
    overflow: 'hidden',
  },
  photoContainer: {
    height: '100%',
  },
  photo: {
    width: '100%',
    height: '100%',
  },
  counterContainer: {
    position: 'absolute',
    top: 16,
    right: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  counterText: {
    fontSize: 12,
    fontFamily: 'Lato-Bold',
  },
  controls: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    pointerEvents: 'box-none',
  },
  navButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  leftButton: {
    left: 16,
  },
  rightButton: {
    right: 16,
  },
  disabledButton: {
    opacity: 0.5,
  },
  indicatorsContainer: {
    position: 'absolute',
    bottom: 16,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicator: {
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
});

export default PhotoGallery;