import { View, Text, SafeAreaView, ScrollView, StyleSheet } from "react-native";
import { useEffect, useState } from "react";
import * as Contacts from 'expo-contacts'
import { FlatList } from "react-native";
import { getStorage, ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, getDocs, getFirestore, getDoc, doc, updateDoc } from "firebase/firestore";
import app from "../config/firebase";
import { getAuth, signOut } from "firebase/auth";



const extractKey = ({number}) => number

export function SettingsScreen() {


    const [contacts, setContacts] = useState([])
    const [error, setError] = useState(undefined)
    const [datalist, setdatalist] = useState([])

    const db = getFirestore(app)

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "Profiles"));
                const chat = []
                querySnapshot.forEach((doc) => {

                    if (doc.data().email == getAuth().currentUser.email) {
                        // setProfileimageurl(doc.data().dp)
                        // console.log(doc.data().dp)
                    }
                    chat.push(doc.data())
                });
                setdatalist(chat)
                // setloading(false)
            } catch (e) {
                console.log(e)
            }
        }
        fetchdata()


    }, [])

    useEffect(() => {
        (async () => {
            
        })();
    }, []);


    const getContactsRow = (contactdata) => {
        let info = []
        let num = []
        let j = 0
        if (contactdata !== undefined) {

            contactdata.map((contact, index) => {
                if (contact.name == undefined || contact.phoneNumbers == undefined || contact.phoneNumbers[0].number == undefined) {
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
                    }
                    info[j++] = ({ "name": contact.name, "number": num })
                    num = []
                }
            })
        }
        else {

            return <Text>Await contacts...</Text>
        }
        setContacts(info)
      //  showavailablecontact(info)

        // console.log(info)
       //  setContacts(info)
    }
    const showavailablecontact = (contactlist) =>{
        let newlist = []
        let j = 0
        let k =0
        contactlist.map((list)=>{
            let length = list.number.length
            profilelist.map((data)=>{
                for(let i=0 ; i<length ; i++)
                {
                    if(list.number[i] == data.number )
                    {
                        newlist.push({"id" : k++,"name" : list.name, "number": data.number})
                    }
                }
            })   
        })
        setContacts(newlist)
    }

    const renderItem = ({ item, index }) => {
        let items = [];
        if (item.number) {
            items = item.number.map(row => {
                return <Text style={{paddingLeft:20}}>{row}</Text>
            })
        }

        return (
            <View>
                <Text style={styles.row}>
                    {item.name}
                </Text>
                {items}
            </View>
        )
    }

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.container}
                data={contacts}
                renderItem={renderItem}
                keyExtractor={extractKey}
            />
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