/**
 * Tab layout — the four-tab bottom navigation.
 *
 * Each <Tabs.Screen> maps to a file in this folder:
 *   index.tsx -> Home, course.tsx -> Course, etc.
 * Icons come from Ionicons; the active colour is the gold accent.
 */
import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, type ColorValue } from 'react-native';
import { useTheme, useThemedStyles, family, type ThemeColors } from '@/theme';
import type { IconName } from '@/types/content';

function tabIcon(focused: IconName, unfocused: IconName) {
  return ({ color, focused: isFocused }: { color: ColorValue; focused: boolean }) => (
    <Ionicons name={isFocused ? focused : unfocused} size={24} color={color} />
  );
}

export default function TabsLayout() {
  const { colors } = useTheme();
  const styles = useThemedStyles(makeStyles);
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.tabActive,
        tabBarInactiveTintColor: colors.tabInactive,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
        tabBarItemStyle: styles.tabItem,
        sceneStyle: { backgroundColor: colors.background },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: tabIcon('home', 'home-outline'),
        }}
      />
      <Tabs.Screen
        name="course"
        options={{
          title: 'Course',
          tabBarIcon: tabIcon('library', 'library-outline'),
        }}
      />
      <Tabs.Screen
        name="lesson"
        options={{
          title: 'Lesson',
          tabBarIcon: tabIcon('book', 'book-outline'),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: tabIcon('person', 'person-outline'),
        }}
      />
    </Tabs>
  );
}

const makeStyles = (colors: ThemeColors) => StyleSheet.create({
  tabBar: {
    backgroundColor: colors.tabBar,
    borderTopColor: colors.border,
    borderTopWidth: StyleSheet.hairlineWidth,
    height: 64,
    paddingTop: 6,
    paddingBottom: 8,
  },
  tabItem: {
    paddingVertical: 2,
  },
  tabLabel: {
    fontFamily: family.bodyMedium,
    fontSize: 11,
  },
});
