
import React, { useState } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Platform,
  Pressable,
  Alert,
  TextInput
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { IconSymbol } from "@/components/IconSymbol";
import { colors } from "@/styles/commonStyles";
import * as ImagePicker from 'expo-image-picker';
import { router } from "expo-router";

export default function UploadScreen() {
  const [caption, setCaption] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  const requestPermissions = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera roll permissions to upload videos.');
      return false;
    }
    return true;
  };

  const handleRecordVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please grant camera permissions to record videos.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedVideo(result.assets[0].uri);
    }
  };

  const handleSelectVideo = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['videos'],
      allowsEditing: true,
      quality: 1,
      videoMaxDuration: 60,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedVideo(result.assets[0].uri);
    }
  };

  const handlePost = () => {
    if (!selectedVideo) {
      Alert.alert('No Video', 'Please select or record a video first.');
      return;
    }

    Alert.alert(
      'Success!', 
      'Your video has been posted!',
      [
        {
          text: 'OK',
          onPress: () => {
            setSelectedVideo(null);
            setCaption('');
            router.push('/(tabs)/(home)/');
          }
        }
      ]
    );
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
          <Text style={styles.title}>Create Post</Text>
        </View>

        {selectedVideo ? (
          <View style={styles.videoPreview}>
            <View style={styles.videoPlaceholder}>
              <IconSymbol name="play.circle.fill" size={64} color={colors.primary} />
              <Text style={styles.videoSelectedText}>Video Selected</Text>
            </View>
            <Pressable 
              style={styles.removeButton}
              onPress={() => setSelectedVideo(null)}
            >
              <IconSymbol name="xmark.circle.fill" size={32} color={colors.text} />
            </Pressable>
          </View>
        ) : (
          <View style={styles.uploadOptions}>
            <Pressable style={styles.uploadButton} onPress={handleRecordVideo}>
              <View style={[styles.uploadIconContainer, { backgroundColor: colors.primary }]}>
                <IconSymbol name="video.fill" size={40} color={colors.card} />
              </View>
              <Text style={styles.uploadButtonText}>Record Video</Text>
              <Text style={styles.uploadButtonSubtext}>Capture a new video</Text>
            </Pressable>

            <Pressable style={styles.uploadButton} onPress={handleSelectVideo}>
              <View style={[styles.uploadIconContainer, { backgroundColor: colors.secondary }]}>
                <IconSymbol name="photo.fill" size={40} color={colors.card} />
              </View>
              <Text style={styles.uploadButtonText}>Choose from Library</Text>
              <Text style={styles.uploadButtonSubtext}>Select an existing video</Text>
            </Pressable>
          </View>
        )}

        <View style={styles.captionContainer}>
          <Text style={styles.label}>Caption</Text>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            placeholderTextColor={colors.textSecondary}
            value={caption}
            onChangeText={setCaption}
            multiline
            maxLength={200}
          />
          <Text style={styles.characterCount}>{caption.length}/200</Text>
        </View>

        <Pressable 
          style={[
            styles.postButton,
            !selectedVideo && styles.postButtonDisabled
          ]}
          onPress={handlePost}
          disabled={!selectedVideo}
        >
          <Text style={styles.postButtonText}>Post Video</Text>
        </Pressable>
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
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  uploadOptions: {
    paddingHorizontal: 20,
    gap: 16,
    marginBottom: 32,
  },
  uploadButton: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  uploadIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  uploadButtonSubtext: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  videoPreview: {
    marginHorizontal: 20,
    marginBottom: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  videoPlaceholder: {
    height: 400,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  videoSelectedText: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
  },
  captionContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  captionInput: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 120,
    textAlignVertical: 'top',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.05)',
    elevation: 2,
  },
  characterCount: {
    fontSize: 12,
    color: colors.textSecondary,
    textAlign: 'right',
    marginTop: 8,
  },
  postButton: {
    marginHorizontal: 20,
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
    boxShadow: '0px 4px 12px rgba(233, 30, 99, 0.3)',
    elevation: 4,
  },
  postButtonDisabled: {
    backgroundColor: colors.textSecondary,
    opacity: 0.5,
  },
  postButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.card,
  },
});
