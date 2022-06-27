import {StyleSheet, Text, View, ScrollView, Image} from 'react-native';
import React, {useState, useContext, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import Context from '../context/Context';
import {useIsFocused} from '@react-navigation/native';

const Followed = ({navigation}) => {
  const [follow, setFollow] = useState([]);
  const {followed} = useContext(Context);
  const isFocused = useIsFocused();

  const fetch = () => {
    const result = [];
    firestore()
      .collection('Users')
      .where(firestore.FieldPath.documentId(), 'in', followed)
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // console.log('MedData', doc.data().platform);
          result.push(doc.data());
        });
        setFollow(result);
      });
  };

  useEffect(() => {
    fetch();
    navigation.closeDrawer();
  }, [isFocused]);

  return (
    <View style={[styles.follows]}>
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
                  width: '75%',
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
                onPress={() => {
                  navigation.navigate('View', {user: e});
                }}
                style={[
                  {
                    fontFamily: 'AlegreyaSansSC-Regular',
                    paddingBottom: 35,
                    fontSize: 16,
                    color: '#1A5899',
                  },
                ]}>
                View
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
  follows: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
});
