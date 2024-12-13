import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProductSection from '../components/ProductSection';

export default function TopRatedProducts() {
  return (
    <LinearGradient
      colors={['#4A00E0', '#8E2DE2']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>Top Rated Products</Text>
        <ProductSection title="Electronics" />
        <ProductSection title="Home & Kitchen" />
        <ProductSection title="Fashion" />
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    color: 'white',
    marginBottom: 30,
    fontFamily: 'outfit-Bold',
  },
});

