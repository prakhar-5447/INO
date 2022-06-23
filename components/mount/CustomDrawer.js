import {StyleSheet, View, Text, ImageBackground, Image} from 'react-native';
import React from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';

const CustomDrawer = (props, {navigation}) => {
  const logOut = () => {
    auth()
      .signOut()
      .then(() => {
        console.log('Logged out');
        navigation.replace('Login');
      })
      .catch(error => {
        // An error happened.
        const errorCode = error.code;
        alert(error.message);
      });
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        style={[{height: 250, width: '100%', justifyContent: 'flex-end'}]}
        source={require('../../assets/image/drawer_bg.jpg')}>
        <Image
          style={[{height: 110, width: 110, borderRadius: 100, marginLeft: 10}]}
          source={{
            uri: 'https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80',
          }}
        />
        <Text
          style={[
            {
              fontFamily: 'AlegreyaSansSC-Medium',
              color: 'white',
              textAlign: 'right',
              margin: 10,
              fontSize: 16,
            },
          ]}>
          Uid: 823092830923434348
        </Text>
      </ImageBackground>
      <DrawerContentScrollView contentContainerStyle={{}} {...props}>
        <View
          style={[
            {
              flex: 1,
              marginTop: 25,
              justifyContent: 'center',
            },
          ]}>
          <DrawerItemList {...props} />
        </View>
      </DrawerContentScrollView>
      <View
        style={[
          {jusifyContent: 'center', alignItem: 'center', marginBottom: 15},
        ]}>
        <Text
          style={[
            {
              fontFamily: 'AlegreyaSansSC-Medium',
              fontSize: 25,
              textAlign: 'center',
            },
          ]}
          onPress={logOut}>
          Log out
        </Text>
      </View>
    </View>
  );
};

export default CustomDrawer;

const styles = StyleSheet.create({});
