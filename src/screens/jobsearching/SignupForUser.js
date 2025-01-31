import { View, Text, StyleSheet, SafeAreaView, Image, ScrollView, Alert } from 'react-native'
import React, { useState } from 'react'
import { BG_COLOR, TEXT_COLOR } from '@/src/utils/Colors'
import { moderateScale, moderateVerticalScale, scale } from 'react-native-size-matters'
import CustomTextInput from "../../common/CustomTextInput"
import CustomSolidBtn from "../../common/CustomSolidBtn"
import CustomBorderBtn from "../../common/CustomBorderBtn"
import { useNavigation } from '@react-navigation/native'
import Loader from '../../common/Loader'
import firestore from '@react-native-firebase/firestore'

const SignupForUser = () => {
  const navigation = useNavigation();

  const [accountCreated, setAccountCreated] = useState(false)
  const [name, setName] = useState('')
  const [badName, setBadName] = useState('')

  const [email, setEmail] = useState('')
  const [badEmail, setBadEmail] = useState('')

  const [contact, setContact] = useState('')
  const [badContact, setBadContact] = useState('')

  const [password, setPassword] = useState('')
  const [badPassword, setBadPassword] = useState('')

  const [loading, setLoading] = useState(false)

  const validate = () => {
    let nameRegex = /^[A-Za-z]+$/;
    let emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    let contactRegex = /^\+?[1-9]\d{1,14}$/;
    let validName = true;
    let validEmail = true;
    let validContact = true;
    let validPass = true;

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

    if (password == '') {
      validPass = false;
      setBadPassword('Please create a password');
    } else if (password != '' && password.length < 6) {
      validPass = false;
      setBadPassword('Password length should be greater than 6');
    }
    else if (password != '' && password.length >= 6) {
      validPass = true;
      setBadPassword('');
    }

    return validName && validEmail && validContact && validPass
  }

  const registerUser = () => {
    setLoading(true);
    firestore()
    .collection('users')
    .add({
      name,
      email,
      contact,
      password,
    })
    .then(() => {
      setName("")
      setEmail("")
      setPassword("")
      setContact("")
      setAccountCreated(true);
      setLoading(false);
      setTimeout(() => {
        navigation.navigate("LoginForUser");
      }, 3000)
    })
    .catch(error => {
      setLoading(false);
      console.log(error);
      
    });
  }

  return (
    <SafeAreaView style={styles.container}>
      {!accountCreated ?(<ScrollView>
        <Image source={require('../../images/logows.png')} style={styles.logo} />
        <Text style={styles.title}>Create Account</Text>
        <CustomTextInput value={name} onChangeText={txt => { setName(txt); }} title={"Name"} placeholder={"xyz"} bad={badName != '' ? true : false} />
        {badName != '' && <Text style={styles.errorMsg}>{badName}</Text>}
        <CustomTextInput value={email} onChangeText={txt => { setEmail(txt); }} title={"Email"} placeholder={"xyz@gmail.com"} bad={badEmail != '' ? true : false} />
        {badEmail != '' && <Text style={styles.errorMsg}>{badEmail}</Text>}
        <CustomTextInput value={contact} onChangeText={txt => { setContact(txt); }} title={"Contact"} placeholder={"87984*****"} bad={badContact != '' ? true : false} />
        {badContact != '' && <Text style={styles.errorMsg}>{badContact}</Text>}
        <CustomTextInput value={password} onChangeText={txt => { setPassword(txt); }} title={"Password"} placeholder={"*********"} bad={badPassword != '' ? true : false} />
        {badPassword != '' && <Text style={styles.errorMsg}>{badPassword}</Text>}
        <CustomSolidBtn title={"Sign Up"} onClick={() => {
          if (validate()) {
              registerUser()
          }
        }} />
        <CustomBorderBtn title={"Login"} onClick={() => {
          navigation.navigate('LoginForUser')
        }} />
        <Loader visible = {loading}/>
      </ScrollView>):(
        <View style={styles.doneView}>
          <Image source={require('../../images/check.png')} style={styles.logo} />
          <Text style={styles.title}>{'Account Created Successfully'}</Text>
        </View>
      )}
      
    </SafeAreaView>
  )
}

export default SignupForUser;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BG_COLOR,
    paddingBottom: moderateVerticalScale(40),
  },
  logo: {
    width: scale(65),
    height: scale(80),
    alignSelf: 'center',
    marginTop: moderateVerticalScale(40),
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
  doneView:{
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
})