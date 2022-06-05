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
} from 'react-native';
import React, {useState} from 'react';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

const Search = () => {
  const [search, setSearch] = useState('');
  const [allId, setAllId] = useState([]);

  const find = e => {
    const result = [];
    firestore()
      .collection('Users')
      .where('displayName', '==', e.toLowerCase())
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          let temp = {
            displayName: doc.data().displayName,
            profilePhoto: doc.data().profilePhoto,
            uid: doc.data().uid,
          };
          // console.log('MedData', doc.data());
          result.push(temp);
          console.log(temp);
        });
        console.log(result);
        setAllId(result);
      });
  };

  return (
    <View>
      <View style={[{alignItems: 'center', margin: 10}]}>
        <View style={[{flexDirection: 'row'}]}>
          <TextInput
            style={[styles.input, {flex: 1}]}
            onChangeText={text => {
              find(text.trim());
            }}
            placeholder={'Enter name'}
          />
        </View>
      </View>
      <ScrollView>
        <View
          style={[
            {
              marginVertical: 10,
              marginHorizontal: 20,
            },
          ]}>
          {allId &&
            allId.map((e, i) => {
              return (
                <View key={i}>
                  <Image
                    style={[{width: 100, height: 100, borderRadius: 100}]}
                    source={{uri: e.profilePhoto}}
                  />
                  <Text>{e.displayName}</Text>
                  <Text>{e.uid}</Text>
                </View>
              );
            })}
        </View>
      </ScrollView>
    </View>
  );
};

export default Search;

const styles = StyleSheet.create({
  buttonStyle: {
    alignItems: 'center',
    padding: 10,
    width: 150,
    marginTop: 16,
    borderColor: 'orange',
    borderWidth: 2,
    borderRadius: 10,
  },
  buttonTextStyle: {
    fontWeight: 'bold',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    fontSize: 14,
    borderRadius: 8,
  },
});
