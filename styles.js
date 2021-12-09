import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {

        paddingTop: Platform.OS === 'ios' ? 100 : 30,
        backgroundColor: '#000',
        // marginTop: 100,
        // padding: 20,
        // flex: 1,
        // backgroundColor: '#fff',
        // paddingTop: 100,
        // paddingHorizontal: 20
    },

    flexBetween: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },

    flexCenter: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },

    flexEvenly: {
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row'
    },

    btn: {
        backgroundColor: '#1c1c1e',
        paddingVertical: 7,
        paddingHorizontal: 20,
        borderRadius: 7,
        width: '48%'
    }
})

export default styles