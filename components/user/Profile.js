import {StyleSheet, Text, Button, View} from 'react-native';
import React, {useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../auth/AuthProvider';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import User from './User';
import Search from './Search';
import Project from './Project';

const Tab = createBottomTabNavigator();
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
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, size, color}) => {
          let iconName;
          if (route.name === 'User') {
            iconName = 'user';
            size = focused ? 20 : 15;
            color = focused ? 'black' : 'gray';
          } else if (route.name === 'Find') {
            iconName = 'searchengin';
            size = focused ? 20 : 15;
            color = focused ? 'black' : 'gray';
          } else if (route.name === 'Project') {
            iconName = 'briefcase';
            size = focused ? 20 : 15;
            color = focused ? 'black' : 'gray';
          }
          return (
            <FontAwesome5
              name={iconName}
              size={size}
              color={color}></FontAwesome5>
          );
        },
      })}>
      <Tab.Screen name="User" component={User} />
      <Tab.Screen name="Find" component={Search} />
      <Tab.Screen name="Project" component={Project} />
    </Tab.Navigator>
  );
};
export default Profile;

const styles = StyleSheet.create({});
