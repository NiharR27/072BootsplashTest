import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  Animated,
  Easing,
} from 'react-native';
import RootNavigator from './src/navigation/RootNavigator';
import Lottie from 'lottie-react-native';
import RNBootSplash from 'react-native-bootsplash';

const App = () => {
  const [animationIsVisible, setAnimationIsVisible] = React.useState(true);
  const ref = React.useRef<Lottie>(null);
  const progress = React.useRef<Animated.Value>(new Animated.Value(0));
  const opacity = React.useRef<Animated.Value>(new Animated.Value(1));

  React.useEffect(() => {
    // delay to ensure animation is loaded (see https://github.com/react-native-community/lottie-react-native/issues/274)
    const unsubscribe = setTimeout(() => {
      RNBootSplash.hide({fade: false}); // hide the bootsplash immediately, without any fade

      if (!progress.current) {
        return null;
      }

      Animated.sequence([
        Animated.timing(progress.current, {
          toValue: 1,
          useNativeDriver: true,
          duration: 2500, // I speed up the animation a bit
          easing: Easing.ease,
        }),
        Animated.timing(opacity.current, {
          delay: 250,
          toValue: 0,
          useNativeDriver: true,
          duration: 250,
          easing: Easing.in(Easing.ease),
        }),
      ]).start(() => {
        setAnimationIsVisible(false);
      });
    }, 500);

    return () => {
      clearTimeout(unsubscribe);
    };
  }, []);

  const renderApp = React.useMemo(() => {
    return (
      <View style={{flex: 1}}>
        <RootNavigator />
      </View>
    );
  }, []);

  return (
    <Animated.View style={{flex: 1}}>
      {renderApp}

      {animationIsVisible && (
        <Animated.View
          style={[
            StyleSheet.absoluteFill,
            // eslint-disable-next-line react-native/no-inline-styles
            {
              backgroundColor: '#000',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: opacity.current,
            },
          ]}>
          <Lottie
            ref={ref}
            source={require('./src/assets/lottie_animation.json')}
            loop={false}
            autoPlay
            // progress={progress.current}
            resizeMode="contain"
            style={{height: 300, width: 300}}
          />
        </Animated.View>
      )}
    </Animated.View>
  );
};

export default App;
