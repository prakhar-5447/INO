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
import React, {useState, useEffect, useContext} from 'react';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import {AuthContext} from '../auth/AuthProvider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const Project = () => {
  const {user} = useContext(AuthContext);
  const [filePath, setFilePath] = useState({});
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [link, setLink] = useState('');
  const [project, setProject] = useState([]);

  const click = async () => {
    const userData = await firestore().collection('Users').doc(user.uid).get();
    // console.log(userData._data);
    const {project} = userData._data;
    setProject(project);
  };

  const _chooseFile = async () => {
    // Opening Document Picker to select one file
    try {
      const fileDetails = await DocumentPicker.pick({
        // Provide which type of file you want user to pick
        type: [DocumentPicker.types.allFiles],
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
      // Check if file selected
      console.log(filePath);
      if (Object.keys(filePath).length === 0)
        return alert('Please Select any File');

      // Create Reference
      console.log(filePath[0].name);
      const reference = storage().ref(
        `/myFiles/${user.uid}/${filePath[0].name}`,
      );

      // Put File
      const task = reference.putFile(filePath[0].uri);

      task.on('state_changed', taskSnapshot => {
        console.log(
          `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
        );
      });
      task.then(() => {
        firestore()
          .collection('Users')
          .doc(user.uid)
          .update({
            project: firestore.FieldValue.arrayUnion({
              title: title,
              link: link,
              desc: desc,
              imageUri: `https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2F${user.uid}%2F${filePath[0].name}?alt=media`,
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
            onChangeText={text => setLink(text)}
            placeholder={'Paste your repo link here'}
          />
        </View>
        <View>
          <TextInput
            value={desc}
            multiline={true}
            numberOfLines={4}
            style={[styles.input, {width: 375}]}
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
      <ScrollView>
        {project &&
          project.map(function (e, i) {
            return (
              <View key={i} style={[]}>
                <Text style={[]}>{e.title}</Text>
                <Text style={[]}>{e.link}</Text>
                <Text style={[]}>{e.desc}</Text>
                <Image
                  style={[{width: 100, height: 100}]}
                  source={{uri: e.imageUri}}></Image>
                <TouchableOpacity
                  style={[
                    {
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    },
                  ]}
                  onPress={() => {
                    // deleteSocial(e);
                  }}>
                  <FontAwesome5
                    name={'trash'}
                    size={12}
                    color={'black'}></FontAwesome5>
                </TouchableOpacity>
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
