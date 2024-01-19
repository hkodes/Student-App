import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { SafeAreaView, StyleSheet, useColorScheme } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import Login from "./screens/login";
import Home from "./screens/home";
import React from "react";
import { firebase } from "@react-native-firebase/auth";
import firebaseConfig from "./screens/constant";


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const Stack = createStackNavigator();
  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen name="Auth" component={Login} options={{ headerShown: false }} />
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    </Stack.Navigator>
  </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
});

export default App;
