import React, { useEffect, useState } from 'react';
import { ScrollView, View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, Modal, FlatList, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getProduct, getUserChats, deleteUserChat } from '../apiComms';

const { width, height } = Dimensions.get('window');

const ProductAnalysis = () => {
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userChats, setUserChats] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

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

  const fetchUserChats = async () => {
    try {
      const response = await getUserChats();
      setUserChats(response);
      setModalVisible(true);
    } catch (error) {
      console.error('Failed to fetch user chats:', error);
    }
  };

  const handleChatPress = async (asin) => {
    await AsyncStorage.setItem('asin', asin);
    setModalVisible(false);
    router.replace('/ProductAnalysis');
  };

  const handleDeleteChat = async (asin) => {
    try {
      await deleteUserChat(asin);
      setUserChats(userChats.filter(chat => chat.product_asin_no !== asin));
    } catch (error) {
      console.error('Failed to delete chat:', error);
    }
  };

  const handleNextImage = () => {
    setCurrentImageIndex((currentImageIndex + 1) % product.image_url.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((currentImageIndex - 1 + product.image_url.length) % product.image_url.length);
  };

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
    <LinearGradient
      colors={['#1a1a1a', '#000000']}
      style={styles.container}
    >
      <ScrollView>

        <View style={styles.productSection}>
          <View style={styles.productInfo}>
            <Text style={styles.productName}>{product.title}</Text>
            <View style={styles.carouselContainer}>
              <TouchableOpacity onPress={handlePrevImage} style={styles.carouselButton}>
                <Ionicons name="chevron-back" size={24} color="#FFFFFF" />
              </TouchableOpacity>
              <Image
                source={{ uri: product.image_url[currentImageIndex] }}
                style={styles.productImage}
                defaultSource={require('./../assets/images/image.png')}
              />
              <TouchableOpacity onPress={handleNextImage} style={styles.carouselButton}>
                <Ionicons name="chevron-forward" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
            <View style={styles.priceContainer}>
              <Text style={styles.priceLabel}>Price :</Text>
              <Text style={styles.price}>{product.price}</Text>
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
                <View key={index} style={styles.sentimentItem}>
                  <Text style={styles.sentimentText}>
                    <Text style={styles.sentimentCategory}>{sentiment.title}</Text><Text style={styles.sentimentCategory}>:</Text> <Text style={{ color: getSentimentColor(sentiment.sentiment) }}>{sentiment.sentiment}</Text>
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
      <TouchableOpacity
        style={styles.chatButton}
        onPress={() => router.push('/chatbot')}
      >
        <LinearGradient
          colors={['#00FFEF', '#00BFFF']}
          style={styles.chatButtonGradient}
        >
          <MaterialCommunityIcons name="chat" size={24} color="#000" />
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.userChatsButton}
        onPress={fetchUserChats}
      >
        <LinearGradient
          colors={['#00FFEF', '#00BFFF']}
          style={styles.chatButtonGradient}
        >
          <MaterialCommunityIcons name="history" size={24} color="#000" />
        </LinearGradient>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Previous Chats</Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Ionicons name="close" size={24} color="#00FFEF" />
              </TouchableOpacity>
            </View>
            <FlatList
              data={userChats}
              keyExtractor={(item) => item.product_asin_no}
              renderItem={({ item }) => (
                <View style={styles.chatTile}>
                  <TouchableOpacity 
                    style={styles.chatTileContent}
                    onPress={() => handleChatPress(item.product_asin_no)}
                  >
                    <View>
                      <Text style={styles.chatTitle}>{item.title}</Text>
                      <Text style={styles.chatDate}>{new Date(item.created_at).toLocaleDateString()}</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteChat(item.product_asin_no)}
                  >
                    <Ionicons name="trash" size={20} color="cyan" />
                  </TouchableOpacity>
                </View>
              )}
              style={styles.chatList}
            />
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? height * 0.02 : 0, // Add top padding
  },
  productSection: {
    padding: 16,
    paddingTop: height * 0.1, // Increased top padding to accommodate the back button
  },
  productInfo: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#00FFEF',
    marginBottom: 12,
    textAlign: 'center',
  },
  carouselContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  carouselButton: {
    padding: 10,
  },
  productImage: {
    width: width * 0.8,
    height: width * 0.6,
    resizeMode: 'contain',
    backgroundColor: '#FFFFFF',
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  priceLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  price: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  summarySection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'android' ? height * 0.05 : height * 0.03, // Adjusted for padding
    left: 20,
    zIndex: 10,
  },
  backButtonCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
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
    color: '#FFFFFF',
  },
  reporterBadge: {
    backgroundColor: '#00FFEF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  reporterText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  highlightsContainer: {
    marginTop: 8,
  },
  highlight: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 8,
    lineHeight: 22,
  },
  metricsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    padding: 16,
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
    color: '#FFFFFF',
  },
  metricScore: {
    fontSize: 16,
    fontWeight: '600',
    color: '#00FFEF',
  },
  barContainer: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
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
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  chatButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userChatsButton: {
    position: 'absolute',
    left: 20,
    bottom: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '50%',
    maxHeight: '80%',
    width: '100%',
    paddingBottom: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
  },
  modalTitle: {
    fontSize: 22,
    color: '#00FFEF',
    fontFamily: "outfit-Bold",
  },
  closeButton: {
    padding: 5,
  },
  chatList: {
    marginTop: 10,
  },
  chatTile: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  chatTileContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  deleteButton: {
    padding: 10,
  },
  chatTitle: {
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 4,
    fontFamily: "outfit-Regular",
  },
  chatDate: {
    fontSize: 14,
    color: '#888888',
    fontFamily: "outfit-Regular",
  },
  sentimentsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    marginBottom: 16,
  },
  sentimentsTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  sentimentItem: {
    marginBottom: 8,
  },
  sentimentTitle: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  sentimentText: {
    fontSize: 16,
    fontWeight: '600',
  },
  sentimentCategory: {
    color: '#FFFFFF',
  },
});

export default ProductAnalysis;

