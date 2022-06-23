import React, {useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Context from './Context';

const Data = props => {
  const [profile, setProfile] = useState({
    uid: '',
    email: '',
    displayName: '',
    description: '',
    phoneNumber: '',
    profilePhoto:
      'https://firebasestorage.googleapis.com/v0/b/ino-app-20b90.appspot.com/o/myFiles%2Fdefault.png?alt=media',
  });
  const [platform, setPlatform] = useState([]);
  const [project, setProject] = useState([]);

  const get_data = async () => {
    const userData = await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get();
    const {
      displayName,
      email,
      platform,
      phoneNumber,
      profilePhoto,
      description,
      uid,
      project,
    } = userData._data;
    setProfile({
      uid,
      email,
      displayName,
      phoneNumber,
      profilePhoto,
      description,
    });
    setPlatform(platform);
    setProject(project);
    // console.log(userData._data);
  };

  return (
    <Context.Provider value={{get_data, profile, platform,project}}>
      {props.children}
    </Context.Provider>
  );
};
export default Data;
