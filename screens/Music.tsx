import { Pressable, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, ScrollView} from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc, getDocs, collection, query, where, Timestamp, addDoc, orderBy, updateDoc, arrayUnion} from 'firebase/firestore';
import React, { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { db, auth } from '../src/firebase/config.js';
import { FontAwesome } from '@expo/vector-icons';

export default function Music({ route, navigation }: RootStackScreenProps<'Music'>) {
  const [messages, setMessages] = useState([] as any);
  const [text, onChangeText] = React.useState("");
  const [name, changeName] = React.useState("");


  useEffect(() => {

      const a = query(collection(db, "users"), where("uid", "==", auth.currentUser?.uid));
      getDocs(a)
        .then((snapshot) => {
          snapshot.forEach((snap)=>{
            changeName(String(snap.data().firstName));
          })
        });

    console.log(auth.currentUser?.email)
    const q = query(collection(db, "lines", route.params?.obj.id, "messages"), orderBy("sent"));
    getDocs(q)
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        console.log(data);
        setMessages(data);
      });
  }, []);

  const update = () =>{
    const q = query(collection(db, "lines", route.params?.obj.id, "messages"), orderBy("sent"));
    getDocs(q)
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setMessages(data);
      });
  };

  const back = () => {
    navigation.goBack();
  };

  const makeDM = (otherID:string, othername:string) =>{
    addDoc(collection(db, "dms"), {
      users: [auth.currentUser?.uid, otherID],
      title:  othername + " & " + name,
    }).then((res) => {

      console.log("Document written with ID: ", res.id);

      const ref1 = doc(db, "users", auth.currentUser?.uid);
      updateDoc(ref1, {
        dms: arrayUnion(res.id)
      });

      const ref2 = doc(db, "users", otherID);
      updateDoc(ref2, {
        dms: arrayUnion(res.id)
      });

      navigation.navigate('DM', {chatId: res.id});
    });
  };

  const sendMessage = () =>{
    addDoc(collection(db, "lines", route.params?.obj.id, "messages"), {
      content: text,
      user: auth.currentUser?.uid,
      sent: Timestamp.now(),
      name: name,
    }).then((res) => {
      console.log("Document written with ID: ", res.id);
      onChangeText("")
      update();
      Keyboard.dismiss()
    });
  };

  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      <View style = {{display:"flex", flexDirection:"row", alignItems: "center", width:"100%", justifyContent:"center"}}>
        <Pressable onPress={back}  style={{left:0, position:"absolute"}}>
            <FontAwesome
                      name="caret-left"
                      size={50}
                      color="black"
                      style={{ padding:20, left:0}}
            />
      </Pressable>

        <View style = {{alignSelf:"flex-end", alignItems:"center"}}>
          <View style = {{borderRadius:50, backgroundColor:`${route.params?.obj.color}`, width:70, height:70, margin:5, justifyContent:"center", }}>
            <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"700", fontSize:28, alignSelf:"center", color:"white"}}>{route.params?.obj.short}</Text>
          </View>
          <Text>
          {route.params?.obj.name} ({route.params?.obj.agency})
          </Text>
        </View>
      </View>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingTop:50,
    backgroundColor:"white",
    width:"100%",
    flexDirection:"column",
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width:"70%",
  },
});
