import React, { useState, useEffect, createRef } from 'react';
// import { StyleSheet, Text, View, TouchableOpacity, StatusBar, FlatList, ScrollView, Dimensions, Alert } from 'react-native';
// import ActionSheet from "react-native-actions-sheet";
// import { UltimateListView, UltimateRefreshView } from 'react-native-ultimate-listview'

// import { Audio } from 'expo-av';

// import Sound from 'react-native-sound';

// import { OptimizedFlatList } from 'react-native-optimized-flatlist'

// import * as MediaLibrary from 'expo-media-library';
// import { Platform } from 'expo-modules-core';
import Home from './Home';



export default function App() {

  // const initPlay = async (fileIndex, file) => {

  // if (fileInstance != null) {
  //   await fileInstance.unloadAsync()
  //   setfileInstance(null)
  // }

  //   // setindex(fileIndex)

  //   const source = { uri: files[fileIndex].uri }
  //   const initialStatus = {
  //     // shouldPlay: true,
  //   }

  //   const { sound, status } = await Audio.Sound.createAsync(source, initialStatus)

  //   if (status.isLoaded) {
  //     console.log('isLoaded...', source)

  //     setfileInstance(sound)
  //     setstatus(status)
  //     startPlaying()
  //   }
  // }


  // if (noTracks) return <View style={styles.container}>
  //   <StatusBar barStyle="dark-content" />
  //   <Text style={{ fontSize: 25, fontWeight: 'bold' }}>My List</Text>
  // </View>

  return Home()

}