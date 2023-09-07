var loginEmail = document.getElementById('emailField')
var loginPassword = document.getElementById('passwordField')
var loginBtn = document.querySelector('.loginBtn')

import { auth, app, getAuth, signInWithEmailAndPassword} from './firebaseconfig.js'


var overlay = document.querySelector('.overlay')
var createBtn = document.querySelector('.createBtn')
var hidden = document.querySelector('.hidden')


createBtn.addEventListener('click', createHandler)
loginBtn.addEventListener('click', loginHandler)


function createHandler() {
    window.location.href = './signUpPage/index.html';
}

async function loginHandler () {
    signInWithEmailAndPassword(auth, loginEmail.value, loginPassword.value)
    .then((userCredential) => {
      const user = userCredential.user;
      console.log(user)
      if(user){
        window.location.href = '../landingpage/index.html'
      }
    })
    .catch((error) => {
      const errorMessage = error.message;
      console.log(errorMessage);
      alert(error);
    });
}



