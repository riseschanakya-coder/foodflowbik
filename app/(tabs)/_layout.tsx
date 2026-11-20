import { Tabs } from 'expo-router';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useStore } from '../../context/StoreContext';

const icons: Record<string, keyof typeof Ionicons.glyphMap> = {
  index: 'home',
  search: 'search',
  favorites: 'heart',
  cart: 'cart',
  profile: 'person',
};

function ThreeDTabIcon({
  routeName,
  focused,
}: {
  routeName: string;
  focused: boolean;
}) {
  const iconName = icons[routeName] ?? 'ellipse';
  return (
    <View
      style={[
        styles.iconWrap,
        focused && styles.iconWrapActive,
      ]}
    >
      {focused && <View style={styles.activeHighlight} />}
      <View style={focused ? styles.iconShadowActive : styles.iconShadow}>
        <Ionicons
          name={focused && routeName === 'favorites' ? 'heart' : iconName}
          size={focused ? 21 : 20}
          color={focused ? '#E23744' : '#7A7A85'}
        />
      </View>
      {focused && <View style={styles.activeDot} />}
    </View>
  );
}

export default function TabsLayout() {
  const { cart } = useStore();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#E23744',
        tabBarInactiveTintColor: '#777',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '800' },
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.OS === 'web' ? 14 : 12,
          left: Platform.OS === 'web' ? 18 : 12,
          right: Platform.OS === 'web' ? 18 : 12,
          height: Platform.OS === 'web' ? 68 : 74,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'web' ? 8 : 13,
          backgroundColor: '#FFFFFF',
          borderRadius: 28,
          borderWidth: 1,
          borderColor: '#F0ECEC',
          shadowColor: '#4A2D22',
          shadowOpacity: 0.16,
          shadowRadius: 16,
          shadowOffset: { width: 0, height: 6 },
          elevation: 14,
          overflow: 'hidden',
        },
        tabBarIcon: ({ focused }) => (
          <ThreeDTabIcon routeName={route.name} focused={focused} />
        ),
        tabBarBadge:
          route.name === 'cart' && count ? count : undefined,
        tabBarBadgeStyle: {
          backgroundColor: '#E23744',
          color: '#fff',
          fontWeight: '900',
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: 'Home' }} />
      <Tabs.Screen name="search" options={{ title: 'Search' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
      <Tabs.Screen name="cart" options={{ title: 'Cart' }} />
      <Tabs.Screen name="profile" options={{ title: 'Profile' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: -2,
  },
  iconWrapActive: {
    backgroundColor: '#FFF5F5',
    borderWidth: 1,
    borderColor: 'rgba(226,55,68,.08)',
    shadowColor: '#D72534',
    shadowOpacity: 0.22,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 5 },
    elevation: 7,
  },
  activeHighlight: {
    position: 'absolute',
    top: 3,
    width: 28,
    height: 12,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,.82)',
  },
  iconShadow: {
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconShadowActive: {
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#E23744',
    shadowOpacity: 0.22,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 3 },
  },
  activeDot: {
    position: 'absolute',
    bottom: -6,
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#E23744',
  },
});
