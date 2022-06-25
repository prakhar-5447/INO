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
} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import Context from '../context/Context';

const Followed = () => {
  let temp = [];
  const [follow, setFollow] = useState([]);
  const {followed, profile} = useContext(Context);

  const fetch = async () => {
    followed.forEach(e => {
      firestore()
        .collection('Users')
        .doc(e)
        .get()
        .then(querySnapShot => {
          const data = querySnapShot._data;
          if (data.uid !== profile.uid) temp.push(data);
        });
    });
  };

  useEffect(() => {
    fetch();
    setTimeout(() => {
      setFollow(temp);
    }, 2000);
  }, []);

  return (
    <View style={[styles.follow]}>
      <Text style={[{fontFamily: 'AlegreyaSansSC-Regular', fontSize: 22}]}>
        followed
      </Text>
      <ScrollView style={[{flex: 1, paddingVertical: 20}]}>
        {follow.map((e, i) => (
          <View
            key={i}
            style={[
              {
                flexDirection: 'row',
                marginVertical: 10,
              },
            ]}>
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
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                },
              ]}>
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
              <Text
                style={[
                  {
                    fontFamily: 'AlegreyaSansSC-Regular',
                    paddingBottom: 35,
                    fontSize: 16,
                    color: '#1A5899',
                    marginLeft: 10,
                  },
                ]}>
                view
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default Followed;

const styles = StyleSheet.create({
  follow: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
