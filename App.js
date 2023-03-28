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


export default function App() {

  const AppStack = createNativeStackNavigator();

  return (
  
      <RootSiblingParent>
        <ThemContextProvider>
        <NavigationContainer >
          <AppStack.Navigator initialRouteName='Login' options={{}}>
            <AppStack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }}></AppStack.Screen>
            <AppStack.Screen name='SignUp' component={SignUpScreen} options={{ headerShown: false }}></AppStack.Screen>
            <AppStack.Screen name='ForgetPassword' component={ForgetPasswordScreen} options={{ headerShown: false }}></AppStack.Screen>
            <AppStack.Screen name='Home' component={HomeScreen} options={{ headerShown: false }}></AppStack.Screen>
            <AppStack.Screen name='IndividualChat' component={IndividualChatScreen} options={{ headerShown: false }}></AppStack.Screen>
            <AppStack.Screen name='Settings' component={SettingsScreen} options={{ headerShown: true }}></AppStack.Screen>
            <AppStack.Screen name='Maps' component={Mymaps} options={{ headerShown: true }}></AppStack.Screen> 
          </AppStack.Navigator>
        </NavigationContainer>
        </ThemContextProvider>
      </RootSiblingParent>
    
  );
}




