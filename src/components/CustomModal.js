import { Text, View, TouchableOpacity, Modal } from "react-native";

const CustomModal = (props) => {
    <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible1}
                onRequestClose={() => {
                    setModalVisible1(!modalVisible1);
                }}>
                <View style={styless.centeredView}>
                    <View style={styless.modalView}>
                        <Text style={styless.modalText}>Are you sure you want to logout?</Text>
                        <TouchableOpacity onPress={() => {
                            logoutaccount()
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 120, height: 50, alignSelf: 'flex-end', borderRadius: 50, backgroundColor: 'orange', marginTop: 20, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#000000E3', fontWeight: 'bold', fontSize: 15 }}>Yes</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            setModalVisible1(!modalVisible1)
                        }}>
                            <LinearGradient colors={['#FDD180', '#FFA600']} start={{ x: 0, y: 1 }} end={{ x: 1, y: 1 }} style={{ width: 120, height: 50, alignSelf: 'flex-end', borderRadius: 50, backgroundColor: 'orange', marginTop: 10, alignItems: 'center', justifyContent: 'center' }}>
                                <Text style={{ color: '#000000E3', fontWeight: 'bold', fontSize: 15 }}>No</Text>
                                {/* <Ionicons name="arrow-forward-circle-outline" size={25} color="green"  /> */}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
}