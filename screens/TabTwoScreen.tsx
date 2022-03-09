
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { Alert, Button, Pressable, StyleSheet, TextInput } from 'react-native';
import firebase from 'firebase/app';

import { RootTabScreenProps } from '../types';
import { GoogleAuthProvider, signInWithPopup, getRedirectResult, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";

import { FirebaseError, initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc, getDocs, collection, query, where, addDoc} from 'firebase/firestore';
import React, { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { db, auth } from '../src/firebase/config.js';

export default function TabTwoScreen({ navigation }: RootTabScreenProps<'TabTwo'>) {
  const [lines, setLines] = useState([] as any);
  const [user, setUser] = useState(() => auth.currentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [dmsID, setDMSID] = useState([] as any);
  const [dms, setDMS] = useState([] as any);

  onAuthStateChanged(auth, user => {
    if (user != null) {
      setUser(user);
      console.log('We are authenticated now!');
    }
    });

  const signUp = () => {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          setDoc(doc(db, "users", userCredential.user.uid), {
            email: userCredential.user.email,
            firstName: name,
            uid: userCredential.user.uid,
            dms: [],
          });
        })
        .catch((error) => {
            console.log(error);
        });
  };

  const signIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
      })
      .catch((error) => {
          console.log(error);
      });
  };

  useEffect(() => {
    const getDMInfo = async () => {
      let promises = [];
      let results: any[] = [];
      console.log(dmsID)
      if(dmsID){
        for(var i = 0; i < dmsID.length; i ++){
          promises.push(getDoc(doc(db, "dms", dmsID[i])));
        }
      }
        for (const element of promises) {
          let result = await element;
          results.push({"title": result.data().title, "users": result.data().users, "id": result.id});
          console.log(result.data())
        }
        setDMS(results);
        console.log(results);
    };
    getDMInfo();
  }, [dmsID]);

  useEffect(() => {
    getDoc(doc(db, "users", auth.currentUser?.uid))
      .then((snapshot) => {
        console.log("getting");
        setDMSID(Array.from(snapshot.data().dms));
       });
  }, []);


  if(user){
  return (
    <View
    style={{
      flexDirection: "column",
    }}>
 
    <View style={{ backgroundColor: "#0F75B3", width: "100%", height: 50, justifyContent: 'center',}}>
      <Text style={{paddingLeft:20, fontSize:25, color:"white", fontWeight:"600", fontFamily:"Helvetica",}}>Your DMs</Text>
    </View>
    <View>
      {dms.map((dm: { id: string;  title: string | undefined}) => (
        <Pressable key={dm.id} onPress={() => navigation.navigate('DM', {chatId: dm.id})}>
        <View  style={{ margin:10, flexDirection:"row", justifyContent:"space-between"}} >
            <View style = {{borderRadius:50, backgroundColor:"orange",display:"flex", width:60, height:60, margin:5, alignSelf:"center", alignItems:"stretch", justifyContent:"center", flex:0}}>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"700", fontSize:22, alignSelf:"center", color:"white"}}></Text>
            </View>

            <View style={{margin:10, flexDirection:"column", alignItems:"flex-start", flex:1}}>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"500", fontSize:14}}>{dm.title}</Text>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"100", fontSize:14}}>Last active: Now</Text>
            </View>
        </View>
        </Pressable>
      ))}
    </View>
  </View>
  );}
  else{
    return(
      <View style = {{flexDirection:"column", alignItems:"center", padding:20}}>
        <Text style={{fontSize:25, fontWeight:"600", fontFamily:"Helvetica",}}>Welcome to Connectr!</Text>
        <TextInput
        style={styles.input}
        onChangeText={setName}
        value={name}
        placeholder="your name"
        placeholderTextColor="gray" />
        <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="your email"
        placeholderTextColor="gray" />
        <TextInput
        style={styles.input}
        onChangeText={setPassword}
        value={password}
        placeholder="your password"
        placeholderTextColor="gray"
        secureTextEntry={true}/>

        <View style={{backgroundColor:"#0F75B3", width:100, padding:10, margin:10, borderRadius:10}}>
          <Pressable 
          onPress={signUp}>
            <Text style={{color:"white", alignSelf:"center"}}>Sign Up</Text>
          </Pressable>
        </View>

        <View style={{backgroundColor:"#0F75B3", width:100, padding:10, margin:10, borderRadius:10}}>
          <Pressable 
          onPress={signIn}>
            <Text style={{color:"white", alignSelf:"center"}}>Sign In</Text>
          </Pressable>
        </View>
      </View>
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
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    width:"70%",
  },
});
