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
import React, {useState, useEffect} from 'react';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import DocumentPicker from 'react-native-document-picker';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import RNFS from 'react-native-fs';

const Project = () => {
  const [filePath, setFilePath] = useState({});
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [project, setProject] = useState([]);

  const click = async () => {
    const userData = await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get();
    // console.log(userData._data);
    const {project} = userData._data;
    setProject(project);
  };

  const deletProject = e => {
    // Create a reference to the file to delete
    var desertRef = storage().refFromURL(e.imageUri);

    // Delete the file
    desertRef
      .delete()
      .then(function () {
        // File deleted successfully
        firestore()
          .collection('Users')
          .doc(auth().currentUser.uid)
          .update({
            project: firestore.FieldValue.arrayRemove(e),
          })
          .then(() => {
            // console.log('Social deleted');
            click();
          });
      })
      .catch(function (error) {
        alert(error);
      });
  };

  const _chooseFile = async () => {
    // Opening Document Picker to select one file
    try {
      const fileDetails = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        presentationStyle: 'fullScreen',
      });
      console.log('fileDetails : ' + JSON.stringify(fileDetails));
      // Setting the state for selected File
      setFilePath(fileDetails);
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
      if (Object.keys(filePath).length === 0)
        return alert('Please Select any File');

      // Create Reference
      var ext = filePath[0].name.substr(filePath[0].name.lastIndexOf('.') + 1);
      console.log(ext);
      const reference = storage().ref(
        `/myFiles/${auth().currentUser.uid}/project-${timestamp}.${ext}`,
      );

      //Put File
      const data = await RNFS.readFile(filePath[0].uri, 'base64');
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
              title: title.trim().toLowerCase(),
              link: link.trim(),
              desc: desc.trim(),
              imageUri: `https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2F${
                auth().currentUser.uid
              }%2Fproject-${timestamp}.${ext}?alt=media`,
            }),
          })
          .then(() => {
            // console.log('New Project added');
            click();
          });
        setLink('');
        setDesc('');
        setTitle('');
        alert('Project Added');
      });
      setFilePath({});
    } catch (error) {
      console.log('Error->', error);
      console.log('task failed');
      alert(`Error-> ${error}`);
    }
  };

  useEffect(() => {
    click();
  }, []);

  return (
    <SafeAreaView style={{flex: 1}}>
      <View style={styles.container}>
        <View style={styles.container}>
          <Text>Choose File and Upload to FireStorage</Text>
          <TouchableOpacity
            activeOpacity={0.5}
            style={[styles.buttonStyle, {backgroundColor: 'orange'}]}
            onPress={_chooseFile}>
            <Text style={styles.buttonTextStyle}>Choose Image</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={[{flexDirection: 'column', margin: 14, alignItems: 'center'}]}>
        <View style={[{flexDirection: 'row'}]}>
          <TextInput
            value={title}
            style={[styles.input, {flex: 1}]}
            onChangeText={text => setTitle(text)}
            placeholder={'Project title'}
          />
          <TextInput
            value={link}
            style={[styles.input, {flex: 3}]}
            onChangeText={text => setLink(text.trim())}
            placeholder={'Paste your repo link here'}
          />
        </View>
        <View style={[{flexDirection: 'row'}]}>
          <TextInput
            maxLength={200}
            value={desc}
            multiline={true}
            numberOfLines={5}
            style={[styles.input, {flex: 1}]}
            onChangeText={text => setDesc(text)}
            placeholder={'Write something about your project'}
          />
        </View>
        <TouchableOpacity
          disabled={filePath === '' || title === ''}
          style={[
            styles.buttonStyle,
            {
              backgroundColor:
                filePath === '' || title === '' ? 'transparent' : 'orange',
            },
          ]}
          onPress={_uploadFile}>
          <Text style={styles.buttonTextStyle}>ADD PROJECT</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={[{backgroundColor: 'lightgray'}]}>
        {project &&
          project.map(function (e, i) {
            return (
              <View
                key={i}
                style={[
                  {
                    margin: 10,
                    borderWidth: 1.2,
                    borderColor: 'gray',
                    backgroundColor: 'white',
                    padding: 10,
                  },
                ]}>
                <Image
                  style={[
                    {
                      height: 200,
                    },
                  ]}
                  source={{uri: e.imageUri}}
                />
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      marginVertical: 8,
                      alignItems: 'flex-end',
                      justifyContent: 'space-between',
                      paddingHorizontal: 10,
                    },
                  ]}>
                  <Text
                    onPress={() => Linking.openURL(e.link)}
                    style={[
                      {
                        fontSize: 26,
                        color: 'blue',
                        textTransform: 'uppercase',
                      },
                    ]}>
                    {e.title}
                  </Text>
                  <TouchableOpacity
                    style={[
                      {
                        marginBottom: 10,
                        padding: 2,
                      },
                    ]}
                    onPress={() => {
                      deletProject(e);
                    }}>
                    <FontAwesome5
                      name={'trash'}
                      size={16}
                      color={'black'}></FontAwesome5>
                  </TouchableOpacity>
                </View>
                <View
                  style={[
                    {
                      flexDirection: 'row',
                      marginBottom: 8,
                      paddingHorizontal: 10,
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        fontSize: 18,
                      },
                    ]}>
                    {e.desc}
                  </Text>
                </View>
              </View>
            );
          })}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Project;

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 10,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 20,
  },
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
