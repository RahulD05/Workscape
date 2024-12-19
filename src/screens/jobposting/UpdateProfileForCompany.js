import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { BG_COLOR, TEXT_COLOR } from '@/src/utils/Colors'
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters'
import CustomTextInput from "../../common/CustomTextInput"
import CustomSolidBtn from "../../common/CustomSolidBtn"
import CustomBorderBtn from "../../common/CustomBorderBtn"
import { useNavigation } from '@react-navigation/native'
import Loader from '../../common/Loader'
import firestore from '@react-native-firebase/firestore'
import AsyncStorage from '@react-native-async-storage/async-storage'

const UpdateProfileForCompany = () => {
    const navigation = useNavigation();

    const [accountCreated, setAccountCreated] = useState(false)
    const [name, setName] = useState('')
    const [badName, setBadName] = useState('')

    const [email, setEmail] = useState('')
    const [badEmail, setBadEmail] = useState('')

    const [contact, setContact] = useState('')
    const [badContact, setBadContact] = useState('')

    const [company, setCompany] = useState('')
    const [badCompany, setBadCompany] = useState('')

    const [address, setAddress] = useState('')
    const [badAddress, setBadAddress] = useState('')

    const [loading, setLoading] = useState(false)

    const validate = () => {
        let nameRegex = /^[A-Za-z]+$/;
        let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        let contactRegex = /^\+?[1-9]\d{1,14}$/;
        let validName = true;
        let validEmail = true;
        let validContact = true;
        let validCompany = true;
        let validAddress = true;
        

        if (name == '') {
            validName = false;
            setBadName('Please Enter Name');
        } else if (name != '' && name.length < 3) {
            validName = false;
            setBadName('Please Enter Valid Name');
        } else if (name != '' && name.length >= 3 && !name.toString().match(nameRegex)) {
            validName = false;
            setBadName('Please Enter Valid Name');
        }
        else if (name != '' && name.length >= 3 && name.toString().match(nameRegex)) {
            validName = true;
            setBadName('');
        }


        if (email == '') {
            validEmail = false;
            setBadEmail('Please Enter Email');
        } else if (email != '' && !email.toString().match(emailRegex)) {
            validEmail = false;
            setBadEmail('Please Enter Valid Email');
        } else if (email != '' && email.toString().match(emailRegex)) {
            validEmail = true;
            setBadEmail('');
        }

        if (contact == '') {
            validContact = false;
            setBadContact('Please Enter Contact No.');
        } else if (contact != '' && !contact.toString().match(contactRegex)) {
            validContact = false;
            setBadContact('Please Enter Valid Contact No.');
        } else if (contact != '' && contact.toString().match(contactRegex)) {
            validContact = true;
            setBadContact('');
        }

        if (company == '') {
            validCompany = false;
            setBadCompany('Please Enter Company Name');
        } else if (company != '') {
            validCompany = true;
            setBadCompany('');
        }

        if (address == '') {
            validAddress = false;
            setBadAddress('Please Enter Company Address');
        } else if (address != '') {
            validAddress = true;
            setBadAddress('');
        }

        

        return validName && validEmail && validContact && validCompany && validAddress
    }

    const updateUser = async () => {
        const id = await AsyncStorage.getItem("USER_ID")
        setLoading(true);
        firestore()
            .collection('job_posters')
            .doc(id)
            .update({
                name,
                email,
                contact,
                address,
                company,
                
            })
            .then(async() => {
                await AsyncStorage.setItem('NAME', name)
                navigation.goBack();
            })
            .catch(error => {
                setLoading(false);
                console.log(error);

            });
    }

    useEffect(() => {
        getData()
    }, [])

    const getData = async() => {
        const mEmail = await AsyncStorage.getItem("EMAIL")
        firestore().collection("job_posters").where("email", "==", mEmail).get().then(res => {
            res.docs.forEach(item => {
                setName(item.data().name)
                setEmail(item.data().email)
                setContact(item.data().contact)
                setCompany(item.data().company)
                setAddress(item.data().address)
            })
        })
    }

    return (
        <SafeAreaView style={styles.container}>


            <CustomTextInput value={name} onChangeText={txt => { setName(txt); }} title={"Name"} placeholder={"xyz"} bad={badName != '' ? true : false} />
            {badName != '' && <Text style={styles.errorMsg}>{badName}</Text>}
            <CustomTextInput value={email} onChangeText={txt => { setEmail(txt); }} title={"Email"} placeholder={"xyz@gmail.com"} bad={badEmail != '' ? true : false} />
            {badEmail != '' && <Text style={styles.errorMsg}>{badEmail}</Text>}
            <CustomTextInput value={contact} onChangeText={txt => { setContact(txt); }} title={"Contact"} placeholder={"87984*****"} bad={badContact != '' ? true : false} />
            {badContact != '' && <Text style={styles.errorMsg}>{badContact}</Text>}
            <CustomTextInput value={company} onChangeText={txt => { setCompany(txt); }} title={"Company"} placeholder={"Eg. Google"} bad={badCompany != '' ? true : false} />
            {badCompany != '' && <Text style={styles.errorMsg}>{badCompany}</Text>}
            <CustomTextInput value={address} onChangeText={txt => { setAddress(txt); }} title={"Address"} placeholder={"Eg. 1/4, California"} bad={badAddress != '' ? true : false} />
            {badAddress != '' && <Text style={styles.errorMsg}>{badAddress}</Text>}

            <CustomSolidBtn title={"Update"} onClick={() => {
                if (validate()) {
                    updateUser()
                }
            }} />

            <Loader visible={loading} />


        </SafeAreaView>
    )
}

export default UpdateProfileForCompany;
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BG_COLOR,
    },
    logo: {
        width: scale(65),
        height: scale(80),
        alignSelf: 'center',
        marginTop: moderateVerticalScale(60),
    },
    title: {
        fontSize: moderateScale(20),
        alignSelf: 'center',
        fontWeight: '600',
        marginTop: moderateVerticalScale(40),
    },
    forgotPassword: {
        alignSelf: "flex-end",
        marginRight: moderateScale(20),
        marginTop: moderateVerticalScale(10),
        fontWeight: "500",
        fontSize: moderateScale(12),

    },
    errorMsg: {
        marginLeft: moderateScale(35),
        color: 'red',
    },
    doneView: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
})