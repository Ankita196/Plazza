import React, { useState } from 'react';
import {
  StatusBar,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import { CartProvider, useCart } from './src/context/CartContext';
import { PromotionProvider, usePromotion } from './src/context/PromotionContext';
import { HomeScreen } from './src/screens/HomeScreen';
import { CartScreen } from './src/screens/CartScreen';
import { ToastBanner } from './src/components/ToastBanner';

type TabType = 'home' | 'cart';

function MainApp() {
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const insets = useSafeAreaInsets();
  const { totalItemCount } = useCart();
  const { toast, dismissToast } = usePromotion();

  return (
    <View style={[styles.mainContainer, { paddingTop: insets.top, paddingBottom: insets.bottom }]}>
      {/* Global Toast Banner for Coupon Auto-removal & Alerts */}
      <ToastBanner toast={toast} onDismiss={dismissToast} />

      {/* Main Tab View */}
      <View style={styles.contentArea}>
        {activeTab === 'home' ? (
          <HomeScreen onNavigateToCart={() => setActiveTab('cart')} />
        ) : (
          <CartScreen onNavigateToHome={() => setActiveTab('home')} />
        )}
      </View>

      {/* Bottom Navigation Bar */}
      <View style={styles.tabBar} accessibilityRole="tablist">
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'home' && styles.tabButtonActive]}
          onPress={() => setActiveTab('home')}
          accessibilityRole="tab"
          accessibilityLabel="Home and Medicine Search Tab"
          accessibilityState={{ selected: activeTab === 'home' }}
        >
          <Text style={styles.tabIcon}>🔍</Text>
          <Text style={[styles.tabText, activeTab === 'home' && styles.tabTextActive]}>
            Home
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'cart' && styles.tabButtonActive]}
          onPress={() => setActiveTab('cart')}
          accessibilityRole="tab"
          accessibilityLabel={`Cart Tab, ${totalItemCount} items`}
          accessibilityState={{ selected: activeTab === 'cart' }}
        >
          <View style={styles.cartIconWrapper}>
            <Text style={styles.tabIcon}>🛒</Text>
            {totalItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{totalItemCount}</Text>
              </View>
            )}
          </View>
          <Text style={[styles.tabText, activeTab === 'cart' && styles.tabTextActive]}>
            Cart
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function App() {
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <CartProvider>
        <PromotionProvider>
          <MainApp />
        </PromotionProvider>
      </CartProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#0F766E', // Matches top header branding
  },
  contentArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  tabBar: {
    flexDirection: 'row',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    elevation: 8,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabButtonActive: {
    borderTopWidth: 2,
    borderTopColor: '#0D9488',
  },
  cartIconWrapper: {
    position: 'relative',
  },
  tabIcon: {
    fontSize: 20,
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    marginTop: 2,
  },
  tabTextActive: {
    color: '#0D9488',
    fontWeight: '800',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -10,
    backgroundColor: '#DC2626',
    borderRadius: 9,
    minWidth: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
});

export default App;
