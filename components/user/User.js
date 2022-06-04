import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../auth/AuthProvider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

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
        setLink('');
        setSocial('');
        click();
      });
  };

  const deleteSocial = e => {
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
      <View style={styles.info}>
        <Text style={[styles.text, styles.name]}>{profile.displayName}</Text>
        <View style={styles.details}>
          <View style={styles.detail}>
            <FontAwesome5
              name={'envelope'}
              size={18}
              color={'black'}></FontAwesome5>
            <Text style={styles.text}>{profile.email}</Text>
          </View>
          <View style={styles.detail}>
            <FontAwesome5
              name={'mobile'}
              style={{marginLeft: 3}}
              size={20}
              color={'black'}></FontAwesome5>
            <Text style={styles.text}>{profile.phoneNumber}</Text>
          </View>
        </View>
      </View>
      <View style={[{flexDirection: 'row', marginVertical: 16}]}>
        <View style={[{flexDirection: 'row', flex: 8}]}>
          <TextInput
            value={social}
            style={[styles.input, {flex: 1}]}
            onChangeText={text => setSocial(text)}
            placeholder={'Tag'}
          />
          <TextInput
            value={link}
            style={[styles.input, {flex: 3}]}
            onChangeText={text => setLink(text)}
            placeholder={'Paste your link here'}
          />
        </View>
        <TouchableOpacity
          disabled={link === '' || social === ''}
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              backgroundColor:
                link === '' || social === '' ? 'transparent' : 'lightgreen',
              borderRadius: 5,
              alignItems: 'center',
              borderColor: link === '' || social === '' ? 'gray' : 'green',
              borderWidth: 1,
              marginVertical: 4.5,
              marginRight: 4,
            },
          ]}
          onPress={addSocial}>
          <FontAwesome5 name={'check'} size={16} color={'black'}></FontAwesome5>
        </TouchableOpacity>
      </View>
      <View>
        {socials &&
          socials.map(function (e, i) {
            return (
              <View
                key={i}
                style={[
                  {
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginHorizontal: 130,
                    paddingHorizontal: 10,
                    borderRadius: 30,
                    paddingVertical: 8,
                    margin: 6,
                    borderWidth: 2,
                    borderColor: 'gray',
                    backgroundColor: 'lightgray',
                  },
                ]}>
                <Text
                  style={[
                    {
                      marginLeft: 10,
                      fontSize: 16,
                      textTransform: 'uppercase',
                      flex: 5,
                      color: 'black',
                    },
                  ]}
                  onPress={() => Linking.openURL(e.url)}>
                  {e.social}
                </Text>
                <TouchableOpacity
                  style={[
                    {
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => {
                    deleteSocial(e);
                  }}>
                  <FontAwesome5
                    name={'trash'}
                    size={12}
                    color={'black'}></FontAwesome5>
                </TouchableOpacity>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  name: {
    textTransform: 'uppercase',
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    fontSize: 16,
  },
  info: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  text: {
    fontSize: 24,
  },
});
