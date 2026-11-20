import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useStore } from '../../context/StoreContext';

const items = [
  ['receipt-outline', 'Your orders', 'Track and reorder'],
  ['location-outline', 'Address book', 'Manage delivery spots'],
  ['card-outline', 'Payment methods', 'Cards and wallets'],
  ['notifications-outline', 'Notifications', 'Offers and updates'],
  ['help-circle-outline', 'Help & support', 'We are here to help'],
  ['settings-outline', 'Settings', 'Privacy and preferences'],
] as const;

export default function Profile() {
  const { isLoggedIn, userName, logout, cart, favorites, isDark, toggleTheme } = useStore();
  const initial = userName.trim().charAt(0).toUpperCase() || 'A';
  const orderCount = isLoggedIn ? 12 : 0;

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <SafeAreaView style={[styles.safe, isDark && styles.safeDark]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        <View style={styles.titleRow}>
          <View>
            <Text style={styles.eyebrow}>MY SPACE</Text>
            <Text style={styles.heading}>Profile</Text>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={[styles.themeToggle, isDark && styles.themeToggleDark]} onPress={toggleTheme}>
              <View style={[styles.themeThumb, isDark && styles.themeThumbDark]}>
                <Ionicons name={isDark ? 'moon' : 'sunny'} size={13} color={isDark ? '#FFD85A' : '#F5A623'} />
              </View>
            </Pressable>
            <Pressable style={styles.settingsButton}>
              <Ionicons name="settings-outline" size={20} color={isDark ? '#DDD' : '#555'} />
            </Pressable>
          </View>
        </View>

        <View style={styles.profileCard}>
          <View style={styles.cardGlow} />
          <View style={styles.avatarShell}>
            <View style={styles.avatarRing}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.profileText}>
            <Text style={styles.name}>{isLoggedIn ? userName : 'Guest food lover'}</Text>
            <Text style={styles.phone}>{isLoggedIn ? '+91 98765 43210' : 'Login for a personal experience'}</Text>
          </View>
          {isLoggedIn ? (
            <Pressable style={styles.editButton}>
              <Ionicons name="pencil" size={15} color="#E23744" />
            </Pressable>
          ) : (
            <Pressable style={styles.loginButton} onPress={() => router.push('/login')}>
              <Text style={styles.loginText}>Login</Text>
            </Pressable>
          )}
        </View>

        <View style={styles.statsCard}>
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF1F2' }]}>
              <Ionicons name="receipt-outline" size={18} color="#E23744" />
            </View>
            <Text style={styles.statValue}>{orderCount}</Text>
            <Text style={styles.statLabel}>Orders</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#FFF3D9' }]}>
              <Ionicons name="heart-outline" size={18} color="#D78C16" />
            </View>
            <Text style={styles.statValue}>{favorites.length}</Text>
            <Text style={styles.statLabel}>Favorites</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <View style={[styles.statIcon, { backgroundColor: '#EAF7EC' }]}>
              <Ionicons name="basket-outline" size={18} color="#248A3D" />
            </View>
            <Text style={styles.statValue}>{cart.length}</Text>
            <Text style={styles.statLabel}>In cart</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuGrid}>
          {items.map(([icon, label, caption], index) => (
            <Pressable key={label} style={[styles.menuTile, index === 0 && styles.featuredTile]}>
              <View style={[styles.menuIcon, index === 0 && styles.featuredIcon]}>
                <Ionicons name={icon} size={21} color={index === 0 ? '#fff' : '#E23744'} />
              </View>
              <View style={styles.menuCopy}>
                <Text style={styles.menuLabel}>{label}</Text>
                <Text numberOfLines={1} style={styles.menuCaption}>{caption}</Text>
              </View>
              <Ionicons name="chevron-forward" size={17} color="#B3AFAF" />
            </Pressable>
          ))}
        </View>

        {isLoggedIn && (
          <Pressable style={styles.logout} onPress={handleLogout}>
            <View style={styles.logoutIcon}><Ionicons name="log-out-outline" size={20} color="#E23744" /></View>
            <Text style={styles.logoutText}>Log out</Text>
            <Ionicons name="chevron-forward" size={18} color="#C0BABA" />
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F7F7F8' },
  safeDark: { backgroundColor: '#161618' },
  content: { paddingHorizontal: 16, paddingBottom: 110, maxWidth: Platform.OS === 'web' ? 900 : undefined, width: '100%', alignSelf: 'center' },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 14 },
  eyebrow: { color: '#E23744', fontSize: 10, fontWeight: '900', letterSpacing: 1.4 },
  heading: { color: '#242424', fontSize: 28, fontWeight: '900', marginTop: 2 },
  headerActions: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  themeToggle: { width: 54, height: 30, borderRadius: 15, backgroundColor: '#E8E8EB', padding: 3, justifyContent: 'center', borderWidth: 1, borderColor: '#DEDEE2' },
  themeToggleDark: { backgroundColor: '#34343A', borderColor: '#4A4A50' },
  themeThumb: { width: 22, height: 22, borderRadius: 11, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#000', shadowOpacity: 0.12, shadowRadius: 4, shadowOffset: { width: 0, height: 2 }, elevation: 3 },
  themeThumbDark: { alignSelf: 'flex-end', backgroundColor: '#202024' },
  settingsButton: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#EEE', shadowColor: '#3D2A22', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 4 },
  profileCard: { height: 128, borderRadius: 24, backgroundColor: '#FFF', padding: 18, flexDirection: 'row', alignItems: 'center', overflow: 'hidden', borderWidth: 1, borderColor: '#F1EEEE', shadowColor: '#4A3328', shadowOpacity: 0.12, shadowRadius: 16, shadowOffset: { width: 0, height: 8 }, elevation: 7 },
  cardGlow: { position: 'absolute', width: 180, height: 180, borderRadius: 90, right: -95, top: -110, backgroundColor: '#FFF1F2' },
  avatarShell: { width: 74, height: 74, alignItems: 'center', justifyContent: 'center', marginRight: 14 },
  avatarRing: { width: 68, height: 68, borderRadius: 34, backgroundColor: '#FFE1E3', borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#E23744', shadowOpacity: 0.18, shadowRadius: 8, shadowOffset: { width: 0, height: 5 }, elevation: 5 },
  avatarText: { fontSize: 27, fontWeight: '900', color: '#E23744' },
  onlineDot: { position: 'absolute', right: 5, bottom: 6, width: 15, height: 15, borderRadius: 8, backgroundColor: '#35A853', borderWidth: 3, borderColor: '#fff' },
  profileText: { flex: 1 },
  name: { color: '#242424', fontSize: 19, fontWeight: '900' },
  phone: { color: '#888', fontSize: 12, marginTop: 5 },
  editButton: { width: 38, height: 38, borderRadius: 19, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center' },
  loginButton: { backgroundColor: '#E23744', borderRadius: 12, paddingHorizontal: 14, height: 38, alignItems: 'center', justifyContent: 'center', shadowColor: '#E23744', shadowOpacity: 0.18, shadowRadius: 6, shadowOffset: { width: 0, height: 3 } },
  loginText: { color: '#fff', fontWeight: '900', fontSize: 13 },
  statsCard: { height: 92, marginTop: 14, borderRadius: 20, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F0ECEC', flexDirection: 'row', alignItems: 'center', shadowColor: '#33261F', shadowOpacity: 0.07, shadowRadius: 10, shadowOffset: { width: 0, height: 5 }, elevation: 4 },
  statItem: { flex: 1, alignItems: 'center' },
  statIcon: { width: 32, height: 32, borderRadius: 16, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  statValue: { color: '#262626', fontSize: 15, fontWeight: '900' },
  statLabel: { color: '#999', fontSize: 10, marginTop: 1 },
  statDivider: { width: 1, height: 52, backgroundColor: '#EEE' },
  sectionTitle: { color: '#303030', fontSize: 18, fontWeight: '900', marginTop: 20, marginBottom: 10 },
  menuGrid: { gap: 10 },
  menuTile: { height: 68, borderRadius: 17, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F0ECEC', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#33261F', shadowOpacity: 0.055, shadowRadius: 7, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  featuredTile: { borderColor: '#F3D9DB' },
  menuIcon: { width: 42, height: 42, borderRadius: 21, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  featuredIcon: { backgroundColor: '#E23744', shadowColor: '#E23744', shadowOpacity: 0.22, shadowRadius: 7, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  menuCopy: { flex: 1 },
  menuLabel: { color: '#2D2D2D', fontSize: 14, fontWeight: '900' },
  menuCaption: { color: '#999', fontSize: 11, marginTop: 3 },
  logout: { height: 64, marginTop: 12, borderRadius: 18, backgroundColor: '#fff', borderWidth: 1, borderColor: '#F0ECEC', paddingHorizontal: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#33261F', shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }, elevation: 3 },
  logoutIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF1F2', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  logoutText: { flex: 1, color: '#E23744', fontSize: 14, fontWeight: '900' },
});
