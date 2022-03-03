import { Alert, Button, Pressable, StyleSheet } from 'react-native';
import firebase from 'firebase/app';

import EditScreenInfo from '../components/EditScreenInfo';
import { View, Text } from "react-native";
import { RootTabScreenProps } from '../types';
import { GoogleAuthProvider, signInWithPopup, getRedirectResult} from "firebase/auth";

import { FirebaseError, initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc, getDocs, collection, query, where, addDoc} from 'firebase/firestore';
import React, { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { db, auth, signInWithGoogle } from '../src/firebase/config.js';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [lines, setLines] = useState([] as any);
  const [user, setUser] = useState(() => auth.currentUser);
  
  // auth.useDeviceLanguage();
  
  // signInWithRedirect(auth, provider);


  useEffect(() => {
    getDocs(collection(db, "lines"))
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
          
        }));
        setLines(data);
      });
  }, []);
  if(!user){
  return (
    <View
    style={{
      flexDirection: "column",
    }}>
    <View style={{ backgroundColor: "#0F75B3", width: "100%", height: 50, justifyContent: 'center',}}>
      <Text style={{paddingLeft:20, fontSize:25, color:"white", fontWeight:"600", fontFamily:"Helvetica",}}>Your Ride</Text>
    </View>
    {lines[0]?
        <View key={lines[0].id} style={{ margin:10, flexDirection:"row", justifyContent:"space-between"}}>
            <View style = {{borderRadius:50, backgroundColor:`${lines[0].color}`,display:"flex", width:60, height:60, margin:5, alignSelf:"center", alignItems:"stretch", justifyContent:"center", flex:0}}>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"700", fontSize:22, alignSelf:"center", color:"white"}}>{lines[0].short}</Text>
            </View>

            <View style={{margin:10, flexDirection:"column", alignItems:"flex-start", flex:1}}>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"500", fontSize:14}}>{lines[0].name} ({lines[0].agency})</Text>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"100", fontSize:14}}>"Marco: sample text heres"</Text>
            </View>

          <Pressable style={{borderRadius:10, backgroundColor:"#0F75B3", height:35, alignSelf:"center", marginEnd:10, flex:0, flexDirection:"column", alignItems:"center"}} onPress={() => Alert.alert('Simple Button pressed')}>
            <Text style={{ margin: "auto", padding:10, alignSelf:"center"}}>Transit Info</Text>
          </Pressable>
        </View>
      : <View/>}
      
    <View style={{ backgroundColor: "#0F75B3", width: "100%", height: 50, justifyContent: 'center',}}>
      <Text style={{paddingLeft:20, fontSize:25, color:"white", fontWeight:"600", fontFamily:"Helvetica",}}>Lines Near You</Text>
    </View>
    <View>
      {lines.map((message: { id: string; name: string; color: string | ReactChild | ReactFragment | ReactPortal | null | undefined; agency: string | ReactChild | ReactFragment | ReactPortal | null | undefined; short: string | ReactChild | ReactFragment | ReactPortal | null | undefined;}) => (
        <Pressable key={message.id} onPress={() => navigation.navigate('Groupchat', {obj: message})}>
        <View  style={{ margin:10, flexDirection:"row", justifyContent:"space-between"}} >
            <View style = {{borderRadius:50, backgroundColor:`${message.color}`,display:"flex", width:60, height:60, margin:5, alignSelf:"center", alignItems:"stretch", justifyContent:"center", flex:0}}>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"700", fontSize:22, alignSelf:"center", color:"white"}}>{message.short}</Text>
            </View>

            <View style={{margin:10, flexDirection:"column", alignItems:"flex-start", flex:1}}>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"500", fontSize:14}}>{message.name} ({message.agency})</Text>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"100", fontSize:14}}>"Marco: sample text heres"</Text>
            </View>

          <Pressable style={{borderRadius:10, backgroundColor:"#0F75B3", height:35, alignSelf:"center", marginEnd:10, flex:0, flexDirection:"column", alignItems:"center"}} onPress={() => navigation.navigate('Modal')}>
            <Text style={{ margin: "auto", padding:10, alignSelf:"center"}}>Transit Info</Text>
          </Pressable>
          
        </View>
        </Pressable>
      ))}
    </View>
  </View>
  );}
  else{
    return(
      <Pressable onPress={signInWithGoogle}>
        <Text>Sign in</Text>
        </Pressable>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});
