import { Pressable, StyleSheet, TextInput, TouchableOpacity, KeyboardAvoidingView, Keyboard, ScrollView, Linking} from 'react-native';

import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';

import { initializeApp } from 'firebase/app';
import { getFirestore, setDoc, doc, getDoc, getDocs, collection, query, where, Timestamp, addDoc, orderBy, updateDoc, arrayUnion} from 'firebase/firestore';
import React, { Key, ReactChild, ReactFragment, ReactPortal, useEffect, useState } from 'react';
import { db, auth } from '../src/firebase/config.js';
import { FontAwesome } from '@expo/vector-icons';
import { Image } from 'react-native';

export default function Music({ route, navigation }: RootStackScreenProps<'Music'>) {
  const [messages, setMessages] = useState([] as any);
  const [text, onChangeText] = React.useState("");
  const [name, changeName] = React.useState("");
  const [playpause, changeplaypause] = React.useState("play");
  const [songs, changeSongs] = React.useState([
  {id: "0", name: "Good Grief", artist: "Bastille", added:"", link:"https://open.spotify.com/track/1oxOiOjsi7plNOZEhoPLPj?autoplay=true", image:"https://upload.wikimedia.org/wikipedia/en/d/dd/Good_Grief_%28Official_Single_Cover%29_by_Bastille.png"},
  {id: "1", name: "Baby Boy", artist: "Kevin Abstract", added:"", link:"https://open.spotify.com/track/5K7dEG6yDQ981HO7kFMVqm?autoplay=true", image:"data:image/jpeg;base64,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"},
  {id: "2", name: "Close to You", artist: "Dayglow", added:"", link:"https://open.spotify.com/track/4ReJJcpW8HtVnqzhf6DwNV?autoplay=true", image:"https://m.media-amazon.com/images/I/A1ai0HQGrWL._SS500_.jpg"},
  {id: "3", name: "So Hot You're Hurting My Feelings", artist: "Caroline Polachek", added:"", link:"https://open.spotify.com/track/5B6Kjha6RRIMWGN7zGsAaT?autoplay=true", image:"https://i.scdn.co/image/ab67616d0000b2737d983e7bf67c2806218c2759"},
  {id: "4", name: "All Too Well", artist: "Taylor Swift", added:"", link:"https://open.spotify.com/track/1q3RiD1tIWUpGsNFADMlvl?autoplay=true", image:"https://upload.wikimedia.org/wikipedia/en/4/47/Taylor_Swift_-_Red_%28Taylor%27s_Version%29.png"},
  {id: "5", name: "Nothing Has Changed", artist: "The Polar Boys", added:"", link:"https://open.spotify.com/album/3P8EB9EnU2vwxpByL3lPRS", image:"https://images.genius.com/05a13e5ddd27f0681efe1bd047e4d221.720x720x1.jpg"},
  {id: "6", name: "Come On Eileen", artist: "Dexys Midnight Runners", added:"", link:"https://open.spotify.com/track/3MrWxJaD2AT0W9DjWF64Vm?si=66907a6346984ba7", image:"https://upload.wikimedia.org/wikipedia/en/7/78/DexysMidnightRunnerComeOnEileen7InchSingleCover.jpg"},
  {id: "7", name: "Want You Back", artist: "HAIM", added:"", link:"https://open.spotify.com/track/2wXhdaTnmkkFSOidKfnOxA?autoplay=true", image:"https://images.genius.com/68b89693019382fe8937bea103f1d2c8.1000x1000x1.png"},
  {id: "8", name: "Goodie Bag", artist: "Still Woozy", added:"", link:"https://open.spotify.com/track/4vHNeBWDQpVCmGbaccrRzi?autoplay=true", image:"https://images.genius.com/e9b3e2ec7067578b1f3b27df24c66d8e.500x500x1.jpg"},
  {id: "9", name: "Kilby Girl", artist: "The Backseat Lovers", added:"", link:"https://open.spotify.com/track/1170VohRSx6GwE6QDCHPPH?autoplay=true", image:"https://f4.bcbits.com/img/a4171388314_5.jpg"},
])


  useEffect(() => {
    console.log(songs)
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

  const switchPlay =() =>{
    if (playpause == "play"){
      changeplaypause("pause"); 
    } else {
      changeplaypause("play"); 
    }
  }
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
    <View style={styles.container}>

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
          {/* {route.params?.obj.name} ({route.params?.obj.agency}) */}
          Music Sharing
          </Text>
        </View>
        <Pressable  style={{right:0, position:"absolute"}}>
            <FontAwesome
                      name="plus"
                      size={35}
                      color="black"
                      style={{ padding:20, left:0}}
            />
      </Pressable>
      </View>
      <ScrollView style = {{width:"100%", height:"100%"}}>
        {songs.map((song: { id: string; name: string; artist: string; added:string; link:string; image:string}) => {
          if(song.added == ""){
          return(
            <Pressable key ={song.id} onPress={() => {Linking.openURL(song.link).catch((err: any) => console.error("Couldn't load page", err));}}>
          <View  style = {{height:70, flexDirection:"row", alignItems:"center", justifyContent:"space-between", width:"100%", marginVertical:5,}}>
            
            <Image
              style={{ width: 70, height: 70, flex:1}}
              source={{uri:`${song.image}`}}
              resizeMode='contain'
            />
            <View style = {{flexDirection:'column', justifyContent:"space-around", flex:2, width:"100%"}}>
              <View style={{flexDirection:"row", alignItems:"center"}}>
                <Text numberOfLines={1} style ={[styles.text, {fontWeight:"900", maxWidth:"55%"}]}>{song.name}</Text>
                <Text> </Text>
                <Text numberOfLines={1}  style ={[styles.text, {fontWeight:"100", fontSize:14, maxWidth:"44%"}]}>{song.artist}</Text>
              </View>
              <Text style ={[styles.text, {fontWeight:"100"}]}>added by {song.added}</Text>
            </View>
            <FontAwesome
                name="align-justify"
                size={30}
                color="black"
                style={{ marginRight: 15, alignSelf:"center",flex:0.2}}
              />
          </View>
          </Pressable>
        );
        }
      })
      }
      </ScrollView>
      <View style={{position:"absolute", bottom:40, height:100, width:"100%", flexDirection:"row", justifyContent:"space-between"}}>
      <Pressable  style={{}}>
            <FontAwesome
                      name="backward"
                      size={45}
                      color="black"
                      style={{ padding:40}}
            />
      </Pressable>
      <Pressable  onPress={switchPlay}  style={{}}>
            <FontAwesome
                      name={playpause}
                      size={45}
                      color="black"
                      style={{padding:40}}
            />
      </Pressable>
      <Pressable  style={{}}>
            <FontAwesome
                      name="forward"
                      size={45}
                      color="black"
                      style={{padding:40}}
            />
      </Pressable>
      </View>

    </View>
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
  text:{
    fontSize:19,
    fontFamily:"Helvetica",

  }
});
