import {StyleSheet} from 'react-native';
import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import User from './User';
import Search from './Search';
import Settting from './Settting';
import Followed from './Followed';
import CustomDrawer from '../mount/CustomDrawer';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Drawer = createDrawerNavigator();
const Profile = () => {
  return (
    <Drawer.Navigator
      drawerContent={props => <CustomDrawer {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveBackgroundColor: '#00468E',
        drawerActiveTintColor: 'white',
        drawerInactiveTintColor: 'black',
        drawerLabelStyle: {
          marginLeft: -20,
          fontSize: 20,
          fontFamily: 'AlegreyaSansSC-Medium',
        },
      }}>
      <Drawer.Screen
        options={{
          drawerIcon: ({color}) => (
            <FontAwesome5
              name={'user-circle'}
              style={[{marginHorizontal: 10}]}
              size={18}
              color={color}></FontAwesome5>
          ),
        }}
        name="user"
        component={User}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({color}) => (
            <FontAwesome5
              name={'search'}
              style={[{marginHorizontal: 10}]}
              size={18}
              color={color}></FontAwesome5>
          ),
        }}
        name="search"
        component={Search}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({color}) => (
            <FontAwesome5
              name={'users'}
              style={[{marginHorizontal: 10}]}
              size={15}
              color={color}></FontAwesome5>
          ),
        }}
        name="followed"
        component={Followed}
      />
      <Drawer.Screen
        options={{
          drawerIcon: ({color}) => (
            <FontAwesome5
              name={'cog'}
              style={[{marginHorizontal: 10}]}
              size={18}
              color={color}></FontAwesome5>
          ),
        }}
        name="setting"
        component={Settting}
      />
    </Drawer.Navigator>
  );
};
export default Profile;

const styles = StyleSheet.create({});
