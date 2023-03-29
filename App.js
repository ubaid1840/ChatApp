import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from './src/screens/Login'
import SignUpScreen from './src/screens/SignUp';
import ForgetPasswordScreen from './src/screens/ForgetPassword';
import { HomeScreen } from './src/screens/Home';
import { IndividualChatScreen } from './src/screens/IndividualChat';
import { SettingsScreen } from './src/screens/Settings';
import { RootSiblingParent } from 'react-native-root-siblings';
import { Mymaps } from './src/screens/Maps';
import ThemContextProvider from './src/store/context/ThemeContext';
import AuthContextProvider from './src/store/context/AuthContext'
import { createDrawerNavigator } from '@react-navigation/drawer';


export default function App() {

  const AppStack = createNativeStackNavigator();
  const AfterLoginStack = createNativeStackNavigator()
  const Drawer = createDrawerNavigator()

  function AfterLogin() {
    return (
    <AfterLoginStack.Navigator initialRouteName='Home'>
      <AfterLoginStack.Screen name='Home' component={HomeScreen} options={{ headerShown: false}}></AfterLoginStack.Screen>
      <AfterLoginStack.Screen name='IndividualChat' component={IndividualChatScreen} options={{ headerShown: false }}></AfterLoginStack.Screen>
      <AfterLoginStack.Screen name='Settings' component={SettingsScreen} options={{ headerShown: true }}></AfterLoginStack.Screen>
      <AfterLoginStack.Screen name='Maps' component={Mymaps} options={{ headerShown: true }}></AfterLoginStack.Screen>
    </AfterLoginStack.Navigator>
    )
  }

  function BeforeLogin() {

    return (
    <Drawer.Navigator initialRouteName='Login'>
      <Drawer.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}></Drawer.Screen>
      <Drawer.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }}></Drawer.Screen>
      <Drawer.Screen name='ForgetPassword' component={ForgetPasswordScreen} options={{ headerShown: false }}></Drawer.Screen>
    </Drawer.Navigator>
    )
  }

  return (

    <RootSiblingParent>
      <AuthContextProvider>
        <ThemContextProvider>
          <NavigationContainer >
            <AppStack.Navigator initialRouteName='Before'>
              <AppStack.Screen name='Before' component={BeforeLogin} options={{ headerShown: false }}></AppStack.Screen>
              <AppStack.Screen name='After' component={AfterLogin} options={{ headerShown: false }}></AppStack.Screen>
            </AppStack.Navigator>
          </NavigationContainer>
        </ThemContextProvider>
      </AuthContextProvider>
    </RootSiblingParent>

  );
}




