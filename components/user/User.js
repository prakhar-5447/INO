import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../auth/AuthProvider';

const User = () => {
  const {user} = useContext(AuthContext);
  const [link, setLink] = useState('');
  const [social, setSocial] = useState('');
  const [profile, setProfile] = useState({
    email: '',
    displayName: '',
    phoneNumber: '',
  });
  const [socials, setSocials] = useState([]);
  const click = async () => {
    const userData = await firestore().collection('Users').doc(user.uid).get();
    // console.log(userData._data);
    const {phoneNumber, displayName, email, platform} = userData._data;
    // console.log(platform);
    setProfile({phoneNumber, displayName, email});
    setSocials(platform);
    // console.log(socials);
  };
  const addSocial = () => {
    firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        platform: firestore.FieldValue.arrayUnion({social: social, url: link}),
      })
      .then(() => {
        // console.log('New Social added');
        click();
      });
  };

  const deleteSocial = e => {
    console.log(e + ' deleted');
    firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        platform: firestore.FieldValue.arrayRemove(e),
      })
      .then(() => {
        // console.log('Social deleted');
        click();
      });
  };

  useEffect(() => {
    click();
  }, []);

  return (
    <View styles={styles.body}>
      <Text>Hello {profile.displayName}</Text>
      <Text>Hello {profile.email}</Text>
      <Text>Hello {profile.phoneNumber}</Text>
      <View>
        <TextInput
          value={social}
          style={[styles.input]}
          onChangeText={text => setSocial(text)}
          placeholder={'social'}
        />
        <TextInput
          value={link}
          style={[styles.input]}
          onChangeText={text => setLink(text)}
          placeholder={'url'}
        />
        <Button title="Add" style={styles.button} onPress={addSocial} />
        <View>
          {socials &&
            socials.map(function (e, i) {
              return (
                <View key={i}>
                  <View>
                    <Text>{e.social}</Text>
                    <Text>{e.url}</Text>
                    <Button
                      title="Delete"
                      style={styles.button}
                      onPress={() => {
                        deleteSocial(e);
                      }}
                    />
                  </View>
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  input: {padding: 10, marginVertical: 5},

  text: {
    color: 'blue',
    justifyContent: 'center',
    alignContent: 'center',
    textAlign: 'center',
    fontSize: 20,
  },
});
