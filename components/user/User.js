import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Linking,
} from 'react-native';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import DocumentPicker from 'react-native-document-picker';
import React, {useState, useEffect, useContext} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNFS from 'react-native-fs';
import Context from '../context/Context';

const User = ({navigation}) => {
  const {get_data, profile, platform} = useContext(Context);

  const addSocial = platform => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .set({
        platform: platform,
      })
      .then(() => {
        get_data();
      });
  };

  useEffect(() => {
    get_data();
  }, []);

  return (
    <View
      style={[
        {
          backgroundColor: 'white',
        },
      ]}>
      <View style={[styles.header]}>
        <View>
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'center',
              },
            ]}>
            <Text style={[styles.socials, {marginRight: 5}]}>Socials</Text>
            <TouchableOpacity>
              <FontAwesome5
                name={'plus-circle'}
                size={14}
                color={'#2FC1E4'}></FontAwesome5>
            </TouchableOpacity>
          </View>
          <View style={[styles.links]}>
            <Text style={[styles.link]}>Instagram</Text>
            <Text style={[styles.link]}>Twitter</Text>
            <Text style={[styles.link]}>Github</Text>
            <Text style={[styles.link]}>Linkedin</Text>
          </View>
        </View>
        <View>
          <Image style={[styles.image]} source={{uri: profile.profilePhoto}} />
          <Text
            style={[
              styles.socials,
              {textAlign: 'center', fontSize: 30, marginBottom: 0},
            ]}>
            {profile.displayName}
          </Text>
        </View>
        <View>
          <Text style={[styles.socials, {textAlign: 'right'}]}>Links</Text>
          <View style={[styles.others]}>
            <Text style={[styles.link, {textAlign: 'right'}]}>Portfolio</Text>
            <Text style={[styles.link, {textAlign: 'right'}]}>Other</Text>
          </View>
        </View>
      </View>
      <View
        style={[
          {
            marginHorizontal: 55,
            justifyContent: 'center',
          },
        ]}>
        <View
          style={[
            {
              alignItems: 'flex-end',
            },
          ]}>
          <TouchableOpacity>
            <FontAwesome5
              name={'comment-alt'}
              size={14}
              color={'#2FC1E4'}></FontAwesome5>
          </TouchableOpacity>
        </View>
        <View>
          <Text
            style={[
              {
                textAlign: 'center',
                fontSize: 18,
                fontFamily: 'AlegreyaSansSC-Regular',
              },
            ]}>
            {profile.description}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  socials: {
    fontFamily: 'AlegreyaSansSC-Medium',
    fontSize: 25,
    marginBottom: 5,
  },
  links: {
    borderLeftWidth: 1.5,
    paddingLeft: 10,
  },
  link: {
    fontFamily: 'AlegreyaSansSC-Regular',
    fontSize: 18,
  },
  others: {
    borderRightWidth: 1.5,
    paddingRight: 10,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 25,
  },
});
