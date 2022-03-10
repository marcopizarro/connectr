import { FontAwesome } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootStackScreenProps } from '../types';


export default function FAQ() {
  return (
    <View style ={styles.container}>
      <Text style = {{fontFamily:"Helvetica", fontSize:15, fontWeight:"bold"}}>What can I use this app for?</Text>
      <Text style = {{fontFamily:"Helvetica", fontSize:15, padding:10}}>Connectr aims to make public transit more usable and accessible. We want to reduce the stress of interacting with a transit system by providing visual aids, user-friendly information services, and community-based support. We also hope to help people find the joy in public transit by introducing features that increase social interaction and spontaneity. Our product unites other public transit information services to create a singular platform for all transit needs.</Text>

      <Text style = {{fontFamily:"Helvetica", fontSize:15, fontWeight:"bold"}}>What do I do if someone says something offensive in the chat?</Text>
      <Text style = {{fontFamily:"Helvetica", fontSize:15, padding:10}}>We do not condone any violent or hateful speech. We encourage you to report the user by clicking the flag next to their name. This will delete their message and flag their count. </Text>

      <Text style = {{fontFamily:"Helvetica", fontSize:15, fontWeight:"bold"}}>How do I direct message a user?</Text>
      <Text style = {{fontFamily:"Helvetica", fontSize:15, padding:10}}>Click the message icon next to their name in the main chat. </Text>

      <Text style = {{fontFamily:"Helvetica", fontSize:15, fontWeight:"bold"}}>How do I join a group chat for my public transit option?</Text>
      <Text style = {{fontFamily:"Helvetica", fontSize:15, padding:10}}>Based on your route, we will add you to the chat of the transit option you are on. </Text>


    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width:"100%",
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: "flex-start",
    backgroundColor:"#E5E5E5",
    padding:20,
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
