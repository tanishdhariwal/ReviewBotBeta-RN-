import React from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';

const { width } = Dimensions.get('window');

const ProductAnalysis = () => {
  const router = useRouter();

  const product = {
    name: "Premium Wireless Headphones",
    price: "$149.99",
    reviewCount: "15,244 reviews",
    imageUrl: "https://img.freepik.com/free-vector/illustration-headphones-icon_53876-5571.jpg",
    metrics: [
      { name: "Quality", score: 85, color: ['#3498db', '#2980b9'] },
      { name: "Value for Money", score: 75, color: ['#2ecc71', '#27ae60'] },
      { name: "Customer Service", score: 92, color: ['#f1c40f', '#f39c12'] },
      { name: "Durability", score: 80, color: ['#9b59b6', '#8e44ad'] },
      { name: "Ease of Use", score: 88, color: ['#e74c3c', '#c0392b'] }
    ],
    summary: {
      reporter: 20,
      highlights: [
        "Premium build quality with excellent sound isolation",
        "Advanced noise cancellation technology",
        "30+ hours battery life",
        "Comfortable for long listening sessions"
      ]
    }
  };

  const RatingBar = ({ metric }) => (
    <View style={styles.metricContainer}>
      <View style={styles.metricHeader}>
        <Text style={styles.metricName}>{metric.name}</Text>
        <Text style={styles.metricScore}>{metric.score}%</Text>
      </View>
      <View style={styles.barContainer}>
        <LinearGradient
          colors={metric.color}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={[styles.bar, { width: `${metric.score}%` }]}
        />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
      <TouchableOpacity 
        style={styles.backButton}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="black" />
      </TouchableOpacity>

        <View style={styles.productSection}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.name}</Text>
            <Image
              source={{ uri: product.imageUrl }}
              style={styles.productImage}
              defaultSource={require('./../assets/images/image.png')}
            />
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{product.price}</Text>
              <Text style={styles.reviewCount}>{product.reviewCount}</Text>
            </View>
          </View>

          <View style={styles.summarySection}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Review Summary</Text>
              <View style={styles.reporterBadge}>
                <Text style={styles.reporterText}>Reporter {product.summary.reporter}%</Text>
              </View>
            </View>
            
            <View style={styles.highlightsContainer}>
              {product.summary.highlights.map((highlight, index) => (
                <Text key={index} style={styles.highlight}>• {highlight}</Text>
              ))}
            </View>
          </View>

          <View style={styles.metricsSection}>
            {product.metrics.map((metric, index) => (
              <RatingBar key={index} metric={metric} />
            ))}
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => router.replace('/chatbot')}
      >
        <MaterialCommunityIcons name="chat" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  brandName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  productSection: {
    padding: 16,
  },
  productInfo: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
    textAlign:'center'
  },
  productImage: {
    width: '100%',
    height: width * 0.6,
    resizeMode: 'contain',
    marginBottom: 16,
    backgroundColor: '#f8f9fa',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  reviewCount: {
    fontSize: 16,
    color: '#636e72',
  },
  summarySection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 10,
  },
  summaryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
  },
  reporterBadge: {
    backgroundColor: '#e84393',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reporterText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  highlightsContainer: {
    marginTop: 8,
  },
  highlight: {
    fontSize: 16,
    color: '#636e72',
    marginBottom: 8,
    lineHeight: 22,
  },
  metricsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  metricContainer: {
    marginBottom: 16,
  },
  metricHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  metricName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2d3436',
  },
  metricScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#636e72',
  },
  barContainer: {
    height: 8,
    backgroundColor: '#e1e4e8',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  chatButton: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    backgroundColor: '#6c5ce7',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});

export default ProductAnalysis;

