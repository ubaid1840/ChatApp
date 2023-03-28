import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useContext } from 'react';
import { SafeAreaView, Text, TextInput, TouchableOpacity, View, Modal, Image, ActivityIndicator, BackHandler, } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import app from '../config/firebase'
import { useIsFocused } from '@react-navigation/native';
import styles from '../Style';
// import Pushnotifications from '../pushnotifications';
import Toast from 'react-native-root-toast';
import { ThemeContext } from '../store/context/ThemeContext'
import { AuthContext } from '../store/context/AuthContext'



export default function LoginScreen(props) {

    const { state, darkValue, lightValue } = useContext(ThemeContext)

    const { state: authState, setAuth, clearAuth } = useContext(AuthContext)



    // const [location, setLocation] = useState(null);
    // const [errorMsg, setErrorMsg] = useState(null);

    // useEffect(() => {
    //     (async () => {

    //         let { status } = await Location.requestForegroundPermissionsAsync();
    //         if (status !== 'granted') {
    //             setErrorMsg('Permission to access location was denied');
    //             return;
    //         }

    //         let location = await Location.getCurrentPositionAsync({});
    //         setLocation(location);
    //     })();
    // }, []);

    const [modalVisible, setModalVisible] = useState(false);

    useEffect(() => {
        const backAction = () => {
            setModalVisible(true)
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
    }, [isFocused])

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    const [loading, setloading] = useState(false)
    const [isEmailValid, setisEmailValid] = useState(false)
    const [isPasswordValid, setisPasswordValid] = useState(false)
    const [Email, setEmail] = useState("")
    const [Password, setPassword] = useState("")
    const [emailfocus, setemailfocus] = useState('primary')
    const [passfocus, setpassfocus] = useState('primary')

    useEffect(() => {

        setisEmailValid(Email.includes('.com') && Email.includes('@') ? true : false)
        setisPasswordValid(Password.length > 5 && Password.length < 19 ? true : false)



    }, [Email, Password])

    useEffect(() => {

        if (authState.value.email != null) {
            Toast.show('Login Successful!', {
                duration: Toast.durations.SHORT,
                shadow: true,
                animation: true,
            });
            props.navigation.navigate("Home")
        }


    }, [authState])

    const LoginAccount = () => {

        setAuth(Email, Password)
        // const auth = getAuth(app);
        // signInWithEmailAndPassword(auth, Email, Password)
        //     .then((userCredential) => {
        //         // Signed in 
        //         Toast.show('Login Successful!', {
        //             duration: Toast.durations.SHORT,
        //             shadow: true,
        //             animation: true,
        //         });
        //         const user = userCredential.user;
        //         props.navigation.navigate('Home', { loginemail: user.email })
        //         //            props.navigation.navigate('Maps')
        //         setloading(false)
        //     })
        //     .catch((error) => {
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         //   console.log(errorMessage)
        //         alert(errorMessage)
        //         setloading(false)
        //     });
    }

    return (

        <SafeAreaView style={{ flex: 1 }}>

            <StatusBar style="light" />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}>
                <View style={styles.centeredView}>
                    <View style={styles.modalView}>
                        <Text style={styles.modalText}>Are you sure you want to exit?</Text>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(!modalVisible);
                            BackHandler.exitApp()
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                <Text style={styles.gradientbuttontext}>Yes</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible(!modalVisible)
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={styles.gradientbutton}>
                                <Text style={styles.gradientbuttontext}>No</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <View style={[styles.container, { backgroundColor: state.value.color }]}>
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
                <TouchableOpacity onPress={() => { setModalVisible(!modalVisible); }}>
                    <Image style={{ width: 70, height: 70, marginBottom: 50 }} source={require('../../assets/chitchatlogo.png')}></Image>
                </TouchableOpacity>
                <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start', }}>Login</Text>
                <Text style={{ color: 'grey', fontSize: 15, alignSelf: 'flex-start', marginTop: 5, marginBottom: 30 }}>Please sign in to continue</Text>
                <TextInput style={emailfocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Email" placeholderTextColor="#B8B8B8DC" value={Email} onChangeText={(email) => { setEmail(email) }} onFocus={() => {
                    setemailfocus('secondary')
                }} onBlur={() => { setemailfocus('primary') }} ></TextInput>
                {!isEmailValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 15, fontSize: 10, alignSelf: 'flex-start' }}>Enter Valid Email</Text> : null}
                <TextInput secureTextEntry style={passfocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Password" placeholderTextColor="#B8B8B8DC" value={Password} onChangeText={(val) => { setPassword(val) }} onFocus={() => { setpassfocus('secondary') }} onBlur={() => { setpassfocus('primary') }} ></TextInput>
                {!isPasswordValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 15, fontSize: 10, alignSelf: 'flex-start' }}>Password length should have 6 to 18 characters</Text> : null}
                <TouchableOpacity style={{ alignItems: 'flex-end', justifyContent: 'center', marginTop: 5, alignSelf: 'flex-end' }} onPress={() => {
                    props.navigation.navigate('ForgetPassword')
                }} >
                    <Text style={{ color: '#FDD180', fontWeight: 'bold' }}>Forgot Password?</Text>
                </TouchableOpacity>
                {isEmailValid && isPasswordValid ?
                    <TouchableOpacity style={{ alignSelf: 'flex-end' }} onPress={() => {
                        if (isEmailValid && isPasswordValid) {
                            // setloading(true)
                            LoginAccount()
                        }
                        else {
                        }
                    }}>
                        <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { backgroundColor: 'orange' }]}>
                            <Text style={[styles.gradientbuttontext, { color: '#000000E3' }]}>Login</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                    :
                    <LinearGradient colors={['#FDD18076', '#FFA60065']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[styles.gradientbutton, { backgroundColor: 'grey' }]}>

                        <Text style={[{ color: '#FFFFFF5A' }, styles.gradientbuttontext]}>Login</Text>
                        {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                    </LinearGradient>
                }

                <TouchableOpacity style={{ marginTop: 20, flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                    props.navigation.navigate('SignUp')
                }}>
                    <Text style={{ color: '#FDD180', fontWeight: 'bold', fontSize: 12 }}>Don't have an account? Create a new account</Text>
                </TouchableOpacity>
                {authState.value.loading ? CustomActivityIndicator() : null}

            </View>

        </SafeAreaView>
    );
}

