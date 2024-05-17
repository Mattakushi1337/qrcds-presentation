import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Modal, Button } from 'react-native';
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import Svg, { Line } from 'react-native-svg';
import * as Animatable from 'react-native-animatable';
import { io } from 'socket.io-client';

const animations = [
  { to: { left: '42%', top: '15%' }, from: { left: '5%', top: '15%' }, easing: 'linear' },
  { to: { left: '40%', top: '49%' }, from: { left: '47%', top: '20%' }, easing: 'linear' },
  { from: { left: '40%', top: '49%' }, to: { left: '47%', top: '20%' }, easing: 'linear' },
  { to: { left: '80%', top: '15%' }, from: { left: '50%', top: '15%' }, easing: 'linear' },
];
const socket = io('wss://back.qrcds.site');

const App = () => {
  const [currentAnimation, setCurrentAnimation] = useState(0);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [animationData, setAnimationData] = useState({
    animation_1: null,
    animation_2: null,
    animation_3: null,
    animation_4: null,
  });

  const openModal = () => {
    setModalVisible(true);
  };
  const handleAnimationEnd = () => {
    console.log('Анимация завершена!');
  };
  const closeModal = () => {
    setModalVisible(false);
    setModalContent('');
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAnimation((prevAnimation) => (prevAnimation + 1) % animations.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    socket.on('animation_1', (data) => {
      console.log('Received animation_1 data:', data);
      setAnimationData((prevData) => ({ ...prevData, animation_1: JSON.stringify(data, null, 2) }));
    });

    socket.on('animation_2', (data) => {
      console.log('Received animation_2 data:', data);
      setAnimationData((prevData) => ({ ...prevData, animation_2: JSON.stringify(data, null, 2) }));
    });

    socket.on('animation_3', (data) => {
      console.log('Received animation_3 data:', data);
      setAnimationData((prevData) => ({ ...prevData, animation_3: JSON.stringify(data, null, 2) }));
    });

    socket.on('animation_4', (data) => {
      console.log('Received animation_4 data:', data);
      setAnimationData((prevData) => ({ ...prevData, animation_4: JSON.stringify(data, null, 2) }));
    });

    return () => {
      socket.off('animation_1');
      socket.off('animation_2');
      socket.off('animation_3');
      socket.off('animation_4');
    };
  }, []);

  const handleEnvelopePress = () => {
    if (currentAnimation === 0 && animationData.animation_1) {
      setModalContent(animationData.animation_1);
    } else if (currentAnimation === 1 && animationData.animation_2) {
      setModalContent(animationData.animation_2);
    } else if (currentAnimation === 2 && animationData.animation_3) {
      setModalContent(animationData.animation_3);
    } else if (currentAnimation === 3 && animationData.animation_4) {
      setModalContent(animationData.animation_4);
    }
    setModalVisible(true);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Svg height="100%" width="100%" style={styles.svg}>
          <Line x1="45%" y1="15%" x2="5%" y2="15%" stroke="black" strokeWidth="5" />
          <Line x1="46%" y1="20%" x2="40%" y2="53%" stroke="black" strokeWidth="5" />
          <Line x1="49%" y1="15%" x2="83%" y2="15%" stroke="black" strokeWidth="5" />
        </Svg>
        <Ionicons style={styles.phone} name="phone-portrait" />
        <Ionicons style={styles.newspaper} name="newspaper" />
        <Text style={styles.cmdb}>CMDB</Text>
        <Text style={styles.itsm}>ITSM</Text>
        <Animatable.View
          animation={animations[currentAnimation]}
          duration={4000}
          style={{
            position: 'absolute',
            opacity: 1,
          }}
        >
          <TouchableOpacity onPress={handleEnvelopePress}>
            <FontAwesome name="envelope" size={24} color="black" />
          </TouchableOpacity>
        </Animatable.View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={modalVisible}
          onRequestClose={closeModal}
        >
          <TouchableOpacity
            style={styles.modalContainer}
            activeOpacity={1}
            onPressOut={closeModal}
          >
            <View style={styles.modalContent}>
              <Text style={styles.modalText}>{modalContent}</Text>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    position: 'absolute',
    width: '30%',
    height: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    left: '35%',
    top: '20%',
    borderRadius: 20,
    borderWidth: 3,
    borderColor: 'orange',
  },
  closeButton: {
    backgroundColor: 'white',
    borderRadius: 60,
    padding: 10,
    width: 100,
    height: 40,
  },
  svg: {
    position: 'absolute',
    top: 0,
    left: 0,
  },
  phone: {
    top: 30,
    fontSize: 50,
    alignSelf: 'flex-start',
    position: 'absolute',
  },
  newspaper: {
    top: 30,
    fontSize: 50,
    left: 340,
    position: 'absolute',
  },
  cmdb: {
    top: 200,
    left: 260,
    fontSize: 24,
    padding: 10,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 20,
    position: 'absolute',
  },
  itsm: {
    top: 30,
    right: 50,
    fontSize: 24,
    padding: 10,
    borderWidth: 3,
    borderColor: 'black',
    borderRadius: 20,
    position: 'absolute',
  },
});

export default App;