import {
  StyleSheet,
  Text,
  View,
  Button,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useContext} from 'react';
import auth from '@react-native-firebase/auth';
import {AuthContext} from './AuthProvider';

const Login = ({navigation}) => {
  const login_auth = () => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        setUser(user);
        navigation.replace('Profile');
        console.log('logged in with :', user.email);
        console.log(user);
      })
      .catch(error => {
        const errorCode = error.code;
        alert(error.message);
      });
  };
  const {setUser} = useContext(AuthContext);
  const [email, setEmail] = useState('sahuprakhar022003@gmail.com');
  const [password, setPassword] = useState('jayomsahu2003');
  return (
    <View style={styles.body}>
      <View style={styles.login}>
        <TextInput
          value={email}
          style={[styles.input]}
          onChangeText={text => setEmail(text)}
          placeholder={'Email'}
        />
        <TextInput
          secureTextEntry={true}
          value={password}
          style={styles.input}
          onChangeText={text => setPassword(text)}
          placeholder={'Password'}
        />
      </View>
      <View style={styles.login}>
        <View style={[{alignItems: 'center'}]}>
          <TouchableOpacity
            style={[
              {
                backgroundColor:
                  email === '' || password === '' ? 'transparent' : 'blue',
                borderRadius: 5,
                borderColor:
                  email === '' || password === '' ? 'gray' : 'lightblue',
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 40,
              },
            ]}
            onPress={login_auth}>
            <Text
              style={[
                {
                  color: email === '' || password === '' ? 'blue' : 'white',
                  fontSize: 20,
                },
              ]}>
              Log in
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[styles.button, styles.text]}
          onPress={() => {
            navigation.replace('Signup');
          }}>
          Create an account
        </Text>
      </View>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
  },
  login: {textAlign: 'center', marginVertical: 15},
  signup: {padding: 5},
  input: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    fontSize: 16,
  },

  text: {
    color: 'blue',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontSize: 20,
    marginTop: 10,
  },
});
