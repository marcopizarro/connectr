import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import MapView from 'react-native-maps';


export default function ModalScreen({}) {
  return (
    <View style={styles.container}>
      <View style={{backgroundColor:"#E5E5E5", width: "100%", height: "25%", justifyContent: 'center', flexDirection:"row"}}>
        <View style={{backgroundColor:"white", width:"50%", margin:10, alignItems: 'center',justifyContent: "center", flexDirection:"row", borderRadius:22}}>
          <Text style ={{width:"20%", fontSize:60, color:"#0EB349", fontFamily:"Helvetica"}}>8</Text>
          <Text style ={{width:"42%", fontSize:28, margin:5, fontFamily:"Helvetica", fontWeight:"200"}}>mins away</Text>
        </View>
        <View style={{backgroundColor:"white", width:"50%", margin:10, alignItems: 'center',justifyContent: "center", flexDirection:"column", borderRadius:22}}>
          <Text style ={{fontSize:32, color:"#0EB349",fontFamily:"Helvetica", fontWeight:"700"}}>Palo Alto</Text>
          <AntDesign name="arrowdown" size={30} color="black" />
          <Text style ={{fontSize:32, color:"#0EB349",fontFamily:"Helvetica", fontWeight:"700"}}>Tressider</Text>
        </View>
      </View>
      <View style={{backgroundColor:"#E5E5E5", width: "100%", height: "25%", justifyContent: 'center', flexDirection:"row"}}>
        <View style={{backgroundColor:"white", width:"50%", margin:10, alignItems: 'center',justifyContent: "center", flexDirection:"row", borderRadius:22}}>
          <Text style ={{width:"20%", fontSize:60, color:"#0EB349", fontFamily:"Helvetica"}}>0</Text>
          <Text style ={{width:"42%", fontSize:28, margin:5, fontFamily:"Helvetica", fontWeight:"200"}}>active users</Text>
        </View>
        <View style={{backgroundColor:"white", width:"50%", margin:10, alignItems: 'center',justifyContent: "center", flexDirection:"row", borderRadius:22}}>
        <Text style ={{width:"20%", fontSize:60, color:"#0EB349", fontFamily:"Helvetica"}}>0</Text>
          <Text style ={{width:"42%", fontSize:28, margin:5, fontFamily:"Helvetica", fontWeight:"200"}}>alerts</Text>
        </View>
      </View>
      <View style={{backgroundColor:"#E5E5E5", width: "100%", height: "25%", justifyContent: 'center', alignItems:"center"}}>
        <View style={{backgroundColor:"#0F75B3", padding:20, borderRadius:22}}>
          <Text style ={{ fontSize:22, margin:5, fontFamily:"Helvetica", fontWeight:"500", color:"white"}}>Open in Maps</Text>
          </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width:"100%",
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: "center",
    backgroundColor:"#E5E5E5",

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
