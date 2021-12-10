import React, { useState, useRef, useEffect, createRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, StatusBar, FlatList, ScrollView, Dimensions, Alert } from 'react-native';
// import ActionSheet from "react-native-actions-sheet";
import { OptimizedFlatList } from 'react-native-optimized-flatlist';
import Icon from 'react-native-vector-icons/Ionicons';
import * as MediaLibrary from 'expo-media-library';
import { LinearGradient } from 'expo-linear-gradient';
import RBSheet from "react-native-raw-bottom-sheet";
import { Audio } from 'expo-av';
import styles from './styles';

function Home() {

    // const playingTrackRef = createRef()
    const refRBSheet = useRef();


    const [files, setFiles] = useState([])
    const [index, setindex] = useState(0)
    const [soundInstance, setsoundInstance] = useState(null)
    const [soundInstanceStatus, setsoundInstanceStatus] = useState()
    const [isPaused, setisPaused] = useState(true)
    // const [permissionStatus, setpermissionStatus] = useState()
    const [isPlaying, setisPlaying] = useState(true)
    const [hasStartedPlaying, sethasStartedPlaying] = useState(false)
    const [currentPlayingFile, setCurrentPlayingFile] = useState({ 'filename': '' })

    useEffect(() => {

        const reqPermission = async () => {

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true
            });

            const { status } = await MediaLibrary.requestPermissionsAsync().catch(e => { console.log(e) })
            if (status === 'granted') fetchFiles()
            if (status !== 'granted') { await MediaLibrary.requestPermissionsAsync() }

        }

        reqPermission()

    }, [files])

    useEffect(() => {
        const listenForActions = async () => {

            try {
                if (files[index] !== undefined) {

                    console.log('undefined', files[index])

                    if (soundInstance != null) {
                        await soundInstance.unloadAsync()
                        setsoundInstance(null)
                    }

                    const initialStatus = { shouldPlay: true }
                    const source = { uri: files[index].uri }

                    const { sound, status } = await Audio.Sound.createAsync(source, initialStatus)

                    setsoundInstanceStatus(status)
                    setsoundInstance(sound)

                } else console.log('files[index] undefined')
            }

            catch (e) {
                Alert.alert('File cannot be played')
            }
        }

        listenForActions()
    }, [index])

    let renderItem = (file) => (
        <TouchableOpacity key={file.index} style={{
            paddingHorizontal: 20,
            paddingVertical: 3,
        }} onPress={() => initPlay(file.index, file.item)}>
            <View style={{ alignItems: 'center', flexDirection: 'row' }}>
                <View style={{ backgroundColor: '#2c2c2e88', width: 50, height: 50, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }}>
                    <Icon name='ios-musical-notes-sharp' size={26} color={file.index === index ? '#d43859' : '#2c2c2e'} />
                </View>

                <View style={{ height: 20, width: 20 }} />

                <View>
                    <Text numberOfLines={1} style={{ color: file.index === index ? '#d43859' : '#fff', width: Dimensions.get('window').width - 100 }}>{file.item.filename}</Text>
                </View>
            </View>
        </TouchableOpacity >
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

        try {
            setindex(fileIndex)
            setCurrentPlayingFile(file)
            setisPlaying(true)
            setisPaused(false)

            const { sound } = await Audio.Sound.createAsync(file)

            setsoundInstance(sound)
        }

        catch (e) {
            console.log(e)
            Alert.alert('File cannot be played')
        }
    }

    const showPlaying = () => {
        refRBSheet.current.open()
        // playingTrackRef.current?.setModalVisible()
        // refRBSheet.current.open()
    }

    const playNext = () => {
        if (index >= 0) initPlay(index + 1, files[index + 1])
        else initPlay(0, files[0])
    }

    const playPrev = () => {
        if (index <= files.length) initPlay(index - 1, files[index - 1])
        else initPlay(0, files[0])
    }

    const pause = () => {
        soundInstance.pauseAsync()
        setisPaused(true)
    }

    const unPause = () => {
        soundInstance.playAsync()
        setisPaused(false)
    }


    return (
        <View style={styles.container}>

            <StatusBar backgroundColor="#000" barStyle="light-content" />

            <View style={{ paddingVertical: 15, paddingTop: 0, paddingHorizontal: 20, }}>
                <Text style={{ fontSize: 26, fontWeight: 'bold', color: '#fff' }}>My List</Text>
            </View>

            <View style={[styles.flexBetween, { paddingHorizontal: 20, paddingBottom: 10 }]}>
                <TouchableOpacity style={[styles.btn, styles.flexEvenly]} onPress={() => refRBSheet.current.open()}>
                    <Icon name='play' size={25} color='#d43859' />
                    <Text style={{ color: '#d43859' }}>Play</Text>
                </TouchableOpacity>

                <TouchableOpacity style={[styles.btn, styles.flexEvenly]}>
                    <Icon name='ios-shuffle' size={25} color='#d43859' />
                    <Text style={{ color: '#d43859' }}>Shuffle</Text>
                </TouchableOpacity>
            </View>

            <View style={{ height: Dimensions.get('window').height - 200, marginBottom: 70 }}>
                <OptimizedFlatList
                    data={files}
                    renderItem={renderItem}
                />
            </View>

            {
                isPlaying ? (
                    <View
                        style={{
                            backgroundColor: '#2c2c2e',
                            padding: 10,
                            paddingHorizontal: 20,
                            borderRadius: 5,
                            position: 'absolute',
                            bottom: 10,
                            width: Dimensions.get('window').width,
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',
                            height: 60
                        }}>

                        <TouchableOpacity onPress={() => showPlaying()}>
                            <View style={{
                                backgroundColor: "#fff",
                                width: 35,
                                height: 35,
                                borderRadius: 5,
                                alignItems: 'center',
                                justifyContent: 'space-between',
                            }}>
                                <Text style={{ fontWeight: 'bold', color: '#d43859' }}>{currentPlayingFile.filename.split('')[0]}</Text>
                            </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => showPlaying()}>
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexDirection: 'row'
                            }}>
                                <View style={{ width: 10, height: 10 }} />
                                <View style={{ width: Dimensions.get('window').width - 230 }}>
                                    <Text numberOfLines={1} style={{ color: '#fff' }}>{currentPlayingFile.filename}</Text>
                                </View>
                            </View>
                        </TouchableOpacity>

                        <View style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            flexDirection: 'row',

                        }}>

                        </View>
                        <TouchableOpacity onPress={() => playPrev()}>
                            <Icon name="play-back" color='#fff' size={29} />
                        </TouchableOpacity>
                        <View style={{ width: 10, height: 10 }} />

                        {
                            isPaused ?
                                <TouchableOpacity onPress={() => unPause()}>
                                    <Icon name="play" color='#fff' size={29} />
                                </TouchableOpacity>
                                : <TouchableOpacity onPress={() => pause()}>
                                    <Icon name="pause" color='#fff' size={29} />
                                </TouchableOpacity>
                        }
                        <View style={{ width: 10, height: 10 }} />

                        <TouchableOpacity onPress={() => playNext()}>
                            <Icon name="play-forward" color='#fff' size={29} />
                        </TouchableOpacity>
                    </View>)

                    : <View></View>
            }


            <ScrollView>
                <RBSheet
                    ref={refRBSheet}
                    closeOnDragDown={false}
                    animationType={'slide'}
                    closeOnPressMask={true}
                    height={Dimensions.get('window').height}
                    customStyles={{
                        wrapper: { backgroundColor: "transparent" },
                        container: { borderRadius: 10, },
                        draggableIcon: { backgroundColor: "red" }
                    }} >

                    <LinearGradient
                        colors={['#8b5d4d', '#85624f', '#593a38']}
                        style={{
                            height: Dimensions.get('window').height,
                            padding: 30,
                            paddingTop: 10,
                            backgroundColor: '#8b5d4d',
                        }}>
                        <View style={styles.flexBetween}>
                            <TouchableOpacity onPress={() => refRBSheet.current.close()}>
                                <Icon name='ios-chevron-down-sharp' size={29} color='#fff' />
                            </TouchableOpacity>
                            <View></View>
                        </View>

                        <View>
                            <View style={[styles.flex, { paddingTop: 30 }]}>

                                <View style={[styles.flexCenter, {
                                    backgroundColor: '#242424',
                                    width: 70,
                                    height: 70,
                                    borderRadius: 10
                                }]}>
                                    <Text style={{ fontWeight: 'bold', fontSize: 30, color: '#d43859' }}>{currentPlayingFile.filename.split('')[0]}</Text>
                                </View>
                                <View style={{ height: 20, width: 20 }} />
                                <View style={{ paddingRight: 20 }}>
                                    <Text numberOfLines={2} style={{ fontSize: 18, color: '#fff' }}>{currentPlayingFile.filename}</Text>
                                </View>

                            </View>

                            <View style={styles.space30} />

                            <View style={styles.flexCenter}>
                                <View style={[styles.flexBetween, {
                                    height: 30,
                                    paddingHorizontal: 30,
                                    width: Dimensions.get('window').width,
                                }]}>
                                    <TouchableOpacity onPress={() => playPrev()}>
                                        <Icon name="play-back" color='#fff' size={29} />
                                    </TouchableOpacity>
                                    <View style={{ width: 10, height: 10 }} />

                                    {
                                        isPaused ?
                                            <TouchableOpacity onPress={() => unPause()}>
                                                <Icon name="play" color='#fff' size={29} />
                                            </TouchableOpacity>
                                            : <TouchableOpacity onPress={() => pause()}>
                                                <Icon name="pause" color='#fff' size={29} />
                                            </TouchableOpacity>
                                    }
                                    <View style={{ width: 10, height: 10 }} />

                                    <TouchableOpacity onPress={() => playNext()}>
                                        <Icon name="play-forward" color='#fff' size={29} />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.space30} />

                            <View style={{ marginLeft: -20 }}>
                                <OptimizedFlatList
                                    data={files}
                                    renderItem={renderItem}
                                />
                            </View>

                        </View>
                    </LinearGradient>
                </RBSheet>
            </ScrollView>
        </View >
    )
}



export default Home