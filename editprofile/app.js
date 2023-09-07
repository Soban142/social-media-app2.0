const firstName = document.getElementById('fname');
const lastName = document.getElementById('lname');
const phnNum = document.getElementById('phNum');
const profilePicPath = document.getElementById('myfile');
const editBtn = document.querySelector('.editBtn');
const userInfo = document.getElementById('userDescription')

let currentLoggedInUser;

import { storage, ref, uploadBytesResumable, getDownloadURL, onAuthStateChanged, auth, db, doc, getDoc, setDoc, updateDoc   } from "../firebaseconfig.js";



onAuthStateChanged(auth, (user) => {
    if (user) {
      const uid = user.uid;
      fetchingUserData(uid);
      currentLoggedInUser = uid;
    } else {
      // User is signed out
      // ...
      window.location.href = '../loginpage/index.html'
    }
  });


async function fetchingUserData(userId) {
   try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            let  {firstName: fname, dob, gender, surName, phoneNum, userDescription} = docSnap.data();
            console.log(fname, dob, surName, gender, phoneNum);

            firstName.value = fname;
            // gender.value = gender;
            lastName.value = surName;
            phnNum.value = phoneNum;
            userInfo.value = userDescription || '' 
        } else {
            console.log("No such document!");
        }
   } catch (error) {
        alert(error);
   } 
    
}



let editHandler = function  () {
    
    console.log(firstName.value, lastName.value, phnNum.value, profilePicPath.files[0])
    // import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

    const file = profilePicPath.files[0];

    // const storage = getStorage();
    const storageRef = ref(storage, 'images/rivers.jpg');
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed', 
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
          console.log('File available at', downloadURL);
          try {
            // await setDoc(doc(db, "users", currentLoggedInUser), {
            //   firstName: firstName.value,
            //   lastName: lastName.value,
            //   phoneNum: phoneNum.value,
              
            // });
            const washingtonRef = await updateDoc(doc(db, "users", currentLoggedInUser), {
                firstName: firstName.value,
                surName: lastName.value,
                phoneNum: phnNum.value,
                profilePic: downloadURL,
                userDescription: userInfo.value
            });

            alert('Profile updated!');

          } catch (error) {
                alert(error)
          }
        });
      }
    );
    
}

editBtn.addEventListener('click', editHandler);


