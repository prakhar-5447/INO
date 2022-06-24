import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
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

const User = () => {
  const [socials, setSocials] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const {get_data, profile, platform, project} = useContext(Context);

  const set_social = () => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .update({
        platform: socials,
      })
      .then(() => {
        get_data();
        setModalVisible(false);
      });
  };

  useEffect(() => {
    get_data();
  }, []);

  return (
    <View
      style={[
        {
          flex: 1,
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
            <Text style={[styles.titles, {marginRight: 5}]}>Socials</Text>
            <TouchableOpacity
              onPress={() => {
                setSocials(platform);
                setModalVisible(true);
              }}>
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
              {
                textAlign: 'center',
                fontSize: 30,
                fontFamily: 'AlegreyaSansSC-Medium',
                color: 'black',
              },
            ]}>
            {profile.displayName}
          </Text>
        </View>
        <View>
          <Text style={[styles.titles, {textAlign: 'right'}]}>Links</Text>
          <View style={[styles.others]}>
            <Text style={[styles.link, {textAlign: 'right'}]}>Portfolio</Text>
            <Text style={[styles.link, {textAlign: 'right'}]}>Other</Text>
          </View>
        </View>
      </View>
      <View
        style={[
          {
            justifyContent: 'center',
            marginHorizontal: 55,
            marginVertical: 20,
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
                color: 'black',
              },
            ]}>
            {profile.description}
          </Text>
        </View>
      </View>
      <View style={[styles.projects, {flex: 1}]}>
        <View
          style={[
            {
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'flex-end',
              marginBottom: 10,
            },
          ]}>
          <Text style={[styles.titles, {marginBottom: 0}]}>Project</Text>
          <TouchableOpacity>
            <Text
              style={[
                {
                  fontSize: 18,
                  fontFamily: 'AlegreyaSansSC-Regular',
                  color: 'black',
                },
              ]}>
              Add new
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          contentContainerStyle={[
            {
              flexWrap: 'wrap',
              flexDirection: 'row',
              justifyContent: 'space-between',
            },
          ]}>
          {project &&
            project.map(function (e, i) {
              return (
                <View
                  key={i}
                  style={[
                    {
                      width: 170,
                      backgroundColor: '#2FC1E4',
                      marginBottom: 10,
                    },
                  ]}>
                  <Image
                    style={[
                      {
                        height: 100,
                      },
                    ]}
                    source={{uri: e.imageUri}}
                  />
                  <View style={[{padding: 10}]}>
                    <Text
                      onPress={() => Linking.openURL(e.link)}
                      style={[
                        {
                          fontSize: 15,
                          color: 'white',
                          textTransform: 'capitalize',
                          textAlign: 'left',
                          paddingBottom: 5,
                          borderBottomWidth: 1,
                          borderColor: 'white',
                          fontFamily: 'AlegreyaSansSC-Medium',
                        },
                      ]}>
                      {e.title}
                    </Text>
                    <View
                      style={[
                        {
                          flexDirection: 'row',
                          marginBottom: 8,
                        },
                      ]}>
                      <Text
                        style={[
                          {
                            fontSize: 12,
                            color: 'white',
                            textAlign: 'left',
                            marginVertical: 10,
                            fontFamily: 'AlegreyaSansSC-Regular',
                          },
                        ]}>
                        {e.desc.substring(0, 60)}....
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
        </ScrollView>
      </View>
      {modalVisible && (
        <View style={[styles.centeredView]}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              setModalVisible(false);
            }}>
            <View
              style={[
                styles.centeredView,
                {
                  flex: 1,
                },
              ]}>
              <View style={[{backgroundColor: 'white', padding: 35}]}>
                <View>
                  <Text style={[styles.inputTitle]}>Instagram</Text>
                  <TextInput
                    value={socials.instagram}
                    onChangeText={text => {
                      setSocials({...socials, instagram: text});
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View>
                  <Text style={[styles.inputTitle]}>Twitter</Text>
                  <TextInput
                    value={socials.twitter}
                    onChangeText={text => {
                      setSocials({...socials, twitter: text});
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View>
                  <Text style={[styles.inputTitle]}>Github</Text>
                  <TextInput
                    value={socials.github}
                    onChangeText={text => {
                      setSocials({...socials, github: text});
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View>
                  <Text style={[styles.inputTitle]}>LinkedIn</Text>
                  <TextInput
                    value={socials.linkedin}
                    onChangeText={text => {
                      setSocials({...socials, linkedin: text});
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View>
                  <Text style={[styles.inputTitle]}>Portfolio</Text>
                  <TextInput
                    value={socials.portfolio}
                    onChangeText={text => {
                      setSocials({...socials, portfolio: text});
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View>
                  <Text style={[styles.inputTitle]}>Other</Text>
                  <TextInput
                    value={socials.other}
                    onChangeText={text => {
                      setSocials({...socials, other: text});
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View style={[{marginTop: 5}]}>
                  <TouchableOpacity onPress={set_social}>
                    <Text
                      style={[
                        {
                          fontFamily: 'AlegreyaSansSC-Medium',
                          textAlign: 'right',
                          fontSize: 30,
                        },
                      ]}>
                      Save
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  titles: {
    fontFamily: 'AlegreyaSansSC-Medium',
    fontSize: 25,
    marginBottom: 5,
    color: 'black',
  },
  links: {
    borderLeftWidth: 1.5,
    paddingLeft: 10,
    color: 'black',
  },
  link: {
    fontFamily: 'AlegreyaSansSC-Regular',
    fontSize: 18,
    color: 'black',
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
  projects: {
    borderTopWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  centeredView: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputTitle: {
    fontFamily: 'AlegreyaSansSC-Regular',
    fontSize: 20,
    marginBottom: 2,
  },
  input: {
    borderWidth: 1,
    width: 280,
    padding: 10,
    marginBottom: 5,
  },
});
