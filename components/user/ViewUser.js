import {
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableOpacity,
  Image,
  ScrollView,
  Linking,
} from 'react-native';
import React, {useState} from 'react';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';

const ViewUser = ({navigation, route}) => {
  const user = route.params.user;
  const [projectInfoModal, setProjectInfoModal] = useState(false);
  const [openProject, setOpenProject] = useState({});

  return (
    user && (
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
            </View>
            <View style={[styles.links]}>
              <Text style={[styles.link]}>Instagram</Text>
              <Text style={[styles.link]}>Twitter</Text>
              <Text style={[styles.link]}>Github</Text>
              <Text style={[styles.link]}>Linkedin</Text>
            </View>
          </View>
          <View>
            <Image style={[styles.image]} source={{uri: user.profilePhoto}} />
            <Text
              onPress={navigation.openDrawer}
              style={[
                {
                  textAlign: 'center',
                  fontSize: 30,
                  fontFamily: 'AlegreyaSansSC-Medium',
                  color: 'black',
                },
              ]}>
              {user.displayName}
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
            ]}></View>
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
              {user.description}
            </Text>
          </View>
        </View>
        <View style={[styles.projects, {flex: 1}]}>
          <View
            style={[
              {
                flexDirection: 'row',
                alignItems: 'flex-end',
                marginBottom: 10,
              },
            ]}>
            <Text style={[styles.titles, {marginBottom: 0}]}>Project</Text>
          </View>
          <ScrollView
            contentContainerStyle={[
              {
                flexWrap: 'wrap',
                flexDirection: 'row',
                justifyContent: 'space-between',
              },
            ]}>
            {user.project.map(function (e, i) {
              return (
                <TouchableOpacity
                  onPress={() => {
                    setOpenProject(e);
                    setProjectInfoModal(true);
                  }}
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
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        {projectInfoModal && (
          <View style={[styles.centeredView]}>
            <Modal
              animationType="slide"
              transparent={true}
              visible={projectInfoModal}
              onRequestClose={() => {
                setProjectInfoModal(false);
              }}>
              <View
                style={[
                  styles.centeredView,
                  {
                    flex: 1,
                    backgroundColor: '#00000090',
                    paddingHorizontal: 30,
                  },
                ]}>
                <View style={[{backgroundColor: '#32C2E4', width: 300}]}>
                  <View
                    style={[
                      {
                        height: 180,
                      },
                    ]}>
                    <Image
                      style={{
                        resizeMode: 'stretch',
                        height: '100%',
                        width: '100%',
                      }}
                      source={{uri: openProject.imageUri}}></Image>
                  </View>
                  <View
                    style={[
                      {
                        paddingHorizontal: 20,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.inputTitle,
                        {
                          textAlign: 'center',
                          borderBottomWidth: 1,
                          borderBottomColor: 'white',
                          color: 'white',
                          paddingBottom: 10,
                          fontSize: 40,
                        },
                      ]}>
                      {openProject.title}
                    </Text>
                  </View>
                  <View>
                    <Text
                      style={[
                        styles.inputTitle,
                        {
                          textAlign: 'center',
                          color: 'white',
                          fontSize: 20,
                          paddingHorizontal: 50,
                          marginTop: 30,
                          marginBottom: 60,
                        },
                      ]}>
                      {openProject.desc}
                    </Text>
                  </View>
                  <View
                    style={[
                      {
                        justifyContent: 'flex-end',
                        flexDirection: 'row',
                        marginTop: 50,
                        marginBottom: 20,
                        marginHorizontal: 20,
                      },
                    ]}>
                    <TouchableOpacity
                      onPress={() => {
                        Linking.openURL(openProject.link);
                      }}>
                      <FontAwesome5
                        name={'angle-right'}
                        size={20}
                        color={'black'}></FontAwesome5>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </Modal>
          </View>
        )}
      </View>
    )
  );
};

export default ViewUser;

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
