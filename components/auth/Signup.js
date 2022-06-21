import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const Signup = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [cpassword, setCpassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [filePath, setFilePath] = useState(null);

  const signup_auth = (file_name, ext) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then(userCredential => {
        // Signed up
        const user = userCredential.user;
        console.log('logged in with :', user.email);
        console.log(user);
        firestore()
          .collection('Users')
          .doc(user.uid)
          .set({
            email: email,
            displayName: displayName.toLowerCase().trim(),
            uid: user.uid,
            profilePhoto: `https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2FProfilePhoto%2F${file_name}.${ext}?alt=media`,
          })
          .then(() => {
            console.log('User added!');
            navigation.replace('Profile');
          });
      })
      .catch(error => {
        var desertRef = storage().refFromURL(
          `https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2FProfilePhoto%2F${file_name}.${ext}?alt=media`,
        );

        // Delete the file
        desertRef.delete().then(() => {});
        const errorCode = error.code;
        alert(error.message);
      });
  };

  const _chooseFile = async () => {
    // Opening Document Picker to select one file
    try {
      const fileDetails = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      console.log('fileDetails : ' + JSON.stringify(fileDetails));
      // Setting the state for selected File
      setFilePath(fileDetails[0]);
    } catch (error) {
      setFilePath({});
      // If user canceled the document selection
      alert(
        DocumentPicker.isCancel(error)
          ? 'Canceled'
          : 'Unknown Error: ' + JSON.stringify(error),
      );
    }
  };

  const _uploadFile = async e => {
    try {
      // Check if file selected
      console.log(filePath);
      if (Object.keys(filePath).length === 0)
        return alert('Please Select any File');

      // Create Reference
      var ext = filePath.name.substr(filePath.name.lastIndexOf('.') + 1);
      var file_name = email.slice(0, email.lastIndexOf('@'));
      const reference = storage().ref(
        `/myFiles/ProfilePhoto/${file_name}.${ext}`,
      );

      //Put File
      const data = await RNFS.readFile(filePath.uri, 'base64');
      const task = reference.putString(data, 'base64');

      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(() => {
        signup_auth(file_name, ext);
        setFilePath(null);
      });
    } catch (error) {
      console.log('Error->', error);
      console.log('task failed');
      alert(`Error-> ${error}`);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/image/bg.jpg')}
      resizeMode="cover"
      blurRadius={10}
      style={styles.image}>
      <View style={styles.body}>
        <Text style={[{fontFamily: 'AlegreyaSansSC-Bold', fontSize: 25}]}>
          Signup
        </Text>
        <View style={[styles.form]}>
          <View style={[{alignItems: 'center'}]}>
            <TouchableOpacity
              style={[
                {
                  width: 150,
                  height: 150,
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginBottom: 30,
                  borderColor: 'black',
                  borderWidth: 1.5,
                  borderRadius: 100,
                  borderStyle: 'dashed',
                },
              ]}
              onPress={_chooseFile}>
              {!filePath ? (
                <Text
                  style={[
                    {fontFamily: 'AlegreyaSansSC-Regular', fontSize: 20},
                  ]}>
                  Selct image
                </Text>
              ) : (
                <Image
                  style={{height: '100%', width: '100%', borderRadius: 100}}
                  source={{uri: filePath.uri}}></Image>
              )}
            </TouchableOpacity>
          </View>
          <View style={styles.area}>
            <Text style={[styles.text]}>Name</Text>
            <TextInput
              value={displayName}
              style={styles.input}
              onChangeText={text => setDisplayName(text)}
            />
          </View>
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
          <View style={styles.area}>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text style={[styles.text]}>Confirm Password</Text>
              {cpassword.length > 0 && password !== cpassword && (
                <Text
                  style={{color: 'red', fontFamily: 'AlegreyaSansSC-Regular'}}>
                  Password do not match
                </Text>
              )}
            </View>
            <TextInput
              secureTextEntry={true}
              value={cpassword}
              style={styles.input}
              onChangeText={text => setCpassword(text.trim())}
            />
          </View>
          <Text
            style={[
              {
                color: 'blue',
                fontSize: 25,
                textAlign: 'right',
                marginTop: 20,
                fontFamily: 'AlegreyaSansSC-Medium',
              },
            ]}
            onPress={_uploadFile}>
            Sign up
          </Text>
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
            navigation.replace('Login');
          }}>
          Login
        </Text>
      </Text>
    </ImageBackground>
  );
};

export default Signup;

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
    marginTop: 50,
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
