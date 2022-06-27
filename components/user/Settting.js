import {
  StyleSheet,
  Text,
  View,
  Image,
  Modal,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useContext, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import Context from './../context/Context';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import RNFS from 'react-native-fs';

const Settting = ({navigation}) => {
  const IsFocused = useIsFocused();
  const [modalVisible, setModalVisible] = useState(false); //edit modal
  const {get_data, profile} = useContext(Context);
  const [info, setInfo] = useState({
    desc: '',
    phoneNumber: '',
  });
  const [filePath, setFilePath] = useState(null);
  const [loading, setlLoading] = useState(false);

  const save_detail = () => {
    firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .update({
        phoneNumber: info.phoneNumber,
        description: info.desc,
      })
      .then(() => {
        get_data();
        setModalVisible(false);
        setInfo({
          desc: '',
          phoneNumber: '',
        });
      });
  };

  const _chooseFile = async () => {
    // Opening Document Picker to select one file
    try {
      const fileDetails = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.images],
      });
      setlLoading(true);
      console.log('fileDetails : ' + JSON.stringify(fileDetails));
      // Setting the state for selected File
      setFilePath(fileDetails[0]);
    } catch (error) {
      setFilePath(null);
      setlLoading(false);

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
      setlLoading(true);
      const timestamp = new Date().getTime();

      // Check if file selected
      console.log(filePath);
      if (!filePath) return alert('Please Select any Image');

      // Create Reference
      var ext = filePath.name.substr(filePath.name.lastIndexOf('.') + 1);
      var file_name = profile.email.slice(0, profile.email.lastIndexOf('@'));
      const reference = storage().ref(
        `/myFiles/ProfilePhoto/${file_name}-${timestamp}.${ext}`,
      );

      var desertRef = storage().refFromURL(profile.profilePhoto);

      // Delete the file
      desertRef.delete().then(() => {});

      //Put File
      const data = await RNFS.readFile(filePath.uri, 'base64');
      const task = reference.putString(data, 'base64');

      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(() => {
        firestore()
          .collection('Users')
          .doc(auth().currentUser.uid)
          .update({
            profilePhoto: `https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2FProfilePhoto%2F${file_name}-${timestamp}.${ext}?alt=media`,
          })
          .then(() => {
            setFilePath(null);
            setlLoading(false);
            get_data();
          });
      });
    } catch (error) {
      setlLoading(false);
      firestore()
        .collection('Users')
        .doc(auth().currentUser.uid)
        .update({
          profilePhoto:
            'https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2Fdefault.png?alt=media',
        })
        .then(() => {});
      console.log('Error->', error);
      console.log('task failed');
      alert(`Error-> ${error}`);
    }
  };

  useEffect(() => {
    navigation.closeDrawer();
  }, [IsFocused]);

  return (
    <View style={[styles.setting]}>
      <Text style={[{fontFamily: 'AlegreyaSansSC-Regular', fontSize: 22}]}>
        Profile
      </Text>
      <View
        style={[
          {
            marginTop: 30,
            flexDirection: 'row',
            justifyContent: 'space-between',
          },
        ]}>
        <TouchableOpacity onPress={_chooseFile}>
          <Image style={[styles.image]} source={{uri: profile.profilePhoto}} />
        </TouchableOpacity>
        <View style={[{justifyContent: 'space-between', paddingVertical: 10}]}>
          <View>
            <Text
              style={[
                {
                  textAlign: 'right',
                  fontFamily: 'AlegreyaSansSC-Regular',
                  fontSize: 20,
                  color: 'black',
                  textTransform: 'capitalize',
                },
              ]}>
              {profile.displayName}
            </Text>
            <Text
              style={[
                {
                  textAlign: 'right',
                  fontFamily: 'AlegreyaSansSC-Regular',
                  fontSize: 20,
                  color: 'black',
                },
              ]}>
              {profile.email}
            </Text>
            <Text
              style={[
                {
                  textAlign: 'right',
                  fontFamily: 'AlegreyaSansSC-Regular',
                  fontSize: 20,
                  color: 'black',
                },
              ]}>
              {profile.phoneNumber}
            </Text>
          </View>
          <Text
            onPress={() => {
              setInfo({
                desc: profile.description,
                phoneNumber: profile.phoneNumber,
              });
              setModalVisible(true);
            }}
            style={[
              {
                textAlign: 'right',
                fontFamily: 'AlegreyaSansSC-Regular',
                fontSize: 20,
                color: 'black',
              },
            ]}>
            Edit
          </Text>
        </View>
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
                  backgroundColor: '#00000090',
                },
              ]}>
              <View style={[{backgroundColor: 'white', padding: 35}]}>
                <View>
                  <Text style={[styles.inputTitle]}>Phone Number</Text>
                  <TextInput
                    placeholder="Github repository here"
                    value={info.phoneNumber}
                    keyboardType="numeric"
                    onChangeText={text => {
                      if (text.length < 11) {
                        setInfo({...info, phoneNumber: text});
                      }
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View>
                  <Text style={[styles.inputTitle]}>Description</Text>
                  <TextInput
                    placeholder="Write something about yourself"
                    multiline={true}
                    maxLength={200}
                    numberOfLines={5}
                    value={info.desc}
                    onChangeText={text => {
                      setInfo({...info, desc: text});
                    }}
                    style={[styles.input, {paddingVertical: 30}]}></TextInput>
                </View>
                <View style={[{marginTop: 5}]}>
                  <TouchableOpacity onPress={save_detail}>
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
      {loading && (
        <View style={[styles.centeredView]}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={loading}
            onRequestClose={() => {
              setlLoading(false);
              setFilePath(null);
            }}>
            <View
              style={[
                {
                  flex: 1,
                  backgroundColor: '#00000090',
                  paddingHorizontal: 30,
                  justifyContent: 'center',
                  alignItems: 'center',
                },
              ]}>
              {filePath && (
                <Image
                  style={[{width: 200, height: 200, borderRadius: 100}]}
                  source={{uri: filePath.uri}}
                />
              )}
              <TouchableOpacity onPress={_uploadFile}>
                <Text
                  style={[
                    {
                      fontFamily: 'AlegreyaSansSC-Medium',
                      textAlign: 'right',
                      fontSize: 30,
                      color: 'white',
                      marginTop: 30,
                    },
                  ]}>
                  Save
                </Text>
              </TouchableOpacity>
            </View>
          </Modal>
        </View>
      )}
    </View>
  );
};

export default Settting;

const styles = StyleSheet.create({
  setting: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: 'black',
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
    fontFamily: 'AlegreyaSansSC-Regular',
  },
});
