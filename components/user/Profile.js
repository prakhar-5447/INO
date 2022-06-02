import {StyleSheet, Text, Button, View} from 'react-native';
import React, {useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthContext} from '../auth/AuthProvider';

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
    <View>
      <Button title="Log out" onPress={logOut} />
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});
