var userName = document.getElementById('userName');
var userEmail = document.getElementById('userEmail');
const phnNum = document.getElementById('userContactNo');
var userGender = document.getElementById('userGender');
var userDescription = document.getElementById('userDescription');
var logOutBtn = document.querySelector('.logoutBtn');
var myProfile = document.querySelector('.myProfile');

// Getting elements for creation of a post.
var hidden = document.querySelector('.hidden');
const overlay = document.querySelector('.overlay')
var creationOfPost =  document.querySelector('.postField');
var postDescription = document.querySelector('.postCaption');
const uploadPostImg = document.querySelector('#uploadPostImg');
const postBtn = document.querySelector('.postBtn');
const postBox = document.querySelector('.postBox');
const postDiv = document.querySelector('.postDiv');


import { getAuth, getFirestore, signOut, auth, db, doc, getDoc, onAuthStateChanged, setDoc, addDoc, collection, query, getDocs, where, ref, uploadBytesResumable, getDownloadURL, storage, updateDoc, deleteDoc  } from "../firebaseconfig.js";


let currentUser;
let postIdUniversal;

onAuthStateChanged(auth, (user) => {
    if (user) {
      const uniqueIdOfCurrentData = user.uid;
        addUserData(uniqueIdOfCurrentData);
        currentUser = uniqueIdOfCurrentData;
        addPostData(uniqueIdOfCurrentData);
    } else {
        window.location.href = '../loginpage/index.html'
    }
  });

  

async function addUserData(uid) {
    try{
        const docRef = await doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            const userData = docSnap.data();

            let {dob, email, firstName, gender, surName, phoneNum} = docSnap.data();

            userName.textContent = `${firstName} ${surName}`
            userEmail.textContent = email;
            phnNum.textContent = phoneNum;
            userDescription.textContent = userData.userDescription || "No description added";
            userGender.textContent = gender;

        } else {
            console.log("No such document!");
        }
    } catch (error){
        console.log(error)
    }
}

creationOfPost.addEventListener('click', postCreator);
postBtn.addEventListener('click', postHandler)


overlay.addEventListener('click', () => {
    postBox.classList.add('hidden');
    overlay.classList.add('hidden');
})

function postCreator () {
    postBox.classList.remove('hidden');
    overlay.classList.remove('hidden');
} 

async function postHandler() {
    postBox.classList.add('hidden');
    overlay.classList.add('hidden');



// const storage = getStorage();

// Create the file metadata
/** @type {any} */
const metadata = {
    contentType: 'image/jpeg'
};

const file = uploadPostImg.files[0];

// Upload file and metadata to the object 'images/mountains.jpg'
const storageRef = ref(storage, 'images/' + file.name);
const uploadTask = uploadBytesResumable(storageRef, file, metadata);

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
    
    switch (error.code) {
    case 'storage/unauthorized':
        // User doesn't have permission to access the object
        break;
    case 'storage/canceled':
        // User canceled the upload
        break;

    // ...

    case 'storage/unknown':
        // Unknown error occurred, inspect error.serverResponse
        break;
    }
}, 
() => {
    getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
    console.log('File available at', downloadURL);
        try {
             const docRef = await addDoc(collection(db, "posts"), {
                 postCaption: postDescription.value,
                 authorId : currentUser,
                 postImage : downloadURL
        });
             addPostData(currentUser)

            console.log("Document written with ID: ", docRef.id);
      } catch (e) {
            console.error("Error adding document: ", e);
      }
    });
}
);


}


async function updatePostHandler() {

    postBox.classList.add('hidden');
    overlay.classList.add('hidden');

    // Create the file metadata
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };
  
    const file = uploadPostImg.files[0];
  // Upload file and metadata to the object 'images/mountains.jpg'
    const storageRef = ref(storage, 'images/' + file.name);
    const uploadTask = uploadBytesResumable(storageRef, file, metadata);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
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
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log('File available at', downloadURL);
        const washingtonRef = doc(db, "posts", postIdUniversal);
        try {
            await updateDoc(washingtonRef, {
                postCaption: postDescription.value,
                authorId : currentUser,
                postImage : downloadURL
            });
            addPostData(currentUser);
        } catch (error) {
            console.log(error)
        }
      });
    }
  );
  
  postBtn.removeEventListener('click', updatePostHandler)
  postBtn.addEventListener('click', postHandler)

}


function editHandler(postId) {
    postCreator();
    console.log('edit handler working')
    console.log(postId)

    postIdUniversal = postId

    postBtn.removeEventListener('click', postHandler)
    postBtn.addEventListener('click', updatePostHandler)
}

async function deleteHandler(postId) {
    console.log(postId, "delete button working properly")

    await deleteDoc(doc(db, "posts", postId));
    alert("Your post deleted successfully")
    addPostData(currentUser);
}


async function addPostData(userId) {

    postDiv.innerHTML = ''
    const q = query(collection(db, "posts"), where ('authorId', "==", userId));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach( async (doc) => {
        
        let postTime = new Date().getTime()
        let {authorId, postCaption, postImage} = doc.data();
        console.log(doc.id)
        const authorDetails = await getAuthorData(authorId);

        var postContent = `<div class="post">
        <div class="authorDetails">
            <div class="postUpperDiv">
                <div>
                    <img src="${authorDetails.profilePic || '../assests/avatarDummy.png'}" alt="" class="userPostImg">
                </div>
                <div>
                    <div class="postData postUserName">${authorDetails?.firstName} ${authorDetails?.surName}</div>
                    <div class="postData postUserDesc">${authorDetails.userDescription || "No description added"}</div>
                    <div class="postData postTime">${postTime}</div>
                </div>
            </div>
            <div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    :
                </button>
                <ul class="dropdown-menu">
                    <div>
                        <li><button class="dropdown-item" type="button" onClick="editHandler('${doc.id}')">Edit</button></li>
                        <li><button class="dropdown-item" type="button" onClick="deleteHandler('${doc.id}')">Delete</button></li>
                    </div>
                </ul>
            </div>
        </div>
        <div class="postCaption">${postCaption}</div>
        <div>
            <img src="${postImage || '../assests/dummyPostImage.jpg'}" alt="" id="postImage">
        </div>
    </div>`;

        var postParent = document.createElement('div');
        postParent.innerHTML = postContent;

        postDiv.appendChild(postParent);
    });
}

async function getAuthorData(authorUId) {
    const docRef = doc(db, "users", authorUId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data();
    } else {
        console.log("No such document!");
    }
}



window.editHandler = editHandler;
window.deleteHandler = deleteHandler;






















































