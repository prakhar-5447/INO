import {StyleSheet, Text, View} from 'react-native';
import React, {useContext} from 'react';
import {AuthContext} from '../auth/AuthProvider';

const User = () => {
  const {user} = useContext(AuthContext);
    return (
    <View>
      <Text>User</Text>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({});
