import {StyleSheet, Text, View, Button, TextInput} from 'react-native';
import React, {useState, useContext} from 'react';
import {AuthContext} from './AuthProvider';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import {TouchableOpacity} from 'react-native-gesture-handler';

const Signup = ({navigation}) => {
  const signup_auth = () => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed up
        const user = userCredential.user;
        setUser(user);
        navigation.replace('Profile');
        console.log('logged in with :', user.email);
        console.log(user);
        firestore()
          .collection('Users')
          .doc(user.uid)
          .set({
            email: user.email,
            phoneNumber: phoneNumber,
            displayName: displayName,
            uid: user.uid,
            profilePhoto:
              'https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2Fdefault.png?alt=media',
          })
          .then(() => {
            console.log('User added!');
          });
      })
      .catch(error => {
        console.log('User!');
        const errorCode = error.code;
        alert(error.message);
      });
  };
  const {setUser} = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [displayName, setDisplayName] = useState('');
  return (
    <View style={styles.body}>
      <View style={styles.signup}>
        <TextInput
          value={displayName}
          style={styles.input}
          onChangeText={text => setDisplayName(text)}
          placeholder={'Name'}
        />
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
        <TextInput
          value={phoneNumber}
          style={styles.input}
          onChangeText={text => setPhoneNumber(text)}
          placeholder={'Phone Number'}
        />
      </View>
      <View style={[{alignItems: 'center'}]}>
        <TouchableOpacity
          style={[
            {
              backgroundColor:
                email === '' ||
                password === '' ||
                phoneNumber === '' ||
                email === ''
                  ? 'transparent'
                  : 'blue',
              borderRadius: 5,
              borderColor:
                email === '' ||
                password === '' ||
                phoneNumber === '' ||
                displayName === ''
                  ? 'gray'
                  : 'lightblue',
              borderWidth: 1,
              paddingVertical: 8,
              paddingHorizontal: 40,
            },
          ]}
          onPress={signup_auth}>
          <Text
            style={[
              {
                color:
                  email === '' ||
                  password === '' ||
                  phoneNumber === '' ||
                  displayName === ''
                    ? 'blue'
                    : 'white',
                fontSize: 20,
              },
            ]}>
            Sign up
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.login}>
        <Text
          style={[styles.button, styles.text]}
          onPress={() => {
            navigation.replace('Login');
          }}>
          Already have an account
        </Text>
      </View>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  body: {
    paddingHorizontal: 20,
  },
  signup: {textAlign: 'center', marginVertical: 15},
  login: {padding: 5},
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
