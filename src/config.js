import * as firebase from 'firebase';

var config = {
  apiKey: 'AIzaSyDRm6eMxsef0383rkQFwEoemtkuHEh2PEw',
  authDomain: 'storytellingapp-afcd9.firebaseapp.com',
  databaseURL: 'https://storytellingapp-afcd9.firebaseio.com',
  projectId: 'storytellingapp-afcd9',
  storageBucket: 'storytellingapp-afcd9.appspot.com',
  messagingSenderId: '917802242180',
  appId: '1:917802242180:android:d71aec743d5f29499172d1',
};
firebase.initializeApp(config);

let database = firebase.database();

module.exports = {
  db: database,
  auth: firebase.auth(),
  stor: firebase.storage(),
};
