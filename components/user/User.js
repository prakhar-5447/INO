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
  const [projectModal, setProjectModal] = useState(false);
  const [projectInfo, setProjectInfo] = useState({
    desc: '',
    imageuri: '',
    link: '',
    title: '',
  });
  const [filePath, setFilePath] = useState(null);
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


  // const deletProject = e => {
  //   // Create a reference to the file to delete
  //   var desertRef = storage().refFromURL(e.imageUri);

  //   // Delete the file
  //   desertRef
  //     .delete()
  //     .then(function () {
  //       // File deleted successfully
  //       firestore()
  //         .collection('Users')
  //         .doc(auth().currentUser.uid)
  //         .update({
  //           project: firestore.FieldValue.arrayRemove(e),
  //         })
  //         .then(() => {
  //           // console.log('Social deleted');
  //           click();
  //         });
  //     })
  //     .catch(function (error) {
  //       alert(error);
  //     });
  // };


  const _chooseFile = async () => {
    // Opening Document Picker to select one file
    try {
      const fileDetails = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
      });
      console.log('fileDetails : ' + JSON.stringify(fileDetails));
      // Setting the state for selected File
      setFilePath(fileDetails[0]);
    } catch (error) {
      setFilePath({});
      // If user canceled the document selection
      alert(
        DocumentPicker.isCancel(error)
          ? 'Canceled'
          : 'Unknown Error: ' + JSON.stringify(error),
      );
    }
  };

  const _uploadFile = async () => {
    try {
      const timestamp = new Date().getTime();

      // Check if file selected
      console.log(filePath);
      if (!filePath) return alert('Please Select any Image');

      // Create Reference
      var ext = filePath.name.substr(filePath.name.lastIndexOf('.') + 1);
      console.log(ext);
      const reference = storage().ref(
        `/myFiles/${auth().currentUser.uid}/project-${timestamp}.${ext}`,
      );

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
            project: firestore.FieldValue.arrayUnion({
              title: projectInfo.title.trim().toLowerCase(),
              link: projectInfo.link.trim(),
              desc: projectInfo.desc.trim(),
              imageUri: `https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2F${
                auth().currentUser.uid
              }%2Fproject-${timestamp}.${ext}?alt=media`,
            }),
          })
          .then(() => {
            console.log('New Project added');
          });
        setProjectInfo({
          desc: '',
          imageuri: '',
          link: '',
          title: '',
        });
        setProjectModal(false);
        get_data();
        setFilePath(null);
      });
    } catch (error) {
      console.log('Error->', error);
      console.log('task failed');
      alert(`Error-> ${error}`);
    }
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
          <TouchableOpacity
            onPress={() => {
              setProjectModal(true);
            }}>
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
          {project.map(function (e, i) {
            return (
              <View
                key={i}
                style={[
                  {
                    width: 170,
                    backgroundColor: '#2FC1E4',
                    marginBottom: 14,
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
                  backgroundColor: '#00000090',
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
      {projectModal && (
        <View style={[styles.centeredView]}>
          <Modal
            animationType="slide"
            transparent={true}
            visible={projectModal}
            onRequestClose={() => {
              setProjectModal(false);
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
                <TouchableOpacity onPress={_chooseFile}>
                  <View
                    style={[
                      {
                        borderWidth: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 180,
                        marginBottom: 10,
                      },
                    ]}>
                    {filePath ? (
                      <Image
                        style={{
                          height: '100%',
                          width: '100%',
                        }}
                        source={{uri: filePath.uri}}></Image>
                    ) : (
                      <Text style={[styles.inputTitle]}>
                        Select an Image to Preview
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
                <View>
                  <Text style={[styles.inputTitle]}>Title</Text>
                  <TextInput
                    value={projectInfo.title}
                    onChangeText={text => {
                      setProjectInfo({...projectInfo, title: text});
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View>
                  <Text style={[styles.inputTitle]}>Link</Text>
                  <TextInput
                    placeholder="Github repository here"
                    value={projectInfo.link}
                    onChangeText={text => {
                      setProjectInfo({...projectInfo, link: text});
                    }}
                    style={[styles.input]}></TextInput>
                </View>
                <View>
                  <Text style={[styles.inputTitle]}>Description</Text>
                  <TextInput
                    placeholder="Write something about your porject"
                    multiline={true}
                    maxLength={200}
                    numberOfLines={5}
                    value={projectInfo.desc}
                    onChangeText={text => {
                      setProjectInfo({...projectInfo, desc: text});
                    }}
                    style={[styles.input, {paddingVertical: 30}]}></TextInput>
                </View>
                <View style={[{marginTop: 5}]}>
                  <TouchableOpacity onPress={_uploadFile}>
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
    fontFamily: 'AlegreyaSansSC-Regular',
  },
});
