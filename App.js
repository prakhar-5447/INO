import 'react-native-gesture-handler';
/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import Login from './components/auth/Login';
import Signup from './components/auth/Signup';
import auth from '@react-native-firebase/auth';
import Profile from './components/user/Profile';
import Data from './components/context/Data';
import ViewUser from './components/user/ViewUser';

const Stack = createStackNavigator();

const App = () => {
  return (
    <Data>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName={auth().currentUser ? 'Profile' : 'Login'}
          screenOptions={{
            headerShown: false,
          }}>
          <Stack.Screen name="Signup" component={Signup}></Stack.Screen>
          <Stack.Screen name="Login" component={Login}></Stack.Screen>
          <Stack.Screen name="Profile" component={Profile}></Stack.Screen>
          <Stack.Screen name="View" component={ViewUser}></Stack.Screen>
        </Stack.Navigator>
      </NavigationContainer>
    </Data>
  );
};

export default App;
