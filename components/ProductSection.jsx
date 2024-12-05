import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const ProductSection = ({ title }) => {
  // Hardcoded product data for demonstration
  const products = [
    { id: 1, name: 'Product 1', image: 'https://via.placeholder.com/100' },
    { id: 2, name: 'Product 2', image: 'https://via.placeholder.com/100' },
    { id: 3, name: 'Product 3', image: 'https://via.placeholder.com/100' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.productList}>
        {products.map((product) => (
          <TouchableOpacity key={product.id} style={styles.productItem}>
            <Image source={{ uri: product.image }} style={styles.productImage} />
            <Text style={styles.productName}>{product.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 30,
    width: width * 0.9,
    maxWidth: 400,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  productList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  productItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 10,
    padding: 10,
    width: '30%',
  },
  productImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginBottom: 5,
  },
  productName: {
    color: 'white',
    textAlign: 'center',
    fontSize: 12,
  },
});

export default ProductSection;

