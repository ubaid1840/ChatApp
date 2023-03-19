import { Modal, View, Text, StyleSheet } from "react-native";
import { LinearGradient } from 'expo-linear-gradient';




const AlertModal = (props) => {

    return (
        <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => {
                    setModalVisible1(!modalVisible1);
                }}>
                <View style={styless.centeredView}>
                    <View style={styless.modalView}>
                        <Text style={styless.modalText}>Profile Updated</Text>
                        <TouchableOpacity onPress={() => {
                            
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 120, height: 50, alignSelf: 'flex-end', borderRadius: 50, backgroundColor: 'orange', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#000000E3', fontWeight: 'bold', fontSize: 15 }}>ok</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
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
});

export default AlertModal

