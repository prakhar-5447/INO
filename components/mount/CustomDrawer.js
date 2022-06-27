import {StyleSheet, View, Text, ImageBackground, Image} from 'react-native';
import React, {useContext} from 'react';
import {
  DrawerContentScrollView,
  DrawerItemList,
} from '@react-navigation/drawer';
import auth from '@react-native-firebase/auth';
import Context from '../context/Context';

const CustomDrawer = props => {
  const {profile} = useContext(Context);

  const logOut = () => {
    props.navigation.replace('Login');
    auth()
      .signOut()
      .then(() => {
        console.log('Logged out');
      })
      .catch(error => {
        // An error happened.
        props.navigation.replace('Profile');
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
            uri: profile.profilePhoto,
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
