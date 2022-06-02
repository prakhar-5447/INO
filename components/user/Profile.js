import {StyleSheet, Text, Button, View} from 'react-native';
import React, {useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../auth/AuthProvider';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Login from '../auth/Login';
import Signup from '../auth/Signup';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
            iconName = 'autoprefixer';
            size = focused ? 20 : 15;
            color = focused ? 'black' : 'gray';
          } else if (route.name === 'Find') {
            iconName = 'searchengin';
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
      <Tab.Screen name="User" component={Login} />
      <Tab.Screen name="Find" component={Signup} />
    </Tab.Navigator>
  );
};
export default Profile;

const styles = StyleSheet.create({});
