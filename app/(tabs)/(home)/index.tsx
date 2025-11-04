
import React, { useState, useRef, useCallback } from "react";
import { Stack } from "expo-router";
import { 
  View, 
  Text, 
  StyleSheet, 
  Dimensions, 
  Pressable, 
  Platform,
  ScrollView,
  Alert
} from "react-native";
import { IconSymbol } from "@/components/IconSymbol";
import { useVideoPlayer, VideoView } from 'expo-video';
import { colors } from "@/styles/commonStyles";
import { LinearGradient } from 'expo-linear-gradient';

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');

interface VideoPost {
  id: string;
  videoUrl: string;
  username: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
}

const SAMPLE_VIDEOS: VideoPost[] = [
  {
    id: '1',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    username: 'nature_lover',
    caption: 'Beautiful sunset at the beach 🌅 #nature #sunset',
    likes: 1234,
    comments: 89,
    shares: 45,
    isLiked: false,
  },
  {
    id: '2',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    username: 'creative_mind',
    caption: 'Check out this amazing animation! 🎨 #art #creative',
    likes: 2567,
    comments: 156,
    shares: 78,
    isLiked: false,
  },
  {
    id: '3',
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
    username: 'adventure_seeker',
    caption: 'Epic adventure awaits! 🏔️ #travel #adventure',
    likes: 3421,
    comments: 234,
    shares: 123,
    isLiked: false,
  },
];

function VideoPostItem({ post, isActive }: { post: VideoPost; isActive: boolean }) {
  const [isLiked, setIsLiked] = useState(post.isLiked);
  const [likes, setLikes] = useState(post.likes);
  const [isPlaying, setIsPlaying] = useState(false);

  const player = useVideoPlayer(post.videoUrl, player => {
    player.loop = true;
    player.muted = false;
  });

  React.useEffect(() => {
    if (isActive && player) {
      player.play();
      setIsPlaying(true);
    } else if (player) {
      player.pause();
      setIsPlaying(false);
    }
  }, [isActive, player]);

  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikes(isLiked ? likes - 1 : likes + 1);
  };

  const handleComment = () => {
    Alert.alert('Comments', 'Comment feature coming soon!');
  };

  const handleShare = () => {
    Alert.alert('Share', 'Share feature coming soon!');
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      player.pause();
      setIsPlaying(false);
    } else {
      player.play();
      setIsPlaying(true);
    }
  };

  return (
    <View style={styles.videoContainer}>
      <Pressable onPress={togglePlayPause} style={styles.videoWrapper}>
        <VideoView 
          player={player} 
          style={styles.video}
          contentFit="cover"
          nativeControls={false}
        />
        
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.gradient}
        />

        <View style={styles.videoInfo}>
          <View style={styles.userInfo}>
            <View style={styles.avatar}>
              <IconSymbol name="person.fill" size={24} color={colors.card} />
            </View>
            <Text style={styles.username}>@{post.username}</Text>
          </View>
          <Text style={styles.caption}>{post.caption}</Text>
        </View>

        <View style={styles.actionButtons}>
          <Pressable onPress={handleLike} style={styles.actionButton}>
            <IconSymbol 
              name={isLiked ? "heart.fill" : "heart"} 
              size={32} 
              color={isLiked ? colors.primary : colors.card} 
            />
            <Text style={styles.actionText}>{likes}</Text>
          </Pressable>

          <Pressable onPress={handleComment} style={styles.actionButton}>
            <IconSymbol name="bubble.left.fill" size={32} color={colors.card} />
            <Text style={styles.actionText}>{post.comments}</Text>
          </Pressable>

          <Pressable onPress={handleShare} style={styles.actionButton}>
            <IconSymbol name="paperplane.fill" size={32} color={colors.card} />
            <Text style={styles.actionText}>{post.shares}</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
}

export default function HomeScreen() {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const handleScroll = useCallback((event: any) => {
    const offsetY = event.nativeEvent.contentOffset.y;
    const index = Math.round(offsetY / SCREEN_HEIGHT);
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  }, [activeIndex]);

  const renderHeaderRight = () => (
    <Pressable
      onPress={() => Alert.alert("Search", "Search feature coming soon!")}
      style={styles.headerButton}
    >
      <IconSymbol name="magnifyingglass" color={colors.text} size={24} />
    </Pressable>
  );

  return (
    <>
      {Platform.OS === 'ios' && (
        <Stack.Screen
          options={{
            title: "Discover",
            headerStyle: {
              backgroundColor: colors.background,
            },
            headerTintColor: colors.text,
            headerRight: renderHeaderRight,
          }}
        />
      )}
      <View style={styles.container}>
        <ScrollView
          ref={scrollViewRef}
          pagingEnabled
          showsVerticalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          decelerationRate="fast"
          snapToInterval={SCREEN_HEIGHT}
          snapToAlignment="start"
        >
          {SAMPLE_VIDEOS.map((post, index) => (
            <VideoPostItem 
              key={post.id} 
              post={post} 
              isActive={index === activeIndex}
            />
          ))}
        </ScrollView>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    backgroundColor: '#000',
  },
  videoWrapper: {
    flex: 1,
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 300,
  },
  videoInfo: {
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 100 : 120,
    left: 16,
    right: 80,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  username: {
    color: colors.card,
    fontSize: 16,
    fontWeight: '700',
  },
  caption: {
    color: colors.card,
    fontSize: 14,
    lineHeight: 20,
  },
  actionButtons: {
    position: 'absolute',
    right: 16,
    bottom: Platform.OS === 'ios' ? 100 : 120,
    gap: 24,
  },
  actionButton: {
    alignItems: 'center',
    gap: 4,
  },
  actionText: {
    color: colors.card,
    fontSize: 12,
    fontWeight: '600',
  },
  headerButton: {
    padding: 8,
  },
});
