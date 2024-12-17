import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProduct } from '../apiComms';

const { width } = Dimensions.get('window');

const ProductAnalysis = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        let asin = await AsyncStorage.getItem('asin');
        const productData = await getProduct(asin); // Use the provided ASIN
        setProduct(productData);
      } catch (error) {
        console.error('Failed to fetch product details:', error);
      }
    };

    fetchProduct();
  }, []);

  if (!product) {
    return <Text>Loading...</Text>;
  }

  const getSentimentColor = (sentiment) => {
    switch (sentiment) {
      case 'POSITIVE':
        return 'green';
      case 'MIXED':
        return 'orange';
      case 'NEGATIVE':
        return 'red';
      default:
        return 'gray';
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
            <Text style={styles.productName}>{product.title}</Text>
            <Image
              source={{ uri: product.image_url[0] }}
              style={styles.productImage}
              defaultSource={require('./../assets/images/image.png')}
            />
            <View style={styles.priceContainer}>
              <Text style={styles.price}>{product.price}</Text>
              <Text style={styles.reviewCount}>{product.ratings_distribution.length} reviews</Text>
            </View>
          </View>

          <View style={styles.summarySection}>
            <View style={styles.summaryHeader}>
              <Text style={styles.summaryTitle}>Review Summary</Text>
              <View style={styles.reporterBadge}>
                <Text style={styles.reporterText}>Rating {product.average_rating}</Text>
              </View>
            </View>
            
            <View style={styles.highlightsContainer}>
              <Text style={styles.highlight}>{product.review_summary}</Text>
            </View>
          </View>

          <View style={styles.metricsSection}>
            {product.ratings_distribution.map((metric, index) => (
              <RatingBar key={index} metric={{ name: `Rating ${metric.rating}`, score: metric.distribution, color: ['#3498db', '#2980b9'] }} />
            ))}
          </View>

          {product.customer_sentiments && product.customer_sentiments.length > 0 && (
            <View style={styles.sentimentsSection}>
              <Text style={styles.sentimentsTitle}>Customer Sentiments</Text>
              {product.customer_sentiments.map((sentiment, index) => (
                <Text key={index} style={styles.sentimentText}>
                  {sentiment.title} : <Text style={{ color: getSentimentColor(sentiment.sentiment) }}>{sentiment.sentiment}</Text>
                </Text>
              ))}
            </View>
          )}
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
  sentimentsSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sentimentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2d3436',
    marginBottom: 12,
  },
  sentimentText: {
    fontSize: 16,
    marginBottom: 8,
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

