// import React from 'react';
// import {useState} from 'react';
// import {Image, StyleSheet, Text, TouchableOpacity, View} from 'react-native';
// import ImagePicker from 'react-native-image-picker';

// const ImagePickerComponent = () => {
//   const [selectedImage, setSelectedImage] = useState(null);

//   const pickImage = () => {
//     ImagePicker.showImagePicker(
//       {
//         title: 'Select Image',
//         storageOptions: {
//           skipBackup: true,
//           path: 'images',
//         },
//       },
//       response => {
//         if (response.didCancel) {
//           console.log('User cancelled image picker');
//         } else if (response.error) {
//           console.log('ImagePicker Error: ', response.error);
//         } else {
//           const source = {uri: response.uri};
//           setSelectedImage(source);
//         }
//       },
//     );
//   };

//   return (
//     <View style={styles.container}>
//       <TouchableOpacity onPress={pickImage}>
//         <View style={styles.imageContainer}>
//           {selectedImage ? (
//             <Image source={selectedImage} style={styles.image} />
//           ) : (
//             <View style={styles.placeholder}>
//               <Text>Select Image</Text>
//             </View>
//           )}
//         </View>
//       </TouchableOpacity>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   imageContainer: {
//     width: 120,
//     height: 120,
//     borderRadius: 60,
//     backgroundColor: '#ddd', // Placeholder background color
//     justifyContent: 'center',
//     alignItems: 'center',
//     overflow: 'hidden',
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     borderRadius: 60,
//   },
//   placeholder: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
// });

// export default ImagePickerComponent;
