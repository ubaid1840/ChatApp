import MapView, { Marker } from 'react-native-maps';
import { StyleSheet, View, Text } from 'react-native';
import * as Location from 'expo-location';
import { useState, useEffect, useRef } from 'react';
import { collection, doc, getFirestore, onSnapshot, updateDoc, query } from 'firebase/firestore';
import app from '../config/firebase';
import { getAuth } from "firebase/auth";



export function Mymaps(props) {

    //  const {currentlocation} = props.route.params

    const mapstyle = [
        {
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#1d2c4d"
                }
            ]
        },
        {
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#8ec3b9"
                }
            ]
        },
        {
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1a3646"
                }
            ]
        },
        {
            "featureType": "administrative.country",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#4b6878"
                }
            ]
        },
        {
            "featureType": "administrative.land_parcel",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#64779e"
                }
            ]
        },
        {
            "featureType": "administrative.province",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#4b6878"
                }
            ]
        },
        {
            "featureType": "landscape.man_made",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#334e87"
                }
            ]
        },
        {
            "featureType": "landscape.natural",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#023e58"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#283d6a"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#6f9ba5"
                }
            ]
        },
        {
            "featureType": "poi",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1d2c4d"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#023e58"
                }
            ]
        },
        {
            "featureType": "poi.park",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#3C7680"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#304a7d"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#98a5be"
                }
            ]
        },
        {
            "featureType": "road",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1d2c4d"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#2c6675"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "geometry.stroke",
            "stylers": [
                {
                    "color": "#255763"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#b0d5ce"
                }
            ]
        },
        {
            "featureType": "road.highway",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#023e58"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#98a5be"
                }
            ]
        },
        {
            "featureType": "transit",
            "elementType": "labels.text.stroke",
            "stylers": [
                {
                    "color": "#1d2c4d"
                }
            ]
        },
        {
            "featureType": "transit.line",
            "elementType": "geometry.fill",
            "stylers": [
                {
                    "color": "#283d6a"
                }
            ]
        },
        {
            "featureType": "transit.station",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#3a4762"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "geometry",
            "stylers": [
                {
                    "color": "#0e1626"
                }
            ]
        },
        {
            "featureType": "water",
            "elementType": "labels.text.fill",
            "stylers": [
                {
                    "color": "#4e6d70"
                }
            ]
        }
    ]

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const [dblocations, setdblocations] = useState(null)

    useEffect(() => {
        const mRef = collection(db, 'Profiles')
        const q = query(mRef)
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let dbdata = []
            querySnapshot.forEach((doc) => {
                if (doc.data().email == getAuth().currentUser.email) { }
                else {
                    dbdata.push(
                        {
                            name: doc.data().firstname,
                            email: doc.data().email,
                            latitude: doc.data().location.coords.latitude,
                            longitude: doc.data().location.coords.longitude
                        });
                    //console.log(doc.data().location)
                }
            })
            setdblocations(dbdata)
            console.log(dbdata)
        })
        return () => unsubscribe()
    }, [])

    const showalllocations = () => {
        if (dblocations == null || dblocations == undefined) {
            console.log(dblocations)
        }
        else {
            return dblocations.map((item, index) => {
                return (
                    item.latitude == 0 || item.longitude == 0
                        ?
                        null
                        :
                        <Marker
                            key={index}
                            coordinate={{
                                latitude: item.latitude,
                                longitude: item.longitude,
                            }}
                            pinColor='orange'
                            title={item.name}
                            description="Current Position"
                        >

                        </Marker>
                )
            })
        }
    }


    useEffect(() => {
        (async () => {

            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                setErrorMsg('Permission to access location was denied');
                return;
            }

            await Location.watchPositionAsync({ distanceInterval: 50 }, response => {

                // console.log(response.coords.latitude)
                // console.log(response.coords.longitude)
                setLocation(response)
            })
            //  setLocation(location);
        })();
    }, []);

    const db = getFirestore(app)

    useEffect(() => {
        (async () => {
            if (location == null || location == undefined) { }
            else {

                const updatedp = doc(db, "Profiles", getAuth().currentUser.email);
                // Set the "capital" field of the city 'DC'
                await updateDoc(updatedp, {
                    location: location
                });
                console.log("location updated")
            }
        })();
    }, [location])

    const mapRef = useRef()

    return (
        location == null || location == undefined ?
            <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <Text>Fetching location ..</Text>
            </View>
            :
            <View style={styles.container}>
                <MapView
                    ref={mapRef}
                    provider='google'
                    style={styles.map}
                    showsUserLocation={true}
                    showsMyLocationButton={true}
                    customMapStyle={mapstyle}
                    followUserLocation={true}
                    zoomEnabled={true}
                    onMapReady={() => {
                        console.log("map ready")
                        mapRef.current.animateToRegion({
                            latitude: location.coords.latitude,
                            longitude: location.coords.longitude,
                            latitudeDelta: 0.005,
                            longitudeDelta: 0.005
                        }, 2000)
                    }}
                //     initialRegion={{
                //         latitude: location.coords.latitude,
                // longitude: location.coords.longitude,
                // latitudeDelta : 0.005,
                // longitudeDelta : 0.005
                //     }}

                >
                    {showalllocations()}
                    {location == null || location == undefined ? null :
                        <Marker
                            coordinate={{
                                latitude: location.coords.latitude,
                                longitude: location.coords.longitude,
                            }}
                            pinColor='orange'
                            title="Home"
                            description='my home'
                        />
                    }
                </MapView>

                {/* <View>
                    <TouchableOpacity
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                            console.log("ub")
                            console.log(mapRef)
                        }}
                    >
                        <View style={{ height: 40, width: 80, backgroundColor: 'green', justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white' }}>Show ref</Text>
                        </View>
                    </TouchableOpacity>
                </View> */}

            </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    map: {
        width: '100%',
        height: '100%',
    },
});