import React, {useEffect,useState,useRef} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Animated,Alert,Button} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
const Bubble = ({delay, startPosition})=> {
  const bubbleAnimation = new Animated.Value(0);
  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.timing(bubbleAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => {
        bubbleAnimation.setValue(0);
        animate();
      });
    };

    animate();
  }, [delay]);

  return (
    <Animated.View
      style={[
        styles.bubble,
        {
          left: startPosition,
          transform: [
            {
              translateY: bubbleAnimation.interpolate({
                inputRange: [0, 2],
                outputRange: [200, -150],
              }),
            },
            {
              scale: bubbleAnimation.interpolate({
                inputRange: [0, 0.2, 0.8, 1],
                outputRange: [0, 1, 1, 0],
              }),
            },
          ],
          opacity: bubbleAnimation.interpolate({
            inputRange: [0, 0.2, 0.8, 1],
            outputRange: [0, 0.5, 0.5, 0],
          }),
        },
      ]}
    />
  );
};



const HomeScreen = () => {
  const [barHeight,setHeight] = useState(0)
  let targetWater = 2000;
  const [currentWater,setWater] = useState(0);
  const UpdateWater = () =>{
    if(currentWater!=targetWater){
      setWater(currentWater+200);
      setHeight(barHeight+40)
    }
    else{
      console.log("Devam")
    }
  }
  
  const changeGlass = ()=>{
    <View>
      <Text>Taha</Text>
      <Text></Text>
      <Text></Text>
      <Text></Text>
    </View>
  }

  const waterAnimation = new Animated.Value(0);
  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.timing(waterAnimation, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(waterAnimation, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => animate());
    };

    animate();
  }, []);

  return (
    <View style={styles.container}>
      {/* Başlık */}
      <Text style={styles.title}>Günlük Su Takibi</Text>

      {/* Su Deposu Göstergesi */}
      <View style={styles.waterContainer}>
        <Text style={styles.waterText}>{(currentWater/targetWater)*100}%</Text>
        <LinearGradient
          colors={['#4FC3F7', '#2196F3', '#1976D2']}
          style={[styles.waterLevel,{height:barHeight}]}>
          <Animated.View
            style={[
              styles.wave,
              {
                transform: [
                  {
                    translateY: waterAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, 20],
                    }),
                  },
                ],
              },
            ]}
          />
          <Bubble delay={0} startPosition="20%" />
          <Bubble delay={0} startPosition="0%"/>
          <Bubble delay={0} startPosition="60%" />
          <Bubble delay={0} startPosition="80%" />
          <Bubble delay={0} startPosition="30%" />
        </LinearGradient>
      </View>

      {/* Butonlar */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={UpdateWater} style={styles.button}>
          <LinearGradient 
            colors={['#4FC3F7', '#2196F3']}
            style={styles.buttonGradient}>
            <Text  style={styles.buttonText}>💧 Su İç</Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <LinearGradient
            colors={['#4FC3F7', '#2196F3']}
            style={styles.buttonGradient}>
            <Text style={styles.buttonText} onPress={changeGlass}>🥤 Bardağı Değiştir</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 20,
    textAlign: 'center',
  },
  waterContainer: {
    width: '60%',
    alignSelf: 'center',
    flex: 0.6,
    borderWidth: 2,
    borderColor: '#2196F3',
    borderRadius: 20,
    marginVertical: 20,
    overflow: 'hidden',
    backgroundColor: '#E3F2FD',
  },
  waterText:{
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginTop: 250,
    zIndex: 1000,
  },
  waterLevel: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#2196F3',
    height:"0%"
  },
  wave: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 10,
  },
  bubble: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
  },
  buttonContainer: {
    flex: 0.3,
    justifyContent: 'center',
    gap: 15,
  },
  button: {
    borderRadius: 15,
    elevation: 3,
    overflow: 'hidden',
  },
  buttonGradient: {
    padding: 18,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default HomeScreen;