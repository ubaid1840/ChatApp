import { StyleSheet } from "react-native";



const styles = StyleSheet.create({

    container: {
        height:'100%',
        width:'100%',
        // backgroundColor: '#000000E3',
        justifyContent: 'center',
        paddingLeft: '10%',
        paddingRight: '10%',
        alignItems:'center',
        // position: 'absolute',
        // marginLeft: 'auto',
        // marginRight: 'auto',
        // marginTop: 'auto',
        // marginBottom: 'auto',
        // left: 0,
        // right: 0,
        // top: 0,
        // bottom: 0,
    },
    textinputstyleblur: {
        marginTop: 10, height: 40, width: '90%', borderWidth: 1, borderTopLeftRadius: 10, borderBottomRightRadius: 10, borderColor: '#D3D3D3', paddingLeft: 10, alignSelf: 'center', shadowColor: "#000", shadowOpacity: 0, shadowRadius: 0, elevation: 0,backgroundColor:'white'
    },
    textinputstylefocus: {
        marginTop: 10, height: 60, width: '110%', borderWidth: 0, borderTopLeftRadius: 20, borderBottomRightRadius: 20, paddingLeft: 10, alignSelf: 'center', shadowColor: "#A9A9A9D3", shadowRadius: 10, elevation: 5, backgroundColor:'white'
    },

    activityIndicatorStyle: {
        flex: 1,
        position: 'absolute',
        marginLeft: 'auto',
        marginRight: 'auto',
        marginTop: 'auto',
        marginBottom: 'auto',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        justifyContent: 'center',
        backgroundColor: '#555555DD'
    },
    gradientbutton: {
        width: 120, 
        height: 50, 
        alignSelf: 'flex-end', 
        borderRadius: 50, 
        marginTop: 10, 
        alignItems: 'center', 
        justifyContent: 'center'
    },
    gradientbuttontext :{ 
        fontWeight: 'bold', 
        fontSize: 15
    },
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
        alignItems: 'center',
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
    hueOpacityPreviewContainer: {
        flexWrap: 'nowrap',
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
      },
      previewStyle: {
        width: 55,
        height: 55,
        borderRadius: 30,
        marginEnd: 20,
      },
      swatchesContainer: {
        flex: 0.25,
        alignItems: 'center',
        flexWrap: 'nowrap',
        gap: 10,
      },
      swatchStyle: {
        borderRadius: 20,
        height: 40,
        width: 40,
        margin: 0,
        marginBottom: 0,
        marginHorizontal: 0,
        marginVertical: 0,
      },
      shadow: {
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    
        elevation: 5,
      },
});

export default styles