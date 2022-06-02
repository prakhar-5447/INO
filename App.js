import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React, {useContext} from 'react';
import {StyleSheet, Button, Text, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import auth from '@react-native-firebase/app';
import Profile from './components/user/Profile';
import {AuthContext, AuthProvider} from './components/auth/AuthProvider';

function HomeScreen({navigation}) {
  const {user} = useContext(AuthContext);
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        onPress={() => {
          if (user) navigation.navigate('Profile');
          else navigation.navigate('Login');
        }}
        title="Welcome to INO"
      />
    </View>
  );
}

const Stack = createStackNavigator();

const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="INO" component={HomeScreen}></Stack.Screen>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Signup" component={Signup}></Stack.Screen>
          <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

const styles = StyleSheet.create({});

export default App;
