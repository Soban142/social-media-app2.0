import { onAuthStateChanged, auth, db, getDoc, getDocs, collection, doc, updateDoc  } from '../firebaseconfig.js'

let currentUser;


onAuthStateChanged(auth, (user) => {
  if (user) {
      const uniqueIdOfCurrentData = user.uid;
      addUserData(uniqueIdOfCurrentData);
      currentUser = uniqueIdOfCurrentData;
  } else {
      window.location.href = '../loginpage/index.html'
  }
})

const userArea = document.querySelector('.usersArea')

async function addUserData(uniqueIdOfCurrentData){
  try {
      const querySnapshot = await getDocs(collection(db, "users"));
      querySnapshot.forEach((doc) => {
      
        console.log(doc.id, " => ", doc.data());
        const {firstName, surName, gender, email, userDescription, profilePic, followers} = doc.data();
        console.log(followers)
      
        const users = ` 
          <div class="sideBar">
                <div><img src="${profilePic || '../assests/avatarDummy.png'}" alt="" class="userPostImg"></div>
                <div id="userName" class="personData">${firstName} ${surName}</div>
                <div id="userEmail" class="personData">${email}</div>
                <div id="userGender" class="personData">${gender}</div>
                <div id="userDescription" class="personData">${userDescription}</div>
                ${
                  currentUser !== doc.id ? `<div><button class="un-followBtn" onClick='followHandler("${doc.id}", "${followers}")'>${followers !== undefined ? followers.includes(currentUser) ? 'UnFollow' : 'Follow' : 'Follow'}</button></div>` : ''
                }
          </div>`
      
          var div = document.createElement('div')
          div.innerHTML = users;
          userArea.appendChild(div)
      });
  } catch (error) {
    console.log(error)
  }
  
}

async function followHandler (followedId) {
  console.log(followedId)
  try {
    
    const docRef = doc(db, "users", followedId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      console.log("Document data:", docSnap.data().followers);
      const {followers} = docSnap.data()
      let userFollowers = followers !== undefined ? followers : [];
      console.log(userFollowers)
      if(followers !== undefined && followers.length !== 0){
        if(followers.includes(currentUser)){
          console.log('unfollow handler')
          let followerIndex = followers.indexOf(currentUser);
          let splicedArray = followers.splice(followerIndex, 1);
          userFollowers = followers;
          console.log(userFollowers)
            try {
              const washingtonRef = doc(db, "users", followedId);
              await updateDoc(washingtonRef, {
              followers: userFollowers
            }); 
          } catch (error) {
              console.log(error)
          }
        } else {
          console.log('follow handler')
            userFollowers.push(currentUser);
            console.log(userFollowers)
  
              try {
                const washingtonRef = doc(db, "users", followedId);
                await updateDoc(washingtonRef, {
                followers: userFollowers 
              }); 
            } catch (error) {
                console.log(error)
              }
          }
      }  else {
        console.log('follow handler')
          userFollowers.push(currentUser);
          console.log(userFollowers)

            try {
              const washingtonRef = doc(db, "users", followedId);
              await updateDoc(washingtonRef, {
              followers: userFollowers 
            }); 
          } catch (error) {
              console.log(error)
            }
        }
    } else {
      console.log("No such document!");
    }

  } catch (error) {
    console.log(error)
  }
}

window.followHandler = followHandler




let array = ['adsdawdawesadw']

let spliced = array.splice(0, 1)
let splicedArray = array
console.log(splicedArray)
