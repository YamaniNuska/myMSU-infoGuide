import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function ProfileScreen() {
  return (
    <View style={styles.container}>
      {/* Header / Avatar Section */}
      <View style={styles.header}>
        <View style={styles.avatarPlaceholder}>
          <FontAwesome name="user" size={36} color="#D4AF37" />
        </View>
        <Text style={styles.userName}>John Doe</Text>
        <Text style={styles.userEmail}>john.doe@example.com</Text>
      </View>

      {/* Menu Options */}
      <View style={styles.menu}>
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
          <Ionicons name="settings-outline" size={22} color="#4A0E0E" />
          <Text style={styles.menuText}>Settings</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
          <Ionicons name="shield-checkmark-outline" size={22} color="#4A0E0E" />
          <Text style={styles.menuText}>Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuItem} activeOpacity={0.6}>
          <Ionicons name="help-circle-outline" size={22} color="#4A0E0E" />
          <Text style={styles.menuText}>Support</Text>
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={[styles.menuItem, styles.logoutButton]} activeOpacity={0.6}>
          <Ionicons name="log-out-outline" size={22} color="#a02f10" />
          <Text style={[styles.menuText, styles.logoutText]}>Log Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 30,
  },
  avatarPlaceholder: {
    width: 84, 
    height: 84, 
    borderRadius: 42,
    backgroundColor: '#fffaf0',
    borderWidth: 1.5,
    borderColor: '#e6d8b8', 
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000000',
  },
  userEmail: {
    fontSize: 15,
    color: '#555555', 
    marginTop: 4,
    fontWeight: '500', 
  },
  menu: {
    paddingHorizontal: 40,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 18, 
  },
  menuText: {
    fontSize: 17, // Bumped up
    marginLeft: 15,
    color: '#1A1A1A',
    fontWeight: '500',
  },
  logoutButton: {
    marginTop: 20,
  },
  logoutText: {
    color: '#a02f10',
    fontWeight: '600',
  },
});