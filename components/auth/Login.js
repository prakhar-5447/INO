import {
  StyleSheet,
  Text,
  View,
  TextInput,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import auth from '@react-native-firebase/auth';

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setlLoading] = useState(false);

  const login_auth = () => {
    setlLoading(true);
    auth()
      .signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed in
        const user = userCredential.user;
        console.log('logged in with :', auth().currentUser.email);
        setlLoading(false);
        navigation.replace('Profile');
      })
      .catch(error => {
        // createTwoButtonAlert()
        setPassword('');
        setlLoading(false);
        const errorCode = error.code;
        alert(error.message);
      });
  };

  return (
    <ImageBackground
      source={require('../../assets/image/bg.jpg')}
      resizeMode="cover"
      blurRadius={10}
      style={styles.image}>
      <View style={styles.body}>
        <Text style={[{fontFamily: 'AlegreyaSansSC-Bold', fontSize: 25}]}>
          Login
        </Text>
        <View style={[styles.form]}>
          <View style={styles.area}>
            <Text style={[styles.text]}>Email</Text>
            <TextInput
              value={email}
              style={[styles.input]}
              onChangeText={text => setEmail(text.trim())}
            />
          </View>
          <View style={styles.area}>
            <Text style={[styles.text]}>Password</Text>
            <TextInput
              secureTextEntry={true}
              value={password}
              style={styles.input}
              onChangeText={text => setPassword(text.trim())}
            />
          </View>
          <TouchableOpacity
            disabled={password.length < 6 && email.length !== 0}
            onPress={login_auth}>
            <Text
              style={[
                {
                  color: 'blue',
                  fontSize: 25,
                  textAlign: 'right',
                  marginTop: 20,
                  fontFamily: 'AlegreyaSansSC-Medium',
                },
              ]}>
              Login
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <Text
        style={[
          {
            fontFamily: 'AlegreyaSansSC-Regular',
            textAlign: 'center',
            fontSize: 20,
            marginBottom: 30,
          },
        ]}>
        Already have an account ?{' '}
        <Text
          style={[
            {
              color: 'blue',
            },
          ]}
          onPress={() => {
            navigation.replace('Signup');
          }}>
          Sign Up
        </Text>
      </Text>
      {loading && (
        <View style={[styles.centeredView]}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={loading}
            onRequestClose={() => {}}>
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: '#00000090',
                  paddingHorizontal: 30,
                },
              ]}></View>
          </Modal>
        </View>
      )}
    </ImageBackground>
  );
};

export default Login;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'space-between',
  },
  body: {
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  form: {
    paddingHorizontal: 30,
    marginTop: 200,
  },
  area: {
    marginVertical: 8,
  },
  text: {
    fontFamily: 'AlegreyaSansSC-Medium',
    fontSize: 17,
  },
  input: {
    borderColor: 'black',
    borderWidth: 1,
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
});
