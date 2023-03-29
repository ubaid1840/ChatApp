import { View, Text, SafeAreaView, BackHandler, Image, StatusBar, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Modal } from "react-native";
import styles from "../Style";
import { useState, useEffect, useRef } from "react";
import { getAuth } from "firebase/auth";
import app from "../config/firebase";
import { LinearGradient } from 'expo-linear-gradient';
import { collection, addDoc, getDocs, getFirestore, query, orderBy, serverTimestamp, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import * as MediaLibrary from 'expo-media-library';
import * as FileSystem from 'expo-file-system';

import Constants from "expo-constants";





export function IndividualChatScreen(props) {

    let { communication, currentuserdp, otheruserdp, chattingwith, otheruser } = props.route.params
    const [datalist, setdatalist] = useState([])
    const [Message, setMessage] = useState("")
    const [loading, setloading] = useState(true)
    const [modalVisible1, setModalVisible1] = useState(false);
    const [deletemsgindex, setDeletemsgindex] = useState("")
    const [seen, setSeen] = useState("")
    const [otheruserprofilemodal, setOtheruserprofilemodal] = useState(false)

    const flatlistRef = useRef()

    useEffect(() => {
        const backAction = () => {
            props.navigation.navigate('Home')
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, []);


    const db = getFirestore(app)

    // const getcol = async () => {
    //     let j = 0
    //     // try {
    //     //     const querySnapshot = await getDocs(collection(db, communication), orderBy("timestamp", 'desc'));
    //     //     querySnapshot.forEach((doc) => {
    //     //         if (j == 0) {
    //     //             testvalue = doc.data().key + 1
    //     //             console.log("ub")
    //     //             console.log(testvalue)
    //     //             console.log("bu")
    //     //             j++
    //     //         }
    //     //     });
    //     //     // console.log(countref.current)
    //     // } catch (e) {
    //     //     console.log(e)
    //     // }



    //     getDocs(collection(db, communication), orderBy("timestamp", 'desc')).then((querySnapshot) => {
    //         querySnapshot.forEach((doc) => {
    //             if (j == 0) {
    //                 testvalue = doc.data().key + 1
    //                 console.log("ub")
    //                 console.log(testvalue)
    //                 console.log("bu")
    //                 j++
    //             }
    //         });
    //     });

    //     return testvalue;
    //     // console.log(countref.current)



    // }

    // useEffect(() => {
    //     getcol()
    // }, [])

    const savedata = async () => {

        // getcol().then((val)=>{
        //     console.log("zainu")
        //     console.log(val)
        // })


        try {
            await addDoc(collection(db, communication),
                {
                    //key: countref.current,
                    msg: Message,
                    msgFrom: getAuth().currentUser.email,
                    localtime: new Date().toLocaleString([], { hour12: true }),
                    timestamp: serverTimestamp()

                });
            setMessage("")

        }
        catch (e) {
            alert(e)
        }
    }



    useEffect(() => {

        const chatRef = collection(db, communication);
        const q = query(chatRef, orderBy("timestamp", 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let i = 0
            const chat = [];
            querySnapshot.forEach((doc) => {
                chat.push(doc.data());
                if (i == 0 && doc.data().msgFrom != getAuth().currentUser.email) {
                    setSeen(doc.data().localtime)
                    i++
                }
            });

            setdatalist(chat)
            setloading(false)

        });

        return () => unsubscribe()
    }, [])



    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    const deletemsg = async (docid) => {
        try {
            await deleteDoc(doc(db, communication, docid));
            setModalVisible1(!modalVisible1)
        } catch (e) {
            alert(e)
        }
    }


    const checkvalue = async (index) => {

        try {
            const querySnapshot = await getDocs(collection(db, communication));
            querySnapshot.forEach((doc) => {
                if (doc.data().timestamp.isEqual(datalist[index].timestamp)) {
                    deletemsg(doc.id)
                }

            });
        } catch (e) {
            console.log(e)
        }

        //   alert('message deleted')
    }

    const downloadfile = () => {
        const uri = otheruser.dp
        let fileUri = FileSystem.documentDirectory + Date.now() + ".jpeg";
        FileSystem.downloadAsync(uri, fileUri)
            .then(({ uri }) => {
                saveFile(uri);
            })
            .catch(error => {
                console.log(error);
            })
    }

    const saveFile = async (fileUri) => {
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status === "granted") {
            const asset = await MediaLibrary.createAssetAsync(fileUri)
            await MediaLibrary.createAlbumAsync("Download", asset, false)
            alert("file downloaded")
        }
    }

    return (

        <SafeAreaView style={{ backgroundColor: '#000000E3', flex:1}}>

            <View style={{ width: '100%', height: '100%', paddingTop: Constants.statusBarHeight }}>

                <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: 'black', backgroundColor: 'black', alignItems: 'center', height: 60 }}>
                    <TouchableOpacity style={{}} onPress={() => {
                        props.navigation.navigate('Home')
                        return true;

                    }}>
                        <Image style={{ height: 40, width: 40, }} source={require('../../assets/leftarrow.png')}></Image>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {
                        setOtheruserprofilemodal(!otheruserprofilemodal)
                    }}>
                        {
                            otheruserdp == null || otheruserdp == undefined || otheruserdp == ""
                                ?
                                <Image style={{ height: 35, width: 35, marginLeft: 10, }} source={require('../../assets/nouserdp.png')}></Image>
                                :
                                <Image style={{ height: 40, width: 40, marginLeft: 10, borderRadius: 20 }} src={otheruserdp}></Image>
                        }
                    </TouchableOpacity>
                    <View style={{ flexDirection: 'column' }}>
                        <Text style={{ marginLeft: 15, color: 'white', fontSize: 15 }}>{ }{chattingwith}</Text>
                        {seen != null || seen != ""
                            ?
                            <Text style={{ marginLeft: 15, color: 'white', fontSize: 12 }}>Last message {seen}</Text>
                            : null
                        }


                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={otheruserprofilemodal}
                    onRequestClose={() => {
                        setOtheruserprofilemodal(!otheruserprofilemodal);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            {otheruser.dp == "" || otheruser.dp == null || otheruser.dp == undefined ?
                                <Image style={{ width: 200, height: 200, marginRight: 50, marginLeft: 50 }} source={require('../../assets/nouserdp.png')}></Image>
                                :
                                <Image style={{ width: 200, height: 200, borderRadius: 100, marginRight: 50, marginLeft: 50 }} src={otheruser.dp}></Image>
                            }
                             {otheruser.dp == "" || otheruser.dp == null || otheruser.dp == undefined ? null :
                            <TouchableOpacity onPress={() => {
                                downloadfile()
                            }}>
                                <Image style={{ height: 35, width: 35, marginVertical: -25, marginBottom: 20, marginLeft: 100, }} source={require('../../assets/download.png')}></Image> 
                            </TouchableOpacity> }
                            <Text style={[styles.modalText, { fontSize: 18 }]}>Name : {otheruser.firstname.toUpperCase()} {otheruser.lastname.toUpperCase()}</Text>
                            <Text style={[styles.modalText, { fontSize: 18 }]}>Age : {otheruser.age}</Text>
                            <Text style={[styles.modalText, { fontSize: 18 }]}>Contact : {otheruser.number}</Text>
                            <Text style={[styles.modalText, { fontSize: 18 }]}>Email : {otheruser.email}</Text>
                            <TouchableOpacity onPress={() => {
                                setOtheruserprofilemodal(!otheruserprofilemodal);
                            }}>
                                <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                    <Text style={styles.gradientbuttontext}>Close</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => {
                        setModalVisible1(!modalVisible1);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Delete Message</Text>
                            <TouchableOpacity onPress={() => {
                                checkvalue(deletemsgindex)
                            }}>
                                <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                    <Text style={styles.gradientbuttontext}>Yes</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                setModalVisible1(!modalVisible1)
                            }}>
                                <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                    <Text style={styles.gradientbuttontext}>No</Text>
                                    {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <FlatList
                    style={{ width: '100%', alignSelf: 'center', marginBottom: 70 }}
                    showsVerticalScrollIndicator={false}
                    data={datalist}
                    ref={flatlistRef}
                    inverted
                    renderItem={({ item, index }) => {
                        return (

                            item.msgFrom == getAuth().currentUser.email ?
                                <View style={{ flexDirection: 'row', paddingBottom: 20, justifyContent: 'flex-end' }}>
                                    <TouchableOpacity onLongPress={() => {
                                        setDeletemsgindex(index)
                                        setModalVisible1(!modalVisible1)

                                        // checkvalue(index)
                                    }}>
                                        <View style={{}}>
                                            <Text style={{ marginRight: 10, fontSize: 15, color: 'white', alignSelf: 'flex-end', fontWeight: '500' }}>{"You"}</Text>
                                            <View style={{ backgroundColor: '#004662', marginRight: 12, justifyContent: 'center', padding: 15, borderTopLeftRadius: 25, borderBottomRightRadius: 20, borderBottomLeftRadius: 25 }}>
                                                <Text style={{ fontSize: 15, color: 'white', }}>{item.msg}</Text>
                                                <Text style={{ fontSize: 10, color: 'white' }}>{
                                                    item.localtime
                                                }</Text>
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {
                                        currentuserdp == null || currentuserdp == undefined || currentuserdp == ""
                                            ?
                                            <Image style={{ height: 35, width: 35, marginRight: 10, marginTop: 10 }} source={require('../../assets/nouserdp.png')}></Image>
                                            :
                                            <Image style={{ height: 40, width: 40, marginRight: 10, marginTop: 10, borderRadius: 20 }} src={currentuserdp}></Image>
                                    }

                                </View>
                                :
                                <View style={{ flexDirection: 'row', paddingBottom: 20, justifyContent: 'flex-start' }}>
                                    {
                                        otheruserdp == null || otheruserdp == undefined || otheruserdp == ""
                                            ?
                                            <Image style={{ height: 35, width: 35, marginLeft: 10, marginTop: 10 }} source={require('../../assets/nouserdp.png')}></Image>
                                            :
                                            <Image style={{ height: 40, width: 40, marginLeft: 10, marginTop: 10, borderRadius: 20 }} src={otheruserdp}></Image>
                                    }
                                    <View style={{}}>
                                        <Text style={{ fontSize: 15, marginLeft: 10, color: 'white', fontWeight: '500' }}>{item.msgFrom}</Text>
                                        <View style={{ marginLeft: 10, backgroundColor: '#C7774B', justifyContent: 'center', padding: 15, borderTopRightRadius: 25, borderBottomRightRadius: 25, borderBottomLeftRadius: 20, marginRight: 12, }}>
                                            <Text style={{ fontSize: 15, color: 'white' }}>{item.msg}</Text>

                                            {item.timestamp != undefined || item.timestamp != null ? <Text style={{ fontSize: 10, color: 'white' }}>{
                                                item.localtime
                                            }</Text> : null}
                                        </View>
                                    </View>
                                </View>
                        )
                    }}
                />

                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', position: 'absolute', bottom: 10, left: 0, right: 0 }}>
                    <View style={{ width: '90%', backgroundColor: '#FFFFFF', height: 60, borderRadius: 30, flexDirection: 'row', marginLeft: 5, alignItems: 'center' }}>

                        <TextInput style={{ height: 45, width: '64%', paddingLeft: 20, color: 'black' }} placeholder='Type Your Message' value={Message} onChangeText={(val) => { setMessage(val) }}></TextInput>
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

                <StatusBar style='light' hidden={false} backgroundColor="black" />

            </View>
            {loading ? CustomActivityIndicator() : null}

        </SafeAreaView>
    )
}


