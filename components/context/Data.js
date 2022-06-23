import React, {createContext, useState} from 'react';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import Context from './Context';

const Data = props => {
  const [link, setLink] = useState('');
  const [social, setSocial] = useState('');
  const [profile, setProfile] = useState({
    email: '',
    displayName: '',
    phoneNumber: '',
    profilePhoto: '',
  });
  const [platform, setPlatform] = useState([]);
  const [filePath, setFilePath] = useState(null);

  const get_data = async () => {
    const userData = await firestore()
      .collection('Users')
      .doc(auth().currentUser.uid)
      .get();
    const {phoneNumber, displayName, email, platform, profilePhoto} =
      userData._data;
    setProfile({phoneNumber, displayName, email, profilePhoto});
    setPlatform(platform);
    console.log('aajdajdskjasdhiahnsd');
    // console.log(userData._data);
  };
  return (
    <Context.Provider value={{get_data}}>{props.children}</Context.Provider>
  );
};
export default Data;
