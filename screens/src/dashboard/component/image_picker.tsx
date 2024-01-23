import React, {useEffect} from 'react';
import {useState} from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  ImagePickerResponse,
  launchImageLibrary,
} from 'react-native-image-picker';
import {height, showToast, tealColor, width} from '../../../constant';
import storage from '@react-native-firebase/storage';
import {useUser} from '../../../provider/user_provider';
import firestore from '@react-native-firebase/firestore';
import {useFocusEffect} from '@react-navigation/native';

interface ImagePickerProps {
  selectedImage: string;
  setSelectedImage: (text: string) => void;
  setbool?: (bool: boolean) => void;
}

const ImagePickerComponent: React.FC<ImagePickerProps> = ({
  selectedImage,
  setSelectedImage,
  setbool,
}) => {
  const {user, logout} = useUser();
  const [loading, setloading] = useState(false);

  const openImagePicker = () => {
    try {
      launchImageLibrary(
        {
          selectionLimit: 1,
          mediaType: 'photo',
        },
        response => {
          if (response.didCancel) {
            console.log('User cancelled image picker');
            setloading(false);
          } else if (response.errorMessage) {
            console.log('Image picker error: ', response.errorMessage);
            setloading(false);
          } else {
            setloading(true);
            let imageUri = response.assets?.[0]?.uri;
            if (imageUri) {
              setSelectedImage(imageUri!);

              const filename = imageUri!.substring(
                imageUri!.lastIndexOf('/') + 1,
              );
              const uploadUri =
                Platform.OS === 'ios'
                  ? imageUri!.replace('file://', '')
                  : imageUri;

              const task = storage()
                .ref(`/images/${filename}`)
                .putFile(uploadUri!);

              // Monitor the upload task
              task.on(
                'state_changed',
                (taskSnapshot: {bytesTransferred: any; totalBytes: any}) => {
                  console.log(
                    `${taskSnapshot.bytesTransferred} transferred out of ${taskSnapshot.totalBytes}`,
                  );
                },
              );

              task.then(async () => {
                console.log('Image uploaded to Firebase Storage');
                const downloadURL = await storage()
                  .ref(`/images/${filename}`)
                  .getDownloadURL();
                setSelectedImage(downloadURL);
                setloading(false);
                if (setbool) {
                  setbool(true);
                }
                // if (!isRegister) {
                //   const userDocRef = firestore()
                //     .collection('test_users')
                //     .doc(user?.id);
                //   await userDocRef.update({imageUrl: downloadURL});
                // }
              });
            }
          }
        },
      );
    } catch (err) {
      setloading(false);
      showToast('Something went wrong');
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      console.log('hits images here');
      if (user?.photoUrl) {
        setSelectedImage(user.photoUrl);
      }
      return () => {
        setSelectedImage('');
      };
    }, []),
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={openImagePicker}>
        <View>
          {loading ? (
            <ActivityIndicator
              style={styles.sourceContainer}
              size="large"
              color="white"
            />
          ) : selectedImage ? (
            <Image
              source={{uri: selectedImage}}
              style={styles.sourceContainer}
            />
          ) : (
            <Image
              style={styles.placeholderContainer}
              source={require('../../../../assets/nouser.png')}
            />
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  sourceContainer: {
    marginTop: 20,
    borderRadius:
      Math.round(
        Dimensions.get('window').width + Dimensions.get('window').height,
      ) / 2,
    width: Dimensions.get('window').width * 0.33,
    height: Dimensions.get('window').width * 0.33,
    marginBottom: 10,
    backgroundColor: tealColor,
    justifyContent: 'center',
    alignItems: 'center',
  },

  placeholderContainer: {
    alignSelf: 'center',
    width: Dimensions.get('window').width * 0.33,
    height: Dimensions.get('window').width * 0.33,
    marginTop: 20,
    marginBottom: 10,
    resizeMode: 'contain',
  },
});

export default ImagePickerComponent;
