import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useContext } from 'react';
import { Modal, SafeAreaView, Text, TextInput, TouchableOpacity, View, Image, ActivityIndicator, BackHandler, TouchableWithoutFeedback } from 'react-native';
import { getAuth, createUserWithEmailAndPassword, } from "firebase/auth";
import { doc, getFirestore, setDoc, collection, getDocs, updateDoc } from 'firebase/firestore';
import app from '../config/firebase'
import { useIsFocused } from '@react-navigation/native';
import styles from '../Style';
import { StyleSheet, FlatList } from 'react-native';
import { countrycodelist } from '../../codelist'
import { ThemeContext } from '../store/context/ThemeContext'


export default function SignUpScreen(props) {

   
    const db = getFirestore(app)

    const [loading, setloading] = useState(false)
    const [isEmailValid, setisEmailValid] = useState(false)
    const [isPasswordValid, setisPasswordValid] = useState(false)
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [FirstName, setFirstName] = useState("")
    const [LastName, setLastName] = useState("")
    const [Number, setNumber] = useState()
    const [Age, setAge] = useState("")
    const [emailfocus, setemailfocus] = useState('primary')
    const [passfocus, setpassfocus] = useState('primary')
    const [FirstNamefocus, setFirstNamefocus] = useState("primary")
    const [LastNamefocus, setLastNamefocus] = useState("primary")
    const [Numberfocus, setNumberfocus] = useState("primary")
    const [Agefocus, setAgefocus] = useState("primary")
    const [modalVisible1, setModalVisible1] = useState(false)
    const [modalVisible2, setModalVisible2] = useState(false)
    const [profilelist, setProfilelist] = useState([])
    const [Code, setCode] = useState("Code")

    const { state, darkValue, lightValue } = useContext(ThemeContext)

    

    useEffect(() => {
        const backAction = () => {
            props.navigation.goBack()
            return true;
        };
        const backHandler = BackHandler.addEventListener(
            'hardwareBackPress',
            backAction,
        );
        return () => backHandler.remove();
    }, []);

    const isFocused = useIsFocused()
    useEffect(() => {
        setEmail("")
        setPassword("")
        setNumber("")
        setFirstName("")
        setLastName("")
        setAge("")
    }, [isFocused])


    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    useEffect(() => {
        setisPasswordValid(Password.length > 5 && Password.length < 19 ? true : false)
        setisEmailValid(Email.includes('.com') && Email.includes('@') ? true : false)
    }, [Password, Email])

    useEffect(() => {
        const fetchdata = async () => {
            let chat = []
            try {
                const querySnapshot = await getDocs(collection(db, "Profiles"));
                querySnapshot.forEach((doc) => {
                    chat.push(doc.data())
                });

            } catch (e) {
                console.log(e)
            }
            setProfilelist(chat)
        }
        fetchdata()
    }, [])

    const checkdata = () => {
        let ret = 'allow'
        profilelist.map((data) => {
            if (data.number == Number) {
                ret = 'notallow'
            }
        })
        return ret
    }


    const createNewAccount = () => {

        const auth = getAuth(app)
        createUserWithEmailAndPassword(auth, Email, Password)
            .then(async (userCredential) => {
                // Signed in 
                const user = userCredential.user;
                await setDoc(doc(db, "Profiles", Email), {
                    firstname: FirstName,
                    lastname: LastName,
                    number: Number,
                    age: Age,
                    email: Email,
                    dp: "",
                    location: {
                        coords: {
                            "accuracy": 0,
                            "altitude": 0,
                            "altitudeAccuracy": 0,
                            "heading": 0,
                            "latitude": 0,
                            "longitude": 0,
                            "speed": 0,
                        },
                        mocked: false,
                        timestamp: 0
                    }
                });
                setEmail("")
                setPassword("")
                setNumber("")
                setFirstName("")
                setLastName("")
                setAge("")
                setloading(false)
                setModalVisible1(!modalVisible1)

            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
                setloading(false)
                alert(errorMessage)

            });

    }

    return (

        <>

        <SafeAreaView style={{ flex : 1 }}>

        <StatusBar style='light' />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => {
                    setModalVisible1(!modalVisible1);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>User Created</Text>
                        <TouchableOpacity onPress={() => {
                            props.navigation.goBack()
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                <Text style={styles.gradientbuttontext}>Login</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible1(!modalVisible1)
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                <Text style={styles.gradientbuttontext}>Sign up</Text>
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
                <TouchableWithoutFeedback onPress={{}}>
                    <View style={{ width: '100%', height: '90%', alignSelf: 'center', }}>

                        <View style={styless.modalView}>

                            <Text style={styless.modalText}>Select your country code</Text>

                            <TouchableOpacity onPress={() => {
                                setModalVisible2(!modalVisible2)

                            }}>
                                <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 120, height: 40, alignItems: 'center', justifyContent: 'center', borderRadius: 30, marginLeft: 10, alignSelf: 'center', marginTop: 10 }}>
                                    <Text style={styles.gradientbuttontext}>Close</Text>
                                    {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                                </LinearGradient>
                            </TouchableOpacity>
                            <View style={{ height: '90%', marginTop: 10, marginBottom: 10, paddingBottom: 10 }}>
                                <FlatList
                                    data={countrycodelist}
                                    renderItem={({ item, index }) => {
                                        return (
                                            <View>
                                                <TouchableOpacity onPress={() => {
                                                    setCode(item.code)
                                                    setModalVisible2(!modalVisible2)
                                                }}>
                                                    <Text style={{ fontSize: 16, marginBottom: 5 }}>{item.code} {item.name}</Text>
                                                </TouchableOpacity>
                                            </View>
                                        )
                                    }}
                                //   keyExtractor={extractKey}
                                />
                            </View>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </Modal>


            <SafeAreaView style={[styles.container, { backgroundColor: state.value.color }]}>
                <TouchableOpacity style={{ position: 'absolute', left: 5, top: 40 }} onPress={() => {
                    props.navigation.goBack()

                }}>
                    <Image style={{ height: 40, width: 40, }} source={require('../../assets/leftarrow.png')}></Image>
                </TouchableOpacity>
                {
                state.value.status
                    ?
                    <TouchableOpacity style={{ position: 'absolute', top: 80, left: 30 }} onPress={() => { 
                        lightValue()
                        }}>
                        <Image style={{ height: 30, width: 30, }} source={require('../../assets/theme.png')}></Image>
                    </TouchableOpacity>
                    :
                    <TouchableOpacity style={{ position: 'absolute', top: 80, right: 30 }} onPress={() => { 
                        darkValue() 
                        }}>
                        <Image style={{ height: 30, width: 30, transform: [{ rotate: '180deg' }] }} source={require('../../assets/theme.png')}></Image>
                    </TouchableOpacity>
                }
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start', }}>Sign up</Text>
                <Text style={{ color: 'grey', fontSize: 15, alignSelf: 'flex-start', marginTop: 5, marginBottom: 30 }}>Enter your credentials to ceate a new account</Text>


                <TextInput style={FirstNamefocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter First Name" placeholderTextColor="#B8B8B8DC" value={FirstName} onChangeText={(val) => { setFirstName(val) }} onFocus={() => {
                    setFirstNamefocus('secondary')
                }} onBlur={() => { setFirstNamefocus('primary') }} ></TextInput>
                <TextInput style={LastNamefocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Last Name" placeholderTextColor="#B8B8B8DC" value={LastName} onChangeText={(val) => { setLastName(val) }} onFocus={() => {
                    setLastNamefocus('secondary')
                }} onBlur={() => { setLastNamefocus('primary') }} ></TextInput>

                <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '90%' }}>
                    <TouchableOpacity style={{ backgroundColor: 'white', height: 40, width: '25%', borderTopLeftRadius: 10, borderBottomRightRadius: 10, borderColor: '#D3D3D3', marginTop: 10, justifyContent: 'center', alignItems: 'center', }}
                        onPress={() => { setModalVisible2(!modalVisible2) }}>
                        <View>
                            <Text>{Code}</Text>
                        </View>
                    </TouchableOpacity>
                    <TextInput style={Numberfocus == 'primary' ? [styles.textinputstyleblur, { width: '65%' }] : styles.textinputstylefocus} placeholder="Enter Number" placeholderTextColor="#B8B8B8DC" value={Number} onChangeText={(val) => { setNumber(val) }} onFocus={() => {
                        setNumberfocus('secondary')
                    }} onBlur={() => { setNumberfocus('primary') }} ></TextInput>
                </View>
                <TextInput style={Agefocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Age" placeholderTextColor="#B8B8B8DC" value={Age} onChangeText={(val) => { setAge(val) }} onFocus={() => {
                    setAgefocus('secondary')
                }} onBlur={() => { setAgefocus('primary') }} ></TextInput>
                <TextInput style={emailfocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Email" placeholderTextColor="#B8B8B8DC" value={Email} onChangeText={(val) => { setEmail(val.toLocaleLowerCase()) }} onFocus={() => {
                    setemailfocus('secondary')
                }} onBlur={() => { setemailfocus('primary') }} ></TextInput>
                {!isEmailValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 15, fontSize: 10, alignSelf: 'flex-start' }}>Enter Valid Email</Text> : null}
                <TextInput secureTextEntry style={passfocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Password" placeholderTextColor="#B8B8B8DC" value={Password} onChangeText={(val) => { setPassword(val) }} onFocus={() => { setpassfocus('secondary') }} onBlur={() => { setpassfocus('primary') }} ></TextInput>

                {!isPasswordValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 15, fontSize: 10, alignSelf: 'flex-start' }}>Password length should have 6 to 18 characters</Text> : null}

                {isEmailValid && isPasswordValid && FirstName && LastName && Age && Number ?
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => {
                        if (isEmailValid && isPasswordValid) {
                            const status = checkdata()
                            console.log(status)
                            if (status == "notallow") {
                                alert("Number already exist")
                            }
                            else {
                                setloading(true)
                                createNewAccount()

                            }
                        }
                        else { }
                    }}>
                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { backgroundColor: 'orange' }]}>
                            <Text style={[{ color: '#000000E3' }, styles.gradientbuttontext]}>Sign Up</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    :
                    <LinearGradient colors={['#FDD18076', '#FFA60065']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { backgroundColor: 'grey' }]}>
                        <Text style={[{ color: '#FFFFFF5A' }, styles.gradientbuttontext]}>Sign Up</Text>
                    </LinearGradient>
                }

                <TouchableOpacity style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                    props.navigation.navigate('Login')
                }}>
                    <Text style={{ color: '#FDD180', fontWeight: 'bold', fontSize: 12, marginTop: 20 }}>Already have an account? Go to Login</Text>
                </TouchableOpacity>
                

                {loading ? CustomActivityIndicator() : null}

            </SafeAreaView>

        </SafeAreaView>

        </>

    );

}

const styless = StyleSheet.create({
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
})

