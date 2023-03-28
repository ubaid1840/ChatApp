import { View, Text, SafeAreaView, BackHandler, Image, TextInput, TouchableOpacity, FlatList, ActivityIndicator, Modal, StyleSheet, TouchableWithoutFeedback, } from "react-native";
import styles from "../Style";
import { useState, useEffect, useRef } from "react";
import { getAuth, signOut } from "firebase/auth";
import app from "../config/firebase";
import { LinearGradient } from 'expo-linear-gradient';
import { collection, getDocs, getFirestore, doc, updateDoc } from "firebase/firestore";
import { StatusBar } from 'expo-status-bar';
import * as ImagePicker from 'expo-image-picker';
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import * as Contacts from 'expo-contacts';
import Toast from 'react-native-root-toast';
import Constants from "expo-constants";


export function HomeScreen(props) {

    const extractKey = ({ number }) => number

    const storage = getStorage(app);
    const db = getFirestore(app)

    const [modalVisible, setModalVisible] = useState(false);
    const [modalVisible1, setModalVisible1] = useState(false);
    const [modalVisible2, setModalVisible2] = useState(false);
    const [modalVisible3, setModalVisible3] = useState(false);
    const [profileimageurl, setProfileimageurl] = useState()
    const [uploading, setUploading] = useState(false)
    const [fileuploading, setFileuploading] = useState("")
    const [searchnumber, setSearchNumber] = useState("")
    const [loading, setloading] = useState(true)
    const [datalist, setdatalist] = useState([])
    const [image, setImage] = useState(null);
    const [contacts, setContacts] = useState([])
    const [contactdatalist, setContactdatalist] = useState([])
    const [contactflatlist, setContactflatlist] = useState([])


    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    const CustomFileUploading = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20 }}>Uploading Picture</Text>
                <Text style={{ color: 'white', alignSelf: 'center', fontSize: 20 }}>{fileuploading}%</Text>
            </View>
        );
    };

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        setModalVisible2(!modalVisible2)
        setloading(true)

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 4],
            quality: 1,
        });

        //  console.log(result);

        if (!result.canceled) {
            setloading(false)
            setUploading(true)
            setImage(result.assets[0].uri);
            uploadimage(result.assets[0].uri)
        }

        if (result.canceled) {
            setloading(false)
        }
    };

    const uploadimage = async (resultimage) => {

        // convert image to blob image
        const blobImage = await new Promise((resole, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resole(xhr.response);
            };
            xhr.onerror = function () {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", resultimage, true);
            xhr.send(null);
        });

        // Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        };

        //upload image to firestore
        // Upload file and metadata to the object 'images/mountains.jpg'
        const storageRef = ref(storage, 'ProfileImages/' + getAuth().currentUser.email + '.dp');
        const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

        // Listen for state changes, errors, and completion of the upload.
        uploadTask.on('state_changed',
            (snapshot) => {

                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setFileuploading(parseFloat(progress).toFixed(2))


                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                // A full list of error codes is available at
                // https://firebase.google.com/docs/storage/web/handle-errors
                switch (error.code) {
                    case 'storage/unauthorized':
                        // User doesn't have permission to access the object
                        break;
                    case 'storage/canceled':
                        // User canceled the upload
                        break;

                    // ...

                    case 'storage/unknown':
                        // Unknown error occurred, inspect error.serverResponse
                        break;
                }
            },
            () => {
                // Upload completed successfully, now we can get the download URL
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    // console.log('File available at', downloadURL)
                    updateprofiledp(downloadURL)
                });
            }
        );
    }


    const updateprofiledp = async (url) => {
        const updatedp = doc(db, "Profiles", getAuth().currentUser.email);

        // Set the "capital" field of the city 'DC'
        await updateDoc(updatedp, {
            dp: url
        });
        setProfileimageurl(url)
        setUploading(false)
        setModalVisible3(!modalVisible3)
    }

    useEffect(() => {
        const backAction = () => {
            setModalVisible(!modalVisible)
        };

        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );

        return () => backHandler.remove();
    }, []);

    useEffect(() => {
        fetchdata()
        fetchcontacts()
    }, [])

    const fetchdata = async () => {
        try {
            const querySnapshot = await getDocs(collection(db, "Profiles"));
            const chat = []
            querySnapshot.forEach((doc) => {

                if (doc.data().email == getAuth().currentUser.email) {
                    setProfileimageurl(doc.data().dp)
                    // console.log(doc.data().dp)
                }
                chat.push(doc.data())
            });
            setdatalist(chat)
            setloading(false)
        } catch (e) {
            console.log(e)
        }
    }


    const fetchcontacts = async () => {
        const { status } = await Contacts.requestPermissionsAsync();
        if (status === 'granted') {
            const { data } = await Contacts.getContactsAsync({
                fields: [Contacts.Fields.PhoneNumbers],
            });

            if (data.length > 0) {
                // console.log(data)

                getContactsRow(data)
            }
            else {
                setError("No contacts found")
            }
        }
        else {
            setError("Permission to access contacts denied")
        }
    }

    const startchat = async (userdetail) => {

        //use sorting to make the pair 

        let arraysort = [getAuth().currentUser.email, userdetail.email]
        arraysort.sort()
        let key = arraysort[0] + ':' + arraysort[1]
        props.navigation.navigate('IndividualChat', { communication: key, currentuserdp: profileimageurl, otheruserdp: userdetail.dp, chattingwith: userdetail.firstname + " " + userdetail.lastname, otheruser: userdetail })
    }

    const logoutaccount = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            //  console.log('user sign out')
            props.navigation.goBack()
        }).catch((error) => {
            console.log(error)
        });
    }

    const removedp = async () => {


        setloading(true)
        setModalVisible2(!modalVisible2)

        const updatedp = doc(db, "Profiles", getAuth().currentUser.email);

        // Set the "capital" field of the city 'DC'
        await updateDoc(updatedp, {
            dp: ""
        });
        setProfileimageurl("")
        // Create a reference to the file to delete
        const desertRef = ref(storage, 'ProfileImages/' + getAuth().currentUser.email + '.dp');

        // Delete the file
        deleteObject(desertRef).then(() => {
            // File deleted successfully
        }).catch((error) => {
            alert(error)
        });

        setloading(false)

        setModalVisible3(!modalVisible3)
    }

    const getContactsRow = (contactdata) => {
        let info = []
        let num = []
        let j = 0
        let l = 1
        if (contactdata !== undefined) {

            contactdata.map((contact, index) => {
                if (contact.name == undefined || contact.phoneNumbers == undefined || contact.phoneNumbers[0].number == undefined) {
                    // console.log(index)
                    // console.log("undefined found")
                }
                else {
                    for (let i = 0; i < contact.phoneNumbers.length; i++) {
                        let str = contact.phoneNumbers[i].number.replaceAll(/\s/g, '')
                        let editstr = str.replace(/-/g, "")
                        num[i] = editstr


                    }

                    if (num.length != 0 || num.length != 1) {
                        let temp = []
                        let k = 0
                        for (let i = 0; i < num.length - 1; i++) {
                            if (num[i] != num[i + 1]) {
                                temp[k++] = num[i]
                            }
                        }
                        temp[k++] = num[num.length - 1];
                        num = temp
                        // console.log(contact.name)
                        // console.log(num)
                    }
                    info[j++] = ({ "key": l++, "name": contact.name, "number": num })
                    num = []
                }
            })
        }
        else {

            return <Text>Await contacts...</Text>
        }
        // setContactdatalist(info)
        showavailablecontact(info)

        // console.log(info)
        //  setContacts(info)
    }
    const showavailablecontact = (contactlist) => {
        let newlist = []
        let j = 0
        let k = 0
        // console.log(datalist)
        contactlist.map((list) => {
            let length = list.number.length
            datalist.map((data) => {
                for (let i = 0; i < length; i++) {
                    if (list.number[i] == data.number) {
                        newlist.push({ "id": k++, "name": list.name, "number": data.number, "email": data.email, "age": data.age, "firstname": data.firstname, "lastname": data.lastname, "dp": data.dp })

                    }
                }
            })

        })
        // console.log(newlist) 
        setContactdatalist(newlist)
        setContactflatlist(newlist)
    }

    const renderItem = ({ item, index }) => {
        // console.log(item.name)
        return (
            <TouchableOpacity onPress={() => {
                setModalVisible(!modalVisible)
                startchat(item)
            }}>
                <View style={styless.row}>
                    <Text style={{ fontSize: 15, fontWeight: '900' }}>{item.name}</Text>
                    <Text >{item.number}</Text>

                </View>
            </TouchableOpacity>
        )
    }

    useEffect(() => {
        let newlist = []
        let k = 0
        let temp = contactdatalist
        temp.map((list) => {
            if (list.name.toLowerCase().includes(searchnumber)) {
                newlist.push({ "id": k++, "name": list.name, "number": list.number, "email": list.email, "age": list.age, "firstname": list.firstname, "lastname": list.lastname, "dp": list.dp })
            }

        })
        setContactflatlist(newlist)

    }, [searchnumber])

    return (

        <>
            <SafeAreaView style={{backgroundColor: '#000000E3' }}>
                <StatusBar style='light' backgroundColor="black"/>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible1}
                    onRequestClose={() => {
                        setModalVisible1(!modalVisible1);
                    }}>
                    <View style={styles.centeredView}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalText}>Are you sure you want to logout?</Text>
                            <TouchableOpacity onPress={() => {
                                logoutaccount()
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

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible3}
                    onRequestClose={() => {
                        setModalVisible3(!modalVisible3)
                    }}>
                    <View style={styless.centeredView}>
                        <View style={styless.modalView}>
                            <Text style={styless.modalText}>Profile Picture updated</Text>
                            <TouchableOpacity onPress={() => {
                                setModalVisible3(!modalVisible3)
                            }}>
                                <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                    <Text style={styles.gradientbuttontext}>Done</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible2}
                    onRequestClose={() => {
                        setModalVisible2(!modalVisible2);
                    }}>
                    <TouchableWithoutFeedback style={styless.centeredView} onPress={() => { setModalVisible2(!modalVisible2) }}>
                        <View style={styless.centeredView}>
                            <TouchableWithoutFeedback>
                                <View style={styless.modalView}>
                                    <Text style={styless.modalText}>Change profile picture</Text>

                                    <TouchableOpacity onPress={() => {
                                        pickImage()
                                    }}>
                                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { width: 130 }]}>
                                            <Text style={styles.gradientbuttontext}>Open gallery</Text>

                                        </LinearGradient>
                                    </TouchableOpacity>
                                    {profileimageurl == "" || profileimageurl == null || profileimageurl == undefined
                                        ?
                                        null
                                        :
                                        <TouchableOpacity onPress={() => {
                                            removedp()
                                        }}>
                                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { width: 150 }]}>
                                                <Text style={styles.gradientbuttontext}>Remove Picture</Text>
                                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                                            </LinearGradient>
                                        </TouchableOpacity>
                                    }
                                </View>
                            </TouchableWithoutFeedback>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(!modalVisible);
                    }}>
                    <TouchableWithoutFeedback onPress={() => { setModalVisible(!modalVisible) }}>
                        <View style={{ width: '100%', height: '90%', alignSelf: 'center', }}>

                            <View style={styless.modalView}>

                                <Text style={styless.modalText}>Enter Number to search</Text>
                                <View style={{ flexDirection: 'row' }}>
                                    <TextInput style={{ height: 40, width: 170, borderWidth: 1, borderRadius: 15, padding: 10, marginRight: 20 }} placeholder='Enter Number' value={searchnumber} onChangeText={(val) => { setSearchNumber(val) }}>
                                    </TextInput>
                                    {/* <TouchableOpacity style={{}} onPress={() => {
                                    // searchemailindb()
                                   // filtercontacts()
                                    
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ height: 40, width: 40, borderRadius: 30, backgroundColor: '#FDD180', alignItems: 'center', justifyContent: 'center' }}>
                                        <Image style={{ height: 30, width: 30, }} source={require('../../assets/search.png')}></Image>
                                    </LinearGradient>
                                </TouchableOpacity> */}
                                    <TouchableOpacity onPress={() => {
                                        setModalVisible(!modalVisible)
                                    }}>
                                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 100, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 10 }}>
                                            <Text style={styles.gradientbuttontext}>Close</Text>
                                            {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                                <TouchableOpacity onPress={() => {
                                    //  fetchcontacts()
                                    Toast.show('Refresh Successful!', {
                                        duration: Toast.durations.SHORT,
                                    });
                                }}>
                                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 120, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 10, alignSelf: 'center', marginTop: 10 }}>
                                        <Text style={styles.gradientbuttontext}>Refresh</Text>
                                        {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                                    </LinearGradient>
                                </TouchableOpacity>
                                <View style={{ height: '90%', marginTop: 10, marginBottom: 10, paddingBottom: 10 }}>
                                    <FlatList
                                        data={contactflatlist}
                                        renderItem={renderItem}
                                    //   keyExtractor={extractKey}
                                    />
                                </View>
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>

                <View style={{ width: '100%', height: '100%', alignItems: 'center', paddingTop: Constants.statusBarHeight, }}>

                    <View style={{ width: '100%', flexDirection: 'row', backgroundColor: 'black', alignItems: 'center', justifyContent: 'space-between', paddingRight: 15, paddingLeft: 15, height: 70 }}>
                        <View style={{ flexDirection: 'row' }}>
                            <TouchableOpacity style={{}} onPress={() => {
                                setModalVisible1(!modalVisible1)
                                return true;
                            }}>

                                <Image style={{ height: 30, width: 30, }} source={require('../../assets/logout.png')}></Image>
                            </TouchableOpacity>
                        </View>
                        <View style={{ flexDirection: 'column', alignItems: 'center' }}>
                            <TouchableOpacity onPress={() => { fetchdata() }}>
                                <Image style={{ width: 40, height: 40, }} source={require('../../assets/chitchatlogo.png')}></Image>
                            </TouchableOpacity>

                        </View>
                        <View>
                            <TouchableOpacity onPress={() => {
                                props.navigation.navigate('Settings')
                            }}
                                onLongPress={() => {
                                    setModalVisible2(!modalVisible2)
                                }}>
                                {profileimageurl == "" || profileimageurl == null || profileimageurl == undefined
                                    ?
                                    <Image style={{ height: 40, width: 40 }} source={require('../../assets/nouserdp.png')}></Image>
                                    :
                                    <Image style={{ height: 50, width: 50, borderRadius: 25 }} src={profileimageurl}></Image>}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <View style={{ height: '90%', marginBottom: 10, marginTop: 10, width: '95%' }}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            data={datalist}

                            renderItem={({ item, index }) => {
                                return (
                                    item.email != getAuth().currentUser.email ?
                                        <TouchableOpacity style={{ width: '100%', alignItems: 'center' }} onPress={() => {
                                            startchat(item)
                                            //   console.log(datalist[index].email)
                                        }}>
                                            <View style={{ backgroundColor: '#262829', justifyContent: 'center', padding: 15, marginTop: 5, borderRadius: 15, width: '95%', borderColor: '#FFFFFF2C', borderWidth: 1, }}>
                                                <Text style={{ fontSize: 15, color: 'white', fontWeight: '500' }}>{item.firstname} {item.lastname}</Text>
                                                <Text style={{ fontSize: 15, color: 'white', }}>{item.email}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        :
                                        null

                                )
                            }}
                        />
                    </View>
                    {loading ? CustomActivityIndicator() : null}
                    {uploading ? CustomFileUploading() : null}
                </View>
                <TouchableOpacity style={{}} onPress={() => {
                    setSearchNumber("")
                    fetchcontacts()
                    setModalVisible(!modalVisible)
                }}>
                    <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ position: 'absolute', right: 30, bottom: 30, height: 60, width: 60, borderRadius: 30, backgroundColor: '#FDD180', alignItems: 'center', justifyContent: 'center' }}>
                        <Image style={{ height: 50, width: 50, }} source={require('../../assets/newchat.png')}></Image>
                    </LinearGradient>
                </TouchableOpacity>

            </SafeAreaView>
        </>
    )
}

const styless = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 35,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },

    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    container: {
        marginTop: 20,
        flex: 1,
    },
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'skyblue',
        flexDirection: 'column',
        borderRadius: 30
    },
});
