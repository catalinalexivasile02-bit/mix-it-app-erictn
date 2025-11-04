
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Pressable,
  Dimensions,
  Alert
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from 'expo-linear-gradient';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const GRID_ITEM_SIZE = (SCREEN_WIDTH - 48) / 3;

interface UserVideo {
  id: string;
  thumbnail: string;
  views: number;
}

const MOCK_USER_VIDEOS: UserVideo[] = [
  { id: '1', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4', views: 1234 },
  { id: '2', thumbnail: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e', views: 2567 },
  { id: '3', thumbnail: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29', views: 3421 },
  { id: '4', thumbnail: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e', views: 987 },
  { id: '5', thumbnail: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05', views: 4532 },
  { id: '6', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e', views: 2198 },
];

export default function ProfileScreen() {
  const [activeTab, setActiveTab] = useState<'videos' | 'liked'>('videos');

  const handleEditProfile = () => {
    Alert.alert('Edit Profile', 'Edit profile feature coming soon!');
  };

  const handleVideoPress = (videoId: string) => {
    Alert.alert('Video', `Playing video ${videoId}`);
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.contentContainer,
          Platform.OS !== 'ios' && styles.contentContainerWithTabBar
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.avatarContainer}>
            <LinearGradient
              colors={[colors.primary, colors.secondary]}
              style={styles.avatarGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.avatarInner}>
                <IconSymbol name="person.fill" size={60} color={colors.text} />
              </View>
            </LinearGradient>
          </View>

          <Text style={styles.name}>Sarah Johnson</Text>
          <Text style={styles.handle}>@sarahjohnson</Text>

          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>127</Text>
              <Text style={styles.statLabel}>Posts</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12.5K</Text>
              <Text style={styles.statLabel}>Followers</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>892</Text>
              <Text style={styles.statLabel}>Following</Text>
            </View>
          </View>

          <Text style={styles.bio}>
            🎨 Content Creator | 📍 San Francisco{'\n'}
            Living life one video at a time ✨
          </Text>

          <Pressable style={styles.editButton} onPress={handleEditProfile}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </Pressable>
        </View>

        <View style={styles.tabsContainer}>
          <Pressable 
            style={[styles.tab, activeTab === 'videos' && styles.activeTab]}
            onPress={() => setActiveTab('videos')}
          >
            <IconSymbol 
              name="square.grid.3x3.fill" 
              size={24} 
              color={activeTab === 'videos' ? colors.primary : colors.textSecondary} 
            />
          </Pressable>
          <Pressable 
            style={[styles.tab, activeTab === 'liked' && styles.activeTab]}
            onPress={() => setActiveTab('liked')}
          >
            <IconSymbol 
              name="heart.fill" 
              size={24} 
              color={activeTab === 'liked' ? colors.primary : colors.textSecondary} 
            />
          </Pressable>
        </View>

        <View style={styles.gridContainer}>
          {MOCK_USER_VIDEOS.map((video) => (
            <Pressable 
              key={video.id} 
              style={styles.gridItem}
              onPress={() => handleVideoPress(video.id)}
            >
              <View style={styles.videoThumbnail}>
                <View style={styles.thumbnailPlaceholder}>
                  <IconSymbol name="play.fill" size={32} color={colors.card} />
                </View>
                <View style={styles.viewsOverlay}>
                  <IconSymbol name="eye.fill" size={12} color={colors.card} />
                  <Text style={styles.viewsText}>{video.views}</Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  contentContainerWithTabBar: {
    paddingBottom: 100,
  },
  header: {
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  avatarContainer: {
    marginBottom: 16,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
  },
  avatarInner: {
    width: '100%',
    height: '100%',
    borderRadius: 56,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  handle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 40,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: colors.textSecondary,
    opacity: 0.3,
  },
  bio: {
    fontSize: 14,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  editButton: {
    backgroundColor: colors.card,
    paddingHorizontal: 32,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.textSecondary,
    opacity: 0.5,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.textSecondary,
    opacity: 0.3,
  },
  tab: {
    flex: 1,
    paddingVertical: 16,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: colors.primary,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 12,
    paddingTop: 12,
  },
  gridItem: {
    width: GRID_ITEM_SIZE,
    height: GRID_ITEM_SIZE * 1.5,
    padding: 4,
  },
  videoThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.textSecondary,
    opacity: 0.2,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  thumbnailPlaceholder: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewsOverlay: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewsText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
});
