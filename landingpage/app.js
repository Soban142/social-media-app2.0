import { getAuth, getFirestore, auth, db, doc, getDoc, onAuthStateChanged, signOut, setDoc, addDoc, collection, query, getDocs, ref, uploadBytesResumable, getDownloadURL, storage, updateDoc, deleteDoc, serverTimestamp, orderBy } from "../firebaseconfig.js";

const userName = document.getElementById('userName');
const userEmail = document.getElementById('userEmail');
const phnNum = document.getElementById('userContactNo');
const userGender = document.getElementById('userGender');
const userDescription = document.getElementById('userDescription');
const userImage = document.getElementById('userImage');
const logOutBtn = document.querySelector('.logoutBtn');
const myProfile = document.querySelector('.myProfile');
const userPostingImg = document.querySelector('.userPostingImg')
const toggleBtn = document.querySelector('.toggle-btn')
const editProfile = document.querySelector('.editProfile')
const profileBtns = document.querySelector('.profileBtns')

// Getting elements for creation of a post.
const hidden = document.querySelector('.hidden');
const overlay = document.querySelector('.overlay')
const creationOfPost =  document.querySelector('.postField');
const postDescription = document.querySelector('.postCaption');
const uploadPostImg = document.querySelector('#uploadPostImg')
const postBtn = document.querySelector('.postBtn');
const postBox = document.querySelector('.postBox');
const postDiv = document.querySelector('.postDiv');

console.log(serverTimestamp, "==>>>serverTimestamp")

let currentUser;

addPostData()

let postIdUniversal;

onAuthStateChanged(auth, (user) => {
        if (user) {
            const uniqueIdOfCurrentData = user.uid;
            addUserData(uniqueIdOfCurrentData);
            currentUser = uniqueIdOfCurrentData;
        } else {
            window.location.href = '../index.html'
        }
    });


    async function addUserData(uid) {
        try{
            const docRef = await doc(db, "users", uid);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                console.log("Document data:", docSnap.data());
                const userData = docSnap.data();

                let {dob, email, firstName, gender, surName, phoneNum, profilePic} = docSnap.data();
                console.log(surName)
                userName.textContent = `${firstName} ${surName}`;
                userEmail.textContent = email;
                phnNum.textContent = phoneNum;
                userImage.src = `${profilePic || '../assests/avatarDummy.png'}`,
                userDescription.textContent = userData.userDescription || "No description added";
                userGender.textContent = gender;
                userPostingImg.src = `${profilePic || '../assests/avatarDummy.png'}`

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

        // postDescription.disabled = true;
        postDescription.focus()
    } 



async function postHandler() {
    postBox.classList.add('hidden');
    overlay.classList.add('hidden');

    
    /** @type {any} */
    const metadata = {
        contentType: 'image/jpeg'
    };

    const file = uploadPostImg.files[0];
    console.log(file)

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
                     postImage : downloadURL,
                     postTime: serverTimestamp()
            });
                 addPostData(currentUser)

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
          break;
        case 'storage/canceled':
          break;
  
        case 'storage/unknown':
          break;
      }
    }, 
    () => {
      getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
        console.log('File available at', downloadURL);
        const washingtonRef = doc(db, "posts", postIdUniversal);
        try {
            await updateDoc(washingtonRef, {
                postCaption: postDescription.value,
                authorId : currentUser,
                postImage : downloadURL,
                postTime: serverTimestamp()
            });
            addPostData();
        } catch (error) {
            console.log(error)
        }
      });
    }
  );
    postBtn.removeEventListener('click', updatePostHandler)
    postBtn.addEventListener('click', postHandler)
}

// Edit function

function editHandler(postId) {
    postCreator();

    postIdUniversal = postId

    postBtn.removeEventListener('click', postHandler)
    postBtn.addEventListener('click', updatePostHandler)
}

//Delete function

async function deleteHandler(postId) {
    console.log(postId, "delete button working properly")

    await deleteDoc(doc(db, "posts", postId));
    alert("Your post deleted successfully")
    addPostData();
}




async function addPostData(userId) {

    postDiv.innerHTML = ''

    const q = query(collection(db, "posts"), orderBy("postTime", "desc"));
    const querySnapshot = await getDocs(q);
    // const querySnapshot = await getDocs(collection(db, "posts"));

    querySnapshot.forEach(async (doc) => {
        // console.log(doc.data().authorId)
        // console.log(doc.id, '===>', doc.data());
        // let postTime = new Date().getTime();
        let {authorId, postCaption, postImage, postTime} = doc.data();
        const authorDetails = await getAuthorData(authorId);

        var postContent = 
        `<div class="post">
            <div class="authorDetails">
                <div class="postUpperDiv">
                    <div>
                        <img src="${authorDetails.profilePic || '../assests/avatarDummy.png'}" alt="" class="userPostImg">
                    </div>
                    <div>
                        <div class="postData postUserName">${authorDetails?.firstName} ${authorDetails?.surName}</div>
                        <div class="postData postUserDesc">${authorDetails.userDescription || "No description added"}</div>
                        <div class="postData postTime">${new Date(postTime.seconds * 1000)}</div>
                    </div>
                </div>${authorId === currentUser ? `<div class="dropdown">
                <button class="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                    :
                </button>
                <ul class="dropdown-menu">
                    <div>
                        <li><button class="dropdown-item" type="button" onClick="editHandler('${doc.id}')">Edit</button></li>
                        <li><button class="dropdown-item" type="button" onClick="deleteHandler('${doc.id}')">Delete </button></li>
                    </div>
                </ul>
            </div>` : ''}        
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

logOutBtn.addEventListener('click', logoutHandler)

function logoutHandler() {
    signOut(auth).then(() => {
        console.log(`Sign-out successful`)
        window.location.href = "../index.html"
    }).catch((error) => {
        console.error(error)
    });
}


window.editHandler = editHandler;
window.deleteHandler = deleteHandler;



