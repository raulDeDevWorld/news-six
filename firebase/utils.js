import { initializeApp } from 'firebase/app';
import { app } from './config'
import { onAuthStateChanged, getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut  } from "firebase/auth";
import { getDatabase, ref, onValue, set, update, child, get, query, remove, limitToFirst, limitToLast, orderByValue, orderByChild, endAt , equalTo} from "firebase/database";
import { getList, getIndexStorage} from './storage'
import { getDate, getDayMonthYear, getMonthAndYear} from '../utils/Utils'



const auth = getAuth();
const db = getDatabase(app);

function onAuth(setUserProfile, setUserData, postsIMG, setUserPostsIMG, setUserDate, setUserMonthAndYear, setUserDayMonthYear, monthAndYear) {
  return onAuthStateChanged(auth, (user) => {
    if (user) {
      setUserProfile(user)
    } else {
      setUserProfile(user)
    }
    
    getMonthAndYear(setUserMonthAndYear)
    getDayMonthYear(setUserDayMonthYear)
  });
}

// ---------------------------Login, Sign Up and Sign In------------------------------------

function signUpWithEmail (email, password, setUserSuccess) {
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setUserSuccess('SignUpError')
    // ..
  });
}

function signInWithEmail (email, password, setUserSuccess) {
  signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // Signed in
    const user = userCredential.user;
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    setUserSuccess('Verify')
  });
}

function handleSignOut () {
  signOut(auth).then(() => {
  // Sign-out successful.
}).catch((error) => {
  // An error happened.
});
}

// -------------------------------Firebase Realtime Database------------------------------------


let allData = {}


function getIndexData(setUserData, date) {
  let arr = ['Inicio', 'Sociedad', 'Salud', 'Seguridad', 'Politica', 'Economia', 'Deportes', 'GestionDeGobierno', 'Cultura', 'Empresarial', 'Internacional']
  let arr2 = ['BannerIzquierdo1', 'BannerIzquierdo2', 'BannerIzquierdo3', 'BannerPortada1', 'BannerPortada2', 'BannerPortada3', 'BannerDerecho1', 'BannerDerecho2', 'BannerDerecho3', 'BannerPortada']
  let arr3 = ['BannerNotas1', 'BannerNotas2']


  get(query(ref(db, 'users')))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let snap = snapshot.val()
        setUserData(allData)
        allData = { ...allData, users: snap }
      }

    });



    arr2.map((i) => { 
    get(query(ref(db, i)))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let snap = snapshot.val()
        setUserData(allData)
        allData = { ...allData, [i]: snap }
      }
    });
  });


  arr3.map((i) => { 
    get(query(ref(db, i)))
    .then((snapshot) => {
      if (snapshot.exists()) {
        let snap = snapshot.val()
        setUserData(allData)
        allData = { ...allData, [i]: snap }
      }
    });
  });


  arr.map((i) => {

    get(query(ref(db, `${i}/Posts`), limitToLast(5), orderByChild('fecha'), endAt(date) ))
      .then((snapshot) => {

        if (snapshot.exists()) {

          let snap = snapshot.val()
          allData = {
            ...allData, [i]: {
              Posts: snap,
              Templates: 'hello'
            }
          }
       setUserData(allData)
        }
      })
  });

}

function getSpecificData(rute, specificData, setUserSpecificData) {

  let key = rute.split('/').pop()
  get(child(dbRef, `${rute}`)).then((snapshot) => {
    if (snapshot.exists()) {
      let snap = snapshot.val()
      setUserSpecificData({...specificData, [key] : snap})
    } else {
      setUserSpecificData({...specificData, [key] : {nota: 'en redaccion'}})
    }
  }).catch((error) => {
    console.error(error);
  });
}

function writeUserData(ruteDB, object, setUserSuccess, detail) {
  update(ref(db, `${ruteDB}`), object)
    .then(() => {
      setUserSuccess !== null ? setUserSuccess('save') : ''
      getIndexData(setUserData,)
    })
    .catch(() => '')
}

async function removeData(ruteDB, setUserData, setUserSuccess) {
  await remove(ref(db, ruteDB)).then(() => setUserSuccess('save')).catch(() => setUserSuccess('repeat'));
  getIndexData(setUserData)
}
export {app, onAuth, signUpWithEmail, signInWithEmail, handleSignOut, getIndexData, getSpecificData, writeUserData, removeData, }






