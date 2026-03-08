import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';
import * as React from 'react';
import { Animated, Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const TABS = [
  { key: 'dashboard', label: 'Home', icon: 'home', family: 'Entypo' },
  { key: 'ai_chat', label: 'AI Chat', icon: 'chatbox', family: 'Ionicons' }, 
  { key: 'profile', label: 'Profile', icon: 'user', family: 'FontAwesome' },
] as const;

type TabKey = typeof TABS[number]['key'];

export default function BottomNav() {
  const [activeTab, setActiveTab] = React.useState<TabKey>('dashboard');

  const translateX = React.useRef(new Animated.Value(0)).current;
  const scaleValues = React.useRef(TABS.map((_, i) => new Animated.Value(i === 0 ? 1.2 : 1))).current;
  const tabWidth = Dimensions.get('window').width / TABS.length;

  React.useEffect(() => {
    const index = TABS.findIndex(t => t.key === activeTab);

    Animated.spring(translateX, {
      toValue: index * tabWidth + tabWidth / 2 - 20,
      useNativeDriver: true,
      bounciness: 12,
    }).start();

    scaleValues.forEach((val, i) => {
      Animated.spring(val, {
        toValue: i === index ? 1.2 : 1,
        useNativeDriver: true,
        bounciness: 12,
      }).start();
    });
  }, [activeTab, tabWidth, scaleValues, translateX]);

  return (
    <View style={styles.nav}>
      <Animated.View style={[styles.activeCircle, { transform: [{ translateX }] }]} />

      {TABS.map((tab, i) => {
        const isActive = tab.key === activeTab;

        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.button}
            onPress={() => setActiveTab(tab.key)}
            activeOpacity={0.8}
          >
            <Animated.View
              style={[
                styles.iconCircle,
                {
                  transform: [{ scale: scaleValues[i] }],
                  // Removed the 'None' check here that was likely causing the TS error!
                  backgroundColor: isActive ? '#bc930d' : 'transparent', 
                },
              ]}
            >
              {tab.family === 'Entypo' && (
                <Entypo name={tab.icon as any} size={24} color={isActive ? 'white' : '#4A0E0E'} />
              )}
              {tab.family === 'FontAwesome' && (
                <FontAwesome name={tab.icon as any} size={24} color={isActive ? 'white' : '#4A0E0E'} />
              )}
              {tab.family === 'Ionicons' && (
                <Ionicons name={tab.icon as any} size={24} color={isActive ? 'white' : '#4A0E0E'} />
              )}
            </Animated.View>
            
            <Text
              style={[
                styles.label,
                { 
                  color: isActive ? '#D4AF37' : '#4A0E0E', 
                  opacity: isActive ? 1 : 0.85 
                },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    borderTopWidth: 2,
    borderColor: '#a02f10',
    backgroundColor: 'white',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  button: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: { 
    fontSize: 13, 
    fontWeight: 'bold', 
  },
  activeCircle: {
    position: 'absolute',
    top: 10,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#D4AF37',
    zIndex: -1,
    left: 0,
  },
});