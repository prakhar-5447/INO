import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {useIsFocused} from '@react-navigation/native';

const Settting = () => {
  const IsFocused = useIsFocused();
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

  const _uploadFile = async e => {
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
        `/myFiles/${auth().currentUser.uid}/${timestamp}.${ext}`,
      );

      if (
        e !==
        'https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2Fdefault.png?alt=media'
      ) {
        // Create a reference to the file to delete
        var desertRef = storage().refFromURL(e);

        // Delete the file
        desertRef.delete().then(() => {});
      }

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
            profilePhoto: `https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2F${
              auth().currentUser.uid
            }%2F${timestamp}.${ext}?alt=media`,
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

  useEffect(() => {
    navigation.closeDrawer();
  }, [IsFocused]);

  return (
    <View>
      <Text>Settting</Text>
    </View>
  );
};

export default Settting;

const styles = StyleSheet.create({});
