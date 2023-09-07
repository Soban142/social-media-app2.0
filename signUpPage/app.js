var firstName = document.querySelector('#fname');
var surName = document.querySelector('#lname');
var signupEmail = document.querySelector('#email');
var phnNum = document.querySelector('#phoneNum');
var signUpPass = document.querySelector('#signUpPass');
var signUpBtn = document.querySelector('.signupBtn');
var hidden = document.querySelector('.hidden');

let dayValue;
let monthValue;
let yearValue;
let gender;

function getDayHandler(d){
  console.log(d)
  dayValue = d;
}
window.getDayHandler = getDayHandler;

function getMonthHandler(m){
  console.log(m)
  monthValue = m;
}
window.getMonthHandler = getMonthHandler;

function getYearHandler(y){
  console.log(y)
  yearValue = y;
}
window.getYearHandler = getYearHandler;

function getGenderHandler(gIdentity){
  console.log(gIdentity)
  gender = gIdentity;
}
window.getGenderHandler = getGenderHandler;


import { auth, app, db, getFirestore, collection, addDoc, setDoc, doc, getDoc, getAuth, createUserWithEmailAndPassword} from '../firebaseconfig.js'


signUpBtn.addEventListener('click', signUpHandler);

async function signUpHandler () {
  try {
      const userCredential = await createUserWithEmailAndPassword(auth, signupEmail.value, signUpPass.value);
      const user = await userCredential.user;
      console.log(user);

      if(userCredential.user){
        addUserData(user.uid);
      }
    }
  catch (error) {
    const errorCode = error.code;
    console.log(errorCode);
  }   
}

async function addUserData(uid) {
  try {
      const response = await setDoc(doc(db, "users", uid), {
        firstName: firstName.value,
        surName: surName.value,
        dob: `${dayValue} ${monthValue}, ${yearValue}`,
        email: signupEmail.value,
        phoneNum: phnNum.value,
        gender: gender
    });

    alert('User signed up successfully, diverting to login page')
    window.location.href = '../index.html';
  } catch (error) {
    console.log(error)
  }
    
}
