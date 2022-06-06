import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import auth from '@react-native-firebase/auth';
import Profile from './components/user/Profile';

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        onPress={async () => {
          if (auth().currentUser) {
            // console.log(auth().currentUser);
            navigation.navigate('Profile');
          } else navigation.navigate('Login');
        }}
        title="Welcome to INO"
      />
    </View>
  );
}

const Stack = createStackNavigator();

const App = () => {
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="INO" component={HomeScreen}></Stack.Screen>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Signup" component={Signup}></Stack.Screen>
          <Stack.Screen
            name="Profile"
            options={{headerShown: false}}
            component={Profile}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
  );
};

const styles = StyleSheet.create({});

export default App;
