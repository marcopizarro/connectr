import { Pressable, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard} from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc, getDocs, collection, query, where, Timestamp, addDoc, orderBy} from 'firebase/firestore';
import React, { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { db, auth } from '../src/firebase/config.js';
import { FontAwesome } from '@expo/vector-icons';

export default function Groupchat({ route, navigation }: RootStackScreenProps<'Groupchat'>) {
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

// function getName(uid: string) {
//     const q = query(collection(db, "users"), where("uid", "==", auth.currentUser?.uid));
//     getDocs(q)
//       .then((snapshot) => {
//         snapshot.forEach((snap)=>{
//           return(String(snap.data().firstName));
//         })
//       });
//   };


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
      <View style = {{display:"flex", flexDirection:"row", alignItems: "center", justifyContent: "space-between", width:"100%"}}>
        <Pressable onPress={back}>
      <FontAwesome
                name="caret-left"
                size={50}
                color="black"
                style={{ padding:20}}
      />
      </Pressable>
        <View>
          <View style = {{borderRadius:50, backgroundColor:`${route.params?.obj.color}`,display:"flex", width:70, height:70, margin:5, justifyContent:"center", alignSelf:"center"}}>
            <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"700", fontSize:28, alignSelf:"center", color:"white"}}>{route.params?.obj.short}</Text>
          </View>
          <Text>
          {route.params?.obj.name} ({route.params?.obj.agency})
          </Text>
        </View>
        <FontAwesome
                name="headphones"
                size={50}
                color="black"
                style={{ padding:20}}
              />
      </View>

      {messages.map((message: { id: Key; content:string; sent: Timestamp; user:string; name:string}) => (
        
        message.user != auth.currentUser?.uid 
        ? 
         <View key={message.id} style={{width:"100%"}}>
              <View style = {{  width:"60%",paddingLeft:12, margin:2}}>
                <Text style={{color:"black"}}>{message.name ? message.name : "anon"}</Text>
              </View>
              <View style = {{backgroundColor:"#0F75B3", padding:10, width:"60%", borderRadius:20,margin:2}}>
                <Text style={{color:"white"}}>{message.content}</Text>
              </View>
        </View>
        :
        <View key={message.id} style={{width:"100%"}}>
              <View style = {{  width:"60%",paddingLeft:12, margin:2,  alignSelf:"flex-end", }}>
                <Text style={{color:"black"}}>{message.name ? message.name : "anon"}</Text>
              </View>
          <View style = {{backgroundColor:"#520EB3", padding:10, width:"60%", borderRadius:20,margin:2, alignSelf:"flex-end",}}>
            <Text style={{color:"white"}}>{message.content}</Text>
          </View>
       </View>
          
          ))}
      <View style = {{width:"100%", flexDirection:"row", alignItems:"center", position:"absolute", bottom:10}}>
        <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="useless placeholder"/>
        <Pressable onPress={sendMessage} style={{width:"20%", backgroundColor:"#0F75B3",alignItems:"center", borderRadius:15}}>
          <Text style={{padding:5, color:"white"}}>
            Send
          </Text>
        </Pressable>
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
