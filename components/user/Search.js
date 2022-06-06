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
import React, {useState} from 'react';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Search = () => {
  const [allId, setAllId] = useState([]);

  const find = e => {
    const result = [];
    firestore()
      .collection('Users')
      .where('displayName', '==', e.toLowerCase())
      .get()
      .then(querySnapshot => {
        querySnapshot.forEach(doc => {
          // console.log('MedData', doc.data().platform);
          result.push(doc.data());
        });
        console.log(result);
        setAllId(result);
      });
  };

  function getRandomColor() {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

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
                <View
                  key={i}
                  style={[
                    {
                      marginVertical: 8,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      borderWidth: 1,
                      borderColor: getRandomColor(),
                      backgroundColor: 'white',
                      borderTopLeftRadius: 100,
                      borderBottomLeftRadius: 100,
                    },
                  ]}>
                  <Image
                    style={[
                      {width: 80, height: 80, margin: 3, borderRadius: 100},
                    ]}
                    source={{uri: e.profilePhoto}}
                  />
                  <View
                    style={[
                      {
                        alignItems: 'flex-end',
                        justifyContent: 'space-between',
                        paddingRight: 8,
                        marginBottom: 4,
                      },
                    ]}>
                    <View
                      style={[
                        {
                          alignItems: 'flex-end',
                        },
                      ]}>
                      <Text
                        style={[{fontSize: 26, textTransform: 'uppercase'}]}>
                        {e.displayName}
                      </Text>
                      <Text style={[{fontSize: 14}]}>{e.email}</Text>
                      <Text style={[{fontSize: 14}]}>{e.phoneNumber}</Text>
                      <View
                        style={[
                          {
                            flexDirection: 'row',
                            maxWidth: 200,
                            flexWrap: 'wrap',
                            marginTop: 2,
                            justifyContent: 'flex-end',
                          },
                        ]}>
                        {e.platform &&
                          e.platform.map((item, i) => {
                            return (
                              <Text
                                style={[
                                  {
                                    marginHorizontal: 2,
                                    textTransform: 'uppercase',
                                    color: 'blue',
                                    fontSize: 12,
                                  },
                                ]}
                                key={i}
                                onPress={() => {
                                  Linking.openURL(item.link);
                                }}>
                                {item.social}
                              </Text>
                            );
                          })}
                      </View>
                    </View>
                  </View>
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
