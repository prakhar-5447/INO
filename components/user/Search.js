import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  Button,
  Image,
  TouchableOpacity,
  TextInput,
  Linking,
  ImageBackground,
} from 'react-native';
import React, {useContext, useEffect, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import Context from '../context/Context';

const Search = () => {
  const {profile} = useContext(Context);
  const [allUser, setAllUser] = useState([]);
  const [user, setUser] = useState([]);

  const fetchAll = () => {
    const result = [];
    firestore()
      .collection('Users')
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // console.log('MedData', doc.data().platform);
          result.push(doc.data());
        });
        setAllUser(result);
      });
  };

  fetch = text => {
    let temp = allUser.filter(e => {
      return e.displayName.includes(text) && e.uid !== profile.uid;
    });
    setUser(temp);
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <ImageBackground
      resizeMode="cover"
      source={require('../../assets/image/search_bg.jpg')}
      style={[styles.image]}>
      <TextInput
        onChangeText={text => {
          if (text.trim().length) {
            fetch(text.toLowerCase());
          } else {
            setUser([]);
          }
        }}
        style={[{backgroundColor: 'white', borderRadius: 5}]}></TextInput>
      <ScrollView style={[{flex: 1, paddingVertical: 20}]}>
        {user.length > 0 &&
          user.map((e, i) => (
            <View key={i} style={[{flexDirection: 'row', marginVertical: 10}]}>
              <Image
                style={[
                  {
                    height: 75,
                    width: 75,
                    borderRadius: 40,
                    borderWidth: 0.5,
                    borderColor: 'black',
                  },
                ]}
                source={{uri: e.profilePhoto}}></Image>
              <View
                style={[
                  {
                    marginHorizontal: 10,
                    justifyContent: 'center',
                    marginLeft: 12,
                    paddingBottom: 16,
                  },
                ]}>
                <Text
                  style={[
                    {fontFamily: 'AlegreyaSansSC-Regular', fontSize: 20},
                  ]}>
                  {e.displayName}
                </Text>
                <Text
                  style={[
                    {fontFamily: 'AlegreyaSansSC-Regular', fontSize: 12},
                  ]}>
                  {e.description.substring(0, 40)}...
                </Text>
              </View>
            </View>
          ))}
      </ScrollView>
    </ImageBackground>
  );
};

export default Search;

const styles = StyleSheet.create({
  image: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
