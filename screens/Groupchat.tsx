import { Pressable, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard} from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc, getDocs, collection, query, where, Timestamp, addDoc, orderBy} from 'firebase/firestore';
import React, { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { db, auth } from '../src/firebase/config.js';

export default function Groupchat({ route, navigation }: RootStackScreenProps<'Groupchat'>) {
  const [messages, setMessages] = useState([] as any);
  const [text, onChangeText] = React.useState("");
  

  useEffect(() => {
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
        console.log(data);
        setMessages(data);
      });
  };

  const sendMessage = () =>{
    addDoc(collection(db, "lines", route.params?.obj.id, "messages"), {
      content: text,
      user: "you",
      sent: Timestamp.now(),
    }).then((res) => {
      console.log("Document written with ID: ", res.id);
      onChangeText("")
      update();
      Keyboard.dismiss()
    });
  };


  return (
    <KeyboardAvoidingView behavior="height" style={styles.container}>
      {/* <Text style={styles.title}>{</Text> */}
      {messages.map((message: { id: Key; content:string; sent: Timestamp; user:string}) => (
         <View key={message.id} style={{width:"100%"}}>
              <View style = {{backgroundColor:"#0F75B3", padding:10, width:"60%", borderRadius:"20",margin:5}}>
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
        <Pressable onPress={sendMessage} style={{width:"20%", backgroundColor:"#0F75B3", marginRight:20,alignItems:"center", borderRadius:15}}>
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
    paddingLeft:10,
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
