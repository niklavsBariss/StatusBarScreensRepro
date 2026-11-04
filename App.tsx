import React from 'react';
import { Appearance, StatusBar, StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

const USE_SCREENS = true;
Appearance.setColorScheme('light');

const Stack = createStackNavigator();

function HomeScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.text}>Status bar text should be dark</Text>
      <Text style={styles.text}>USE_SCREENS = {String(USE_SCREENS)}</Text>
    </View>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView style={styles.root}>
      <StatusBar barStyle="dark-content" />
      <NavigationContainer>
        <Stack.Navigator
          detachInactiveScreens={USE_SCREENS}
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Home" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  screen: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#808080',
  },
  text: { color: '#000', fontSize: 18, marginVertical: 4 },
});
