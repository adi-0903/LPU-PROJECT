/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, StatusBar, Text } from 'react-native';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { RootNavigator } from './navigation/RootNavigator';

export default function App() {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== 'undefined' ? window.innerWidth : 400
  );

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const isDesktop = windowWidth > 580;

  return (
    <LanguageProvider>
      <AuthProvider>
        <AppProvider>
          <StatusBar barStyle="dark-content" />
          <View style={styles.outerContainer}>
            {isDesktop ? (
              <View style={styles.phoneFrame}>
                {/* Virtual Phone Status Bar */}
                <View style={styles.statusBarMock}>
                  <Text style={styles.statusTime}>9:41</Text>
                  <View style={styles.statusDynamicIsland} />
                  <View style={styles.statusIcons}>
                    <Text style={styles.statusIconText}>5G</Text>
                    <View style={styles.batteryIcon}>
                      <View style={styles.batteryFill} />
                    </View>
                  </View>
                </View>

                {/* Main App Content */}
                <View style={styles.phoneBody}>
                  <RootNavigator />
                </View>

                {/* Home Indicator bar */}
                <View style={styles.homeIndicatorBar}>
                  <View style={styles.homeIndicator} />
                </View>
              </View>
            ) : (
              <View style={styles.mobileFullContainer}>
                <RootNavigator />
              </View>
            )}
          </View>
        </AppProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#EEF0F4',
    alignItems: 'center',
    justifyContent: 'center',
  },
  phoneFrame: {
    width: 412,
    height: '94%',
    maxHeight: 890,
    backgroundColor: '#FAFAF8',
    borderRadius: 44,
    borderWidth: 10,
    borderColor: '#1E232A',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.22,
    shadowRadius: 32,
    elevation: 16,
    overflow: 'hidden',
    position: 'relative',
    display: 'flex',
    flexDirection: 'column',
  },
  statusBarMock: {
    height: 38,
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 22,
    zIndex: 100,
  },
  statusTime: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E232A',
    fontFamily: 'Poppins, system-ui, sans-serif',
  },
  statusDynamicIsland: {
    width: 90,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#000000',
  },
  statusIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statusIconText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#1E232A',
    fontFamily: 'Poppins, system-ui, sans-serif',
  },
  batteryIcon: {
    width: 20,
    height: 10,
    borderRadius: 3,
    borderWidth: 1.5,
    borderColor: '#1E232A',
    padding: 1,
    justifyContent: 'center',
  },
  batteryFill: {
    width: '80%',
    height: '100%',
    backgroundColor: '#1E232A',
    borderRadius: 1,
  },
  phoneBody: {
    flex: 1,
    backgroundColor: '#FAFAF8',
    overflow: 'hidden',
  },
  homeIndicatorBar: {
    height: 18,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  homeIndicator: {
    width: 120,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#1E232A',
    opacity: 0.4,
  },
  mobileFullContainer: {
    flex: 1,
    height: '100%',
    width: '100%',
    backgroundColor: '#FAFAF8',
  },
});
