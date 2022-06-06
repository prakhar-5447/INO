import {StyleSheet, Text, Button, View} from 'react-native';
import React from 'react';
import auth from '@react-native-firebase/auth';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import User from './User';
import Search from './Search';
import Project from './Project';

const Tab = createBottomTabNavigator();
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
      <Tab.Screen
        options={{
          headerRight: () => (
            <Button
              style={[{marginRight: 10}]}
              onPress={logOut}
              title="Log out"
              color="black"
            />
          ),
        }}
        name="User"
        component={User}
      />
      <Tab.Screen
        options={{
          headerRight: () => (
            <Button
              style={[{marginRight: 10}]}
              onPress={logOut}
              title="Log out"
              color="black"
            />
          ),
        }}
        name="Find"
        component={Search}
      />
      <Tab.Screen
        options={{
          headerRight: () => (
            <Button
              style={[{marginRight: 10}]}
              onPress={logOut}
              title="Log out"
              color="black"
            />
          ),
        }}
        name="Project"
        component={Project}
      />
    </Tab.Navigator>
  );
};
export default Profile;

const styles = StyleSheet.create({});
