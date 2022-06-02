import {StyleSheet, Text, Button, View} from 'react-native';
import React, {useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../auth/AuthProvider';
import {createMaterialBottomTabNavigator} from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Login from '../auth/Login';
import Signup from '../auth/Signup';

const Tab = createMaterialBottomTabNavigator();

const Profile = () => {
  const logOut = () => {
    auth()
      .signOut()
      .then(() => {
        setUser(null);
        console.log('logged out');
      })
      .catch(error => {
        // An error happened.
        const errorCode = error.code;
        alert(error.message);
      });
  };
  const {setUser} = useContext(AuthContext);

  return (
    <Tab.Navigator
      initialRouteName="Profile"
      activeColor="#e91e63"
      barStyle={{backgroundColor: 'tomato'}}>
      <Tab.Screen
        name="myProfile"
        component={Login}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="findProfile"
        component={Signup}
        options={{
          tabBarLabel: 'Find',
          tabBarIcon: ({color}) => (
            <MaterialCommunityIcons name="bell" color={color} size={26} />
          ),
        }}
      />
        </Tab.Navigator>
  );
};
export default Profile;

const styles = StyleSheet.create({});
