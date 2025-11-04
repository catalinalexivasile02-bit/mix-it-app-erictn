
import { IconSymbol } from '@/components/IconSymbol';
import React from 'react';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  interpolate,
} from 'react-native-reanimated';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Dimensions,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, usePathname } from 'expo-router';
import { colors } from '@/styles/commonStyles';

export interface TabBarItem {
  name: string;
  route: string;
  icon: string;
  label: string;
}

interface FloatingTabBarProps {
  tabs: TabBarItem[];
  containerWidth?: number;
  borderRadius?: number;
  bottomMargin?: number;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function FloatingTabBar({
  tabs,
  containerWidth = SCREEN_WIDTH - 40,
  borderRadius = 25,
  bottomMargin = 20,
}: FloatingTabBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const activeIndex = useSharedValue(0);

  React.useEffect(() => {
    const index = tabs.findIndex(tab => pathname.includes(tab.name));
    if (index !== -1) {
      activeIndex.value = withSpring(index, {
        damping: 15,
        stiffness: 150,
      });
    }
  }, [pathname, tabs]);

  const handleTabPress = (route: string) => {
    router.push(route as any);
  };

  const indicatorStyle = useAnimatedStyle(() => {
    const tabWidth = containerWidth / tabs.length;
    return {
      transform: [
        {
          translateX: interpolate(
            activeIndex.value,
            tabs.map((_, i) => i),
            tabs.map((_, i) => i * tabWidth)
          ),
        },
      ],
      width: tabWidth,
    };
  });

  return (
    <SafeAreaView
      style={styles.safeArea}
      edges={['bottom']}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.container,
          {
            width: containerWidth,
            borderRadius,
            marginBottom: bottomMargin,
          },
        ]}
      >
        <BlurView intensity={80} tint="light" style={styles.blurView}>
          <View style={styles.tabsContainer}>
            <Animated.View style={[styles.indicator, indicatorStyle]} />
            {tabs.map((tab, index) => {
              const isActive = pathname.includes(tab.name);
              return (
                <TouchableOpacity
                  key={tab.name}
                  style={styles.tab}
                  onPress={() => handleTabPress(tab.route)}
                  activeOpacity={0.7}
                >
                  <IconSymbol
                    name={tab.icon as any}
                    size={24}
                    color={isActive ? colors.primary : colors.text}
                  />
                  <Text
                    style={[
                      styles.label,
                      { color: isActive ? colors.primary : colors.text },
                    ]}
                  >
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </BlurView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    alignItems: 'center',
    pointerEvents: 'box-none',
  },
  container: {
    overflow: 'hidden',
    boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.15)',
    elevation: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
  },
  blurView: {
    overflow: 'hidden',
    borderRadius: 25,
  },
  tabsContainer: {
    flexDirection: 'row',
    height: 60,
    position: 'relative',
  },
  tab: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  indicator: {
    position: 'absolute',
    height: '100%',
    backgroundColor: colors.highlight,
    opacity: 0.15,
    borderRadius: 20,
  },
});
