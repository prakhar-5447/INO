import {StyleSheet, Text, Button, View} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {createDrawerNavigator} from '@react-navigation/drawer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import User from './User';
import Search from './Search';
import Settting from './Settting';
import Followed from './Project';

const Drawer = createDrawerNavigator();
const Profile = ({navigation}) => {
  const logOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('Logged out');
        if (!auth().currentUser) {
          navigation.replace('Login');
        }
      })
      .catch(error => {
        // An error happened.
        const errorCode = error.code;
        alert(error.message);
      });
  };

  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Drawer.Screen name="user" component={User} />
      <Drawer.Screen name="search" component={Search} />
      <Drawer.Screen name="followed" component={Followed} />
      <Drawer.Screen name="setting" component={Settting} />
    </Drawer.Navigator>
  );
};
export default Profile;

const styles = StyleSheet.create({});
