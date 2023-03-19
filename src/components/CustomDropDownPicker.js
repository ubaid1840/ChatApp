import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import DropDownPicker from 'react-native-dropdown-picker'

const CustomDropDown = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.paragraph}>
                React native dropdown picker
            </Text>
            <DropDownPicker
                items={[
                    { label: 'English', value: 'en' },
                    { label: 'Deutsch', value: 'de' },
                    { label: 'French', value: 'fr' },
                ]}
                defaultIndex={0}
                containerStyle={{ height: 100 }}
                onChangeItem={item => console.log(item.label, item.value)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        justifyContent: 'center',
        paddingTop: 20,
    },
    paragraph: {
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: 'white'
    },
});

export default CustomDropDown