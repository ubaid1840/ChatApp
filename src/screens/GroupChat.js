import { View, Text, SafeAreaView, Alert, BackHandler, Image, StatusBar, TextInput, Dimensions, TouchableOpacity, FlatList, ActivityIndicator, Modal, StyleSheet } from "react-native";
import styles from "../Style";
import { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "../config/firebase";
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, getFirestore, query, orderBy, serverTimestamp, onSnapshot, getCountFromServer } from "firebase/firestore";


let countfetch = 0
let tempMsg = ""


export function ChatScreen(props) {

    const [modalVisible, setModalVisible] = useState(false);

    const [loading, setloading] = useState(true)

    const flatlistRef = useRef()



    const width = Dimensions.get("window").width
    const height = Dimensions.get("window").height

    const [Message, setMessage] = useState("")

    useEffect(() => {
        const backAction = () => {
            // Alert.alert('Exit App', 'Are you sure you want to Logout?', [
            //     {
            //         text: 'Cancel',
            //         onPress: () => null,
            //         style: 'cancel',
            //     },
            //     {
            //         text: 'YES', onPress: () => {
            //             logoutaccount()
            //         }
            //     },
            // ]);
            setModalVisible(true)
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    const logoutaccount = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            //  console.log('user sign out')
            props.navigation.goBack()
        }).catch((error) => {
            console.log(error)
        });
    }

    // const currentuseraccount = () => {
    //     const auth = getAuth()
    //     return (
    //         auth.currentUser.email
    //     )
    // }

    const db = getFirestore(app)

    const savedata = async () => {
        //Id:increment(1)
        const count = getcol()
        if (count == 0) {

            try {
                await addDoc(collection(db, "chat"), {
                    key: 1,
                    msg: Message,
                    msgFrom: getAuth().currentUser.email,
                    timestamp: serverTimestamp()
                });
                setMessage("")

            } catch (e) {
                alert(e)

            }
        }
        else {
            try {
                await addDoc(collection(db, "chat"), {
                    key: countfetch + 1,
                    msg: Message,
                    msgFrom: getAuth().currentUser.email,
                    timestamp: serverTimestamp()
                });
                setMessage("")

            } catch (e) {
                alert(e)

            }
        }
    }

    const [datalist, setdatalist] = useState([])

    // const fetchdata = async () => {


    //         // const dbdata = await getDocs(q);
    //         // dbdata.forEach((doc) => {
    //         //     // doc.data() is never undefined for query doc snapshots
    //         //     dataarray.push(doc.data())
    //         // });
    //         // setdatalist(dataarray)


    //     return unsubscribe
    // }

    useEffect(() => {
        const chatRef = collection(db, "chat");
        const q = query(chatRef, orderBy("timestamp", 'asc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const chat = [];
            querySnapshot.forEach((doc) => {
                chat.push(doc.data());
                countfetch = doc.data().key
               // console.log(doc.data())
            });
            setdatalist(chat)
            setloading(false)
        });

        return () => unsubscribe()
    }, [])

    // useEffect(() => {
    //     fetchdata()
    // }, [RefreshData])


    // const latestdata = async () => {

    //     const chatRef = collection(db, "chat");
    //     const q = query(chatRef, orderBy("timestamp", 'asc'));

    //     const qsnap = await getDocs(q);
    //     qsnap.forEach((doc) => {
    //         // doc.data() is never undefined for query doc snapshots
    //         console.log(doc.id, " => ", doc.data());
    //     });
    // }

    // useEffect(() => {
    //     setTimeout(() => {
    //         fetchdata()
    //     }, 5000);
    //     setRefreshData(!RefreshData)
    //     console.log("ubaid")
    //   }, [RefreshData]);

    // useEffect(() => {
    // fetchdata()
    // })

    // useEffect(() => {
    //     const intervalIdstart = setInterval(() => {
    //         fetchdata()
    //         setloading(false)
    //     }, 5000);


    //     // return () => clearInterval(intervalId);
    // }, []);

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    const getcol = async () => {
        try {
            const coll = collection(db, "chat");
            const snapshot = await getCountFromServer(coll);
            // console.log('count: ', snapshot.data().count);
            return snapshot.data().count

        } catch (e) {
            console.log(e)

        }

    }


    return (

        <SafeAreaView style={{ flex: 1, backgroundColor: '#000000E3' }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                    setModalVisible(!modalVisible);
                }}>
                <View style={styless.centeredView}>
                    <View style={styless.modalView}>
                        <Text style={styless.modalText}>Are you sure you want to logout?</Text>
                        <TouchableOpacity onPress={() => {
                            logoutaccount()
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 120, height: 50, alignSelf: 'flex-end', borderRadius: 50, backgroundColor: 'orange', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#000000E3', fontWeight: 'bold', fontSize: 15 }}>Yes</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(!modalVisible)
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 120, height: 50, alignSelf: 'flex-end', borderRadius: 50, backgroundColor: 'orange', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#000000E3', fontWeight: 'bold', fontSize: 15 }}>No</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            {loading ? CustomActivityIndicator() : null}

            {/* <Text>user login {currentuseraccount()} </Text> */}
            {/* <ImageBackground style={{ height: height, width: width, justifyContent: 'flex-end', position: 'absolute', left: 0, top: 0, }} source={require('../../assets/papers.co-si07-smoke-blue-dark-sea-gradation-blur-41-iphone-wallpaper.jpg')}></ImageBackground> */}
            <View style={{ width: '100%', height: '100%' }}>

                <View style={{ paddingTop: 10, flexDirection: 'row', borderBottomWidth: 1, borderColor: 'black', paddingBottom: 10, backgroundColor: 'black', }}>
                    <TouchableOpacity style={{}} onPress={() => {
                        // Alert.alert('Exit App', 'Are you sure you want to Logout?', [
                        //     {
                        //         text: 'No',
                        //         onPress: () => null,
                        //         style: 'cancel',
                        //     },
                        //     {
                        //         text: 'YES', onPress: () => {
                        //             logoutaccount()
                        //         }
                        //     },
                        // ]);
                        setModalVisible(!modalVisible)
                        return true;

                    }}>
                        <Image style={{ height: 40, width: 40, }} source={require('../../assets/leftarrow.png')}></Image>
                    </TouchableOpacity>

                    {/* <TouchableOpacity onPress={() => {
                        latestdata()
                    }}>
                        <Text style={{ color: 'white' }}>Click</Text>
                    </TouchableOpacity> */}

                    <Image style={{ height: 40, width: 40 }} source={require('../../assets/nouserdp.png')}></Image>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ marginLeft: 15, color: 'white', fontSize: 12 }}>Login as</Text>
                        <Text style={{ marginLeft: 15, color: 'white', fontSize: 15 }}>{getAuth().currentUser.email}</Text>
                    </View>
                    {/* <TouchableOpacity style={{position:'absolute', right:10, top:10}} onPress={() => {
                        Alert.alert('Logout', 'Are you sure you want to Logout?', [
                            {
                                text: 'No',
                                onPress: () => null,
                                style: 'cancel',
                            },
                            {
                                text: 'YES', onPress: () => {
                                    logoutaccount()
                                }
                            },
                        ]);
                        return true;

                    }}>
                    <Image style={{ height: 40, width: 40 }} source={require('../../assets/close.png')}></Image>
                    </TouchableOpacity> */}
                </View>

                <View style={{ height: '82%', marginBottom: 10, width: '90%', alignSelf: 'center' }}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        data={datalist}
                        ref={flatlistRef}
                        onContentSizeChange={() => {
                            if (datalist.length != 0) {
                                flatlistRef.current.scrollToEnd({ animated: true })
                            }
                        }}

                        onLayout={() => {
                            if (datalist.length != 0) {
                                flatlistRef.current.scrollToEnd()
                            }
                        }
                        }

                        renderItem={({ item, index }) => {
                            return (
                                item.msgFrom == getAuth().currentUser.email ?
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 15, justifyContent: 'flex-end' }}>

                                        <View style={{}}>
                                            <Text style={{ fontSize: 15, color: 'white', alignSelf: 'flex-end', fontWeight: '500' }}>{item.msgFrom}</Text>
                                            <View style={{ backgroundColor: '#004662', justifyContent: 'center', padding: 15, marginLeft: 12, borderTopLeftRadius: 25, borderBottomRightRadius: 20, borderBottomLeftRadius: 25 }}>
                                                <Text style={{ fontSize: 15, color: 'white', }}>{item.msg}</Text>
                                                {item.timestamp != undefined ?
                                                    <Text style={{ fontSize: 10, color: 'white' }}>{
                                                        item.timestamp.toDate().toUTCString()
                                                    }</Text> : null}
                                            </View>
                                        </View>
                                        <Image style={{ height: 35, width: 35, marginLeft: 10, marginTop: 10 }} source={require('../../assets/nouserdp.png')}></Image>

                                    </View>
                                    :
                                    <View style={{ flexDirection: 'row', paddingTop: 15, paddingBottom: 15, justifyContent: 'flex-start' }}>
                                        <Image style={{ height: 35, width: 35, marginTop: 10 }} source={require('../../assets/nouserdp.png')}></Image>
                                        <View style={{}}>
                                            <Text style={{ fontSize: 15, marginLeft: 10, color: 'white', fontWeight: '500' }}>{item.msgFrom}</Text>
                                            <View style={{ marginLeft: 10, backgroundColor: '#C7774B', justifyContent: 'center', paddingLeft: 15, paddingRight: 15, paddingTop: 15, paddingBottom: 15, borderTopRightRadius: 25, borderBottomRightRadius: 25, borderBottomLeftRadius: 20, marginRight: 12, }}>
                                                <Text style={{ fontSize: 15, color: 'white' }}>{item.msg}</Text>
                                                {item.timestamp != undefined ? <Text style={{ fontSize: 10, color: 'white' }}>{
                                                    item.timestamp.toDate().toUTCString()
                                                }</Text> : null}
                                            </View>
                                        </View>
                                    </View>
                            )
                        }}
                    />
                </View>


                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 10, left: 0, right: 0 }}>
                    <View style={{ width: '90%', backgroundColor: '#FFFFFF', height: 60, borderRadius: 30, flexDirection: 'row', marginLeft: 5, alignItems: 'center' }}>
                        {/* <TouchableOpacity style={{ marginLeft: 10, alignItems: 'center' }}>
                            <Image style={{ height: 30, width: 30 }} source={require('../../assets/emoji.png')}></Image>
                        </TouchableOpacity> */}

                        <TextInput style={{ height: 45, width: '64%', paddingLeft: 20, color: 'black' }} placeholder='Type Your Message' value={Message} onChangeText={(val) => { setMessage(val) }}></TextInput>


                        {/* <TouchableOpacity style={{}}>
                            <Image style={{ height: 30, width: 30, }} source={require('../../assets/attachment.png')}></Image>
                        </TouchableOpacity>
                        <TouchableOpacity style={{ marginLeft: 10 }}>
                            <Image style={{ height: 30, width: 30, }} source={require('../../assets/camera.png')}></Image>
                        </TouchableOpacity> */}
                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', right: 5, height: 50, width: 50, borderRadius: 25, backgroundColor: '#FDD180', alignItems: 'center', justifyContent: 'center' }}>
                            <TouchableOpacity style={{}} onPress={() => {
                                tempMsg = Message
                                setMessage("")
                                savedata()
                            }}>
                                <Image style={{ height: 30, width: 25, }} source={require('../../assets/enter.png')}></Image>
                            </TouchableOpacity>
                        </LinearGradient>
                    </View>
                </View>
                <StatusBar style="auto" hidden={true} />

            </View>


        </SafeAreaView>
    )
}

const styless = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 22,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
});
