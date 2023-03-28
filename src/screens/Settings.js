import { View, Text, StyleSheet } from "react-native";
import { useEffect, useState, useContext } from "react";
import { FlatList } from "react-native";
import { collection, getDocs, getFirestore } from "firebase/firestore";
import app from "../config/firebase";
import { getAuth } from "firebase/auth";
import { AuthContext } from '../store/context/AuthContext'



export function SettingsScreen() {

    const { state: authState, setAuth, clearAuth } = useContext(AuthContext)



    return (
        <View style={{flex:1, justifyContent:'center', alignItems:'center'}}>
            <Text>
                {authState.value.email}
            </Text>
            <Text>
                {authState.value.token}
            </Text>
        </View>
    )


}


const styles = StyleSheet.create({
    container: {
        marginTop: 20,
        flex: 1,
    },
    row: {
        padding: 15,
        marginBottom: 5,
        backgroundColor: 'skyblue',
        flexDirection: 'column'
    },
})