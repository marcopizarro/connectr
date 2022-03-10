import { Alert, Button, Pressable, StyleSheet, TextInput } from 'react-native';
import firebase from 'firebase/app';

import EditScreenInfo from '../components/EditScreenInfo';
import { View, Text } from "react-native";
import { RootTabScreenProps } from '../types';
import { GoogleAuthProvider, signInWithPopup, getRedirectResult, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword} from "firebase/auth";

import { FirebaseError, initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc, getDocs, collection, query, where, addDoc} from 'firebase/firestore';
import React, { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { db, auth } from '../src/firebase/config.js';
import Modal from "react-native-modal";
import DropDownPicker from 'react-native-dropdown-picker';
import { StatusBar } from 'expo-status-bar';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [isModalVisible, setModalVisible] = useState(true);

  const [open, setOpen] = useState(false);
  const [value, setValue] = useState('hbZeEDxBFMlp8gD2yYwV');
  const [corIdex, setcorIdex] = useState(0);

  const [items, setItems] = useState([
    {label: 'Apple', value: 'apple'},
    {label: 'Banana', value: 'banana'}
  ]);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
      for(var i = 0; i < lines.length; i++) {
        if (lines[i].id == value) {
          setcorIdex(i);
            break;
        }
    }
  };

  const [lines, setLines] = useState([] as any);
  const [user, setUser] = useState(() => auth.currentUser);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [text, onChangeText] = React.useState("");

  
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
    // auth.signOut();
    getDocs(collection(db, "lines"))
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));

        const da2 = snapshot.docs.map((doc) => ({
          label: doc.data().name + " (" +  doc.data().agency + ")",
          value: doc.id,
        }));
        console.log(da2)
        console.log(items)
        setItems(da2)
        setLines(data);
      });
  }, []);

  if(user){
  return (
    <View
    style={{
      flexDirection: "column",
    }}>
      <StatusBar style="dark" />
            <Modal backdropColor='white'  backdropOpacity={.95} isVisible={isModalVisible}>
        <View style={{position:"absolute", alignSelf:"center", width:"100%", alignItems:"center"}}>
          {/* <Text>fsdf</Text> */}
          {/* <TextInput
          style={styles.input}
          onChangeText={onChangeText}
          value={text}
          placeholder="you go here"
          placeholderTextColor="gray"/> */}
        <Text style ={{margin: 10, fontFamily:"Helvetica", fontWeight:"400", fontSize:14}}>Based on your current location, we have selected your nearest line. (Change if necessary)</Text>
        <DropDownPicker
          open={open}
          value={value}
          items={items}
          setOpen={setOpen}
          setValue={setValue}
          setItems={setItems}
        />

          <Button title="Confirm" onPress={toggleModal} />
        </View>
      </Modal>
    <View style={{ backgroundColor: "#0F75B3", width: "100%", height: 50, justifyContent: 'center',}}>
      <Text style={{paddingLeft:20, fontSize:25, color:"white", fontWeight:"600", fontFamily:"Helvetica",}}>Current Ride</Text>
    </View>
    {lines[corIdex]?
    <Pressable key={lines[corIdex].id} onPress={() => navigation.navigate('Groupchat', {obj: lines[corIdex]})}>
        <View key={lines[corIdex].id} style={{ margin:10, flexDirection:"row", justifyContent:"space-between"}}>
            <View style = {{borderRadius:50, backgroundColor:`${lines[corIdex].color}`,display:"flex", width:60, height:60, margin:5, alignSelf:"center", alignItems:"stretch", justifyContent:"center", flex:0}}>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"700", fontSize:22, alignSelf:"center", color:"white"}}>{lines[corIdex].short}</Text>
          </View>

            <View style={{margin:10, flexDirection:"column", alignItems:"flex-start", flex:1}}>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"500", fontSize:14}}>{lines[corIdex].name} ({lines[corIdex].agency})</Text>
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"100", fontSize:14}}>Last active: Now</Text>
            </View>

          <Pressable style={{borderRadius:10, backgroundColor:"#0F75B3", height:35, alignSelf:"center", marginEnd:10, flex:0, flexDirection:"column", alignItems:"center"}} onPress={() => navigation.navigate('TransitInfo', {obj: lines[corIdex]})}>
            <Text style={{ margin: "auto", padding:10, alignSelf:"center", color:"white"}}>Transit Info</Text>
          </Pressable>
        </View>
      </Pressable>
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
              <Text style ={{margin: "auto", fontFamily:"Helvetica", fontWeight:"100", fontSize:14}}>Last active: Now</Text>
            </View>

          <Pressable style={{borderRadius:10, backgroundColor:"#0F75B3", height:35, alignSelf:"center", marginEnd:10, flex:0, flexDirection:"column", alignItems:"center"}} onPress={() => navigation.navigate('TransitInfo', {obj: message})}>
            <Text style={{ margin: "auto", padding:10, alignSelf:"center", color:"white"}}>Transit Info</Text>
          </Pressable>
          
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
