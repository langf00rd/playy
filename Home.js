import React, { useState, useEffect, createRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, FlatList, ScrollView, Dimensions, Alert } from 'react-native';
import ActionSheet from "react-native-actions-sheet";
import { OptimizedFlatList } from 'react-native-optimized-flatlist';
import * as MediaLibrary from 'expo-media-library';
import { Platform } from 'expo-modules-core';
import { Audio } from 'expo-av';

function Home() {

    const playingTrackRef = createRef()
    const [files, setFiles] = useState([])
    const [index, setindex] = useState(0)
    const [soundInstance, setsoundInstance] = useState(null)
    // const [permissionStatus, setpermissionStatus] = useState()
    const [isPlaying, setisPlaying] = useState(false)
    const [currentPlayingFile, setCurrentPlayingFile] = useState({ 'filename': '' })

    useEffect(() => {

        const reqPermission = async () => {
            // console.log('requesting permission...', index)

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true
            });

            const { status } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
            if (status === 'granted') fetchFiles()
            if (status !== 'granted') { await MediaLibrary.requestPermissionsAsync() }

            // console.log(status)
        }

        reqPermission()

    }, [files])

    useEffect(() => {
        const listenForActions = async () => {

            if (files[index] !== undefined) {

                console.log('undefined', files[index])

                if (soundInstance != null) {
                    await soundInstance.unloadAsync()
                    setsoundInstance(null)
                }

                const initialStatus = { shouldPlay: true }
                const source = { uri: files[index].uri }

                const { sound, status } = await Audio.Sound.createAsync(source, initialStatus)

                setsoundInstance(sound)

            } else console.log('files[index] undefined')
        }

        listenForActions()
    }, [index])

    let renderItem = (file) => (
        <TouchableOpacity key={file.index} style={{ paddingVertical: 5 }} onPress={() => initPlay(file.index, file.item)}>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ backgroundColor: '#242424', width: 45, height: 45, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                    <Text style={{ fontWeight: 'bold', fontSize: 20, color: '#ff628a' }}>{file.item.filename.split('')[0]}</Text>
                </View>

                <View style={{ height: 20, width: 20 }} />

                <View>
                    <Text numberOfLines={1} style={{ color: '#fff' }}>{file.item.filename}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    const fetchFiles = async () => {
        try {

            let media = await MediaLibrary.getAssetsAsync({ mediaType: MediaLibrary.MediaType.audio })

            media = await MediaLibrary.getAssetsAsync({
                mediaType: MediaLibrary.MediaType.audio,
                first: media.totalCount
            })

            setFiles(media.assets)

            // setplaylist([...playlist, media.assets[0]])

        } catch (e) { console.log(e) }

    }

    const initPlay = async (fileIndex, file) => {

        setindex(fileIndex)
        setCurrentPlayingFile(file)
        setisPlaying(true)

        const { sound } = await Audio.Sound.createAsync(file)

        setsoundInstance(sound)

        // sound.playAsync()

        // console.log('soundInstance ---->', fileIndex, index)

        // setindex(fileIndex)
        // if (fileIndex !== null) console.log('soundInstance ---->', fileIndex, index)
        // startPlaying()
    }

    const showPlaying = () => {
        playingTrackRef.current?.setModalVisible()
    }

    function startPlaying() {
        console.log(index)
    }


    return (
        <View style={styles.container}>

            <StatusBar backgroundColor="#000" barStyle="light-content" />

            <View style={{ paddingVertical: 15, paddingTop: 0 }}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff' }}>My List</Text>
            </View>

            <OptimizedFlatList
                data={files}
                renderItem={renderItem}
            />

            {
                isPlaying ? (
                    <TouchableOpacity
                        onPress={() => showPlaying()}
                        style={{
                            backgroundColor: '#242424',
                            padding: 10,
                            borderRadius: 100,
                            position: 'absolute',
                            bottom: 50,
                            width: Dimensions.get('window').width,
                            alignItems: 'center',
                            // justifyContent: 'center',
                            flexDirection: 'row'
                        }}>
                        <View style={{
                            backgroundColor: "#fff",
                            width: 30,
                            height: 30,
                            borderRadius: 130,
                            alignItems: 'center',
                            justifyContent: 'center',
                        }}>
                            <Text style={{ fontWeight: 'bold', color: '#ff628a' }}>{currentPlayingFile.filename.split('')[0]}</Text>
                        </View>
                        <View style={{ width: 20, height: 20 }} />
                        <Text numberOfLines={1} style={{ color: '#fff' }}>{currentPlayingFile.filename}</Text>
                    </TouchableOpacity>)

                    : <View></View>
            }

            <ActionSheet
                gestureEnabled={true}
                defaultOverlayOpacity={0}
                elevation={0}
                ref={playingTrackRef}
                closable={true}
                containerStyle={{
                    height: Dimensions.get('window').height,
                    padding: 30,
                    backgroundColor: '#242424',
                    paddingTop: 30
                }}>

                <View style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                }}>
                    <View style={{
                        backgroundColor: '#000',
                        width: Dimensions.get('window').width - 50,
                        height: Dimensions.get('window').height / 3,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 10
                    }}>
                        <Text style={{ fontWeight: 'bold', fontSize: 30, color: '#ff628a' }}>{currentPlayingFile.filename.split('')[0]}</Text>
                    </View>
                </View>

                <View style={{ height: 30, width: 30 }} />
                <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff' }}>{currentPlayingFile.filename}</Text>

            </ActionSheet>
        </View>
    )
}




const styles = StyleSheet.create({
    container: {

        // marginTop: 100,
        paddingTop: Platform.OS === 'ios' ? 100 : 30,
        padding: 20,
        backgroundColor: '#000',
        // flex: 1,
        // backgroundColor: '#fff',
        // paddingTop: 100,
        // paddingHorizontal: 20
    },
});


export default Home