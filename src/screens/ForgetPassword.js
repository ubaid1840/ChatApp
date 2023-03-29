import { LinearGradient } from 'expo-linear-gradient';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useContext } from 'react';
import { Text, TextInput, TouchableOpacity, View, Image, LayoutAnimation, BackHandler} from 'react-native';
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import app from '../config/firebase';
import { useIsFocused } from '@react-navigation/native';
import styles from '../Style';
import { ThemeContext } from '../store/context/ThemeContext';


export default function ForgetPasswordScreen(props) {

    const { state, darkValue, lightValue } = useContext(ThemeContext)
    const [loading, setloading] = useState(false)
    const [isEmailValid, setisEmailValid] = useState(false)
    const [Email, setEmail] = useState("")
    const [emailfocus, setemailfocus] = useState('primary')

    const forgetPassword = () => {
        const auth = getAuth(app);
        sendPasswordResetEmail(auth, Email)
            .then(() => {
                // Password reset email sent!
                // ..
                setEmail("")
                alert('Check your email for password reset link')
                setloading(false)
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage)
                setloading(false)
                // ..
            });

    }

    const CustomActivityIndicator = () => {
        return (
            <View style={styles.activityIndicatorStyle}>
                <ActivityIndicator color="#FFA600" size="large" />
            </View>
        );
    };

    const isFocused = useIsFocused()
    useEffect(() => {
        setEmail("")
    }, [isFocused])

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

    useEffect(() => {

        setisEmailValid(Email.includes('.com') && Email.includes('@') ? true : false)
        
    }, [Email])

    return (
        <View style={[styles.container, { backgroundColor: state.value.color }]}>
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
            
            <Text style={{ color: 'white', fontSize: 30, fontWeight: 'bold', alignSelf: 'flex-start', }}>Forget Password</Text>
            <Text style={{ color: 'grey', fontSize: 15, alignSelf: 'flex-start', marginTop: 5, marginBottom: 30 }}>Enter your email to reset</Text>
            <TextInput style={emailfocus == 'primary' ? styles.textinputstyleblur : styles.textinputstylefocus} placeholder="Enter Email" placeholderTextColor="#B8B8B8DC" value={Email} onChangeText={(val) => { setEmail(val.toLocaleLowerCase()) }} onFocus={() => {
                LayoutAnimation.easeInEaseOut()
                setemailfocus('secondary')
            }} onBlur={() => { LayoutAnimation.easeInEaseOut(); setemailfocus('primary') }} ></TextInput>
            {!isEmailValid ? <Text style={{ color: 'red', paddingTop: 5, paddingLeft: 15, fontSize: 10, alignSelf: 'flex-start' }}>Enter Valid Email</Text> : null}
            {isEmailValid ?
             <TouchableOpacity style={{ alignSelf:'flex-end' }} onPress={() => {
                if (isEmailValid) {
                    setloading(true)
                    forgetPassword()
                }
                else {

                }
            }}>
                <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[{backgroundColor:'orange'}, styles.gradientbutton]}>

                        <Text style={[{ color: '#000000E3'}, styles.gradientbuttontext]}>Reset</Text>
                        </LinearGradient>
                    </TouchableOpacity>
               
                :
                <LinearGradient colors={['#FDD18076', '#FFA60065']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={[{backgroundColor:'grey'}, styles.gradientbutton]}>
               <Text style={[{ color: '#FFFFFF5A'}, styles.gradientbuttontext]}>Reset</Text>
                </LinearGradient>
            }

            <TouchableOpacity style={{ flexDirection: 'row', width: '100%', alignItems: 'center', justifyContent: 'center' }} onPress={() => {
                props.navigation.goBack()
            }}>
                <Text style={{ color: '#FDD180', fontWeight: 'bold', fontSize: 12, marginTop: 20 }}>Already have an account? Go to Login</Text>
                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
            </TouchableOpacity>
            <StatusBar style='light' hidden={false} />
            {loading ? CustomActivityIndicator() : null}
        </View>
    );

}


