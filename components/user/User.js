import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Button,
  Linking,
} from 'react-native';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';
import DocumentPicker from 'react-native-document-picker';
import React, {useContext, useState, useEffect} from 'react';
import {AuthContext} from '../auth/AuthProvider';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const User = () => {
  const {user} = useContext(AuthContext);
  const [link, setLink] = useState('');
  const [social, setSocial] = useState('');
  const [profile, setProfile] = useState({
    email: '',
    displayName: '',
    phoneNumber: '',
    profilePhoto:
      'https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2Fdefault.png?alt=media',
  });
  const [socials, setSocials] = useState([]);
  const [filePath, setFilePath] = useState(null);

  const click = async () => {
    const userData = await firestore().collection('Users').doc(user.uid).get();
    // console.log(userData._data);
    const {phoneNumber, displayName, email, platform, profilePhoto} =
      userData._data;
    // console.log(platform);
    setProfile({phoneNumber, displayName, email, profilePhoto});
    setSocials(platform);
    // console.log(socials);
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
      var ext = filePath[0].name.substr(filePath[0].name.lastIndexOf('.') + 1);
      console.log(ext);
      const reference = storage().ref(
        `/myFiles/${user.uid}/profilePhoto.${ext}`,
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
            profilePhoto: `https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2F${user.uid}%2FprofilePhoto.${ext}?alt=media`,
          })
          .then(() => {
            // console.log('New Project added');
            click();
          });
        alert('Profile Image Changed');
      });
      setFilePath(null);
    } catch (error) {
      console.log('Error->', error);
      console.log('task failed');
      alert(`Error-> ${error}`);
    }
  };

  const addSocial = () => {
    firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        platform: firestore.FieldValue.arrayUnion({social: social, url: link}),
      })
      .then(() => {
        // console.log('New Social added');
        setLink('');
        setSocial('');
        click();
      });
  };

  const deleteSocial = e => {
    firestore()
      .collection('Users')
      .doc(user.uid)
      .update({
        platform: firestore.FieldValue.arrayRemove(e),
      })
      .then(() => {
        // console.log('Social deleted');
        click();
      });
  };

  useEffect(() => {
    click();
  }, []);

  return (
    <View styles={styles.body}>
      <View style={styles.info}>
        <View style={[styles.id]}>
          <Text>ID : </Text>
          <Text selectable={true}>{user.uid}</Text>
        </View>
        <View style={[{alignItems: 'flex-end'}]}>
          <Image
            style={[{width: 100, height: 100, borderRadius: 100}]}
            source={{
              uri: profile.profilePhoto,
            }}
          />
        </View>
        <View
          style={[
            {
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'flex-end',
            },
          ]}>
          {filePath ? (
            <View
              style={[
                {
                  alignItems: 'center',
                  flexDirection: 'row',
                },
              ]}>
              <TouchableOpacity
                onPress={() => {
                  setFilePath(null);
                }}>
                <FontAwesome5
                  name={'minus'}
                  size={15}
                  color={'black'}></FontAwesome5>
              </TouchableOpacity>
              <TouchableOpacity onPress={_uploadFile}>
                <FontAwesome5
                  name={'check'}
                  style={[{marginHorizontal: 10}]}
                  size={15}
                  color={'black'}></FontAwesome5>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity onPress={_chooseFile}>
              <FontAwesome5
                name={'file-import'}
                style={[{marginHorizontal: 10}]}
                size={15}
                color={'black'}></FontAwesome5>
            </TouchableOpacity>
          )}

          <Text style={[styles.text, styles.name]}>{profile.displayName}</Text>
        </View>
        <View style={styles.detail}>
          <FontAwesome5
            name={'envelope'}
            size={18}
            color={'black'}></FontAwesome5>
          <Text style={styles.text}>{profile.email}</Text>
        </View>
        <View style={styles.detail}>
          <FontAwesome5
            name={'mobile'}
            style={{marginLeft: 3}}
            size={20}
            color={'black'}></FontAwesome5>
          <Text style={styles.text}>{profile.phoneNumber}</Text>
        </View>
      </View>
      <View style={[{flexDirection: 'row', marginVertical: 16}]}>
        <View style={[{flexDirection: 'row', flex: 8}]}>
          <TextInput
            value={social}
            style={[styles.input, {flex: 1}]}
            onChangeText={text => setSocial(text)}
            placeholder={'Tag'}
          />
          <TextInput
            value={link}
            style={[styles.input, {flex: 3}]}
            onChangeText={text => setLink(text)}
            placeholder={'Paste your link here'}
          />
        </View>
        <TouchableOpacity
          disabled={link === '' || social === ''}
          style={[
            {
              flex: 1,
              justifyContent: 'center',
              backgroundColor:
                link === '' || social === '' ? 'transparent' : 'lightgreen',
              borderRadius: 5,
              alignItems: 'center',
              borderColor: link === '' || social === '' ? 'gray' : 'green',
              borderWidth: 1,
              marginVertical: 4.5,
              marginRight: 4,
            },
          ]}
          onPress={addSocial}>
          <FontAwesome5 name={'check'} size={16} color={'black'}></FontAwesome5>
        </TouchableOpacity>
      </View>
      <View
        style={[
          {flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'},
        ]}>
        {socials && (
          <Text
            style={[{fontSize: 25, fontWeight: 'bold', marginHorizontal: 5}]}>
            Connect with me
          </Text>
        )}
        <View
          style={[
            {flexDirection: 'row', justifyContent: 'center', flexWrap: 'wrap'},
          ]}>
          {socials &&
            socials.map(function (e, i) {
              return (
                <View
                  key={i}
                  style={[
                    {
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingHorizontal: 10,
                      borderRadius: 30,
                      width: 180,
                      paddingVertical: 8,
                      margin: 6,
                      borderWidth: 2,
                      borderColor: 'gray',
                      backgroundColor: 'lightgray',
                    },
                  ]}>
                  <Text
                    style={[
                      {
                        marginLeft: 10,
                        fontSize: 16,
                        textTransform: 'uppercase',
                        flex: 5,
                        color: 'black',
                      },
                    ]}
                    onPress={() => Linking.openURL(e.url)}>
                    {e.social}
                  </Text>
                  <TouchableOpacity
                    style={[
                      {
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      },
                    ]}
                    onPress={() => {
                      deleteSocial(e);
                    }}>
                    <FontAwesome5
                      name={'trash'}
                      size={12}
                      color={'black'}></FontAwesome5>
                  </TouchableOpacity>
                </View>
              );
            })}
        </View>
      </View>
    </View>
  );
};

export default User;

const styles = StyleSheet.create({
  name: {
    textTransform: 'uppercase',
    fontSize: 40,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  id: {
    fontSize: 14,
    flexDirection: 'row',
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderColor: 'black',
    borderWidth: 1,
    margin: 5,
    fontSize: 16,
  },
  info: {
    backgroundColor: 'white',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderTopColor: 'black',
    borderTopWidth: 1,
  },
  detail: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 6,
  },
  text: {
    fontSize: 24,
  },
});
