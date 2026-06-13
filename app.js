// =========================
// FIREBASE IMPORTS
// =========================

import {
initializeApp
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js";

import {
getFirestore,
collection,
addDoc,
getDocs,
query,
where,
onSnapshot,
doc,
getDoc
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";

import {
getAuth,
signInWithEmailAndPassword
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-auth.js";


// =========================
// FIREBASE CONFIG
// =========================

const firebaseConfig = {

apiKey:
"AIzaSyAUAeUvu6M1u8gKfrLnjI8Yrup27U0D5xw",

authDomain:
"st-michael-public-school-45c59.firebaseapp.com",

projectId:
"st-michael-public-school-45c59",

storageBucket:
"st-michael-public-school-45c59.firebasestorage.app",

messagingSenderId:
"540750803774",

appId:
"1:540750803774:web:9f1149236f631ef81af26f"

};


// =========================
// INITIALIZE FIREBASE
// =========================

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

window.db = db;
window.auth = auth;

console.log(
"Firebase Connected Successfully"
);


// =========================
// MENU TOGGLE
// =========================

const menuBtn =
document.getElementById(
"menuBtn"
);

const menuDropdown =
document.getElementById(
"menuDropdown"
);

if(menuBtn){

menuBtn.addEventListener(
"click",
()=>{

if(
menuDropdown.style.display ===
"block"
){

menuDropdown.style.display =
"none";

}
else{

menuDropdown.style.display =
"block";

}

});

}


// =========================
// LOGIN MODAL
// =========================

const loginModal =
document.getElementById(
"loginModal"
);

const adminMenu =
document.getElementById(
"adminMenu"
);

if(adminMenu){

adminMenu.addEventListener(
"click",
(e)=>{

e.preventDefault();

loginModal.style.display =
"flex";

});

}

window.closeLoginModal =
function(){

loginModal.style.display =
"none";

};
// =========================
// LOAD NOTICES
// =========================

const noticeContainer =
document.getElementById(
"noticeContainer"
);

if(noticeContainer){

onSnapshot(
collection(
db,
"notices"
),
(snapshot)=>{

noticeContainer.innerHTML = "";

if(snapshot.empty){

noticeContainer.innerHTML =

`<div class="contact-card">

<h3>
No Notices Available
</h3>

</div>`;

return;

}

snapshot.forEach(
(docSnap)=>{

const data =
docSnap.data();

noticeContainer.innerHTML +=

`<div class="contact-card notice-card">

<h3>
${data.title || "Notice"}
</h3>

<p>
${data.content || ""}
</p>

</div>`;

});

});

}


// =========================
// REVIEW SUBMISSION
// =========================

const reviewForm =
document.getElementById(
"reviewFormElement"
);

if(reviewForm){

reviewForm.addEventListener(
"submit",
async(e)=>{

e.preventDefault();

const name =
document.getElementById(
"reviewName"
).value;

const role =
document.getElementById(
"reviewRole"
).value;

const review =
document.getElementById(
"reviewText"
).value;

try{

await addDoc(
collection(
db,
"reviews"
),
{
name:name,
role:role,
review:review,
approved:false,
createdAt:
Date.now()
}
);

alert(
"Review submitted successfully."
);

reviewForm.reset();

}
catch(error){

console.error(error);

alert(
"Failed to submit review."
);

}

});

}


// =========================
// ADMIN LOGIN
// =========================

const loginBtn =
document.getElementById(
"loginBtn"
);

if(loginBtn){

loginBtn.addEventListener(
"click",
async()=>{

const email =
document.getElementById(
"adminEmail"
).value;

const password =
document.getElementById(
"adminPassword"
).value;

try{

await signInWithEmailAndPassword(
auth,
email,
password
);

window.location.href =
"admin.html";

}
catch(error){

console.error(error);

alert(
"Invalid Email or Password"
);

}

});

}


// =========================
// MAINTENANCE MODE
// =========================

async function checkMaintenance(){

const banner =
document.getElementById(
"maintenanceBanner"
);

if(!banner) return;

try{

const snap =
await getDoc(
doc(
db,
"settings",
"website"
)
);

if(!snap.exists())
return;

const data =
snap.data();

if(
data.maintenance === true
){

banner.style.display =
"block";

}
else{

banner.style.display =
"none";

}

}
catch(error){

console.error(error);

}

}

checkMaintenance();


// =========================
// CLOSE MENU ON CLICK
// =========================

document.addEventListener(
"click",
(e)=>{

if(
menuDropdown &&
!menuDropdown.contains(
e.target
) &&
e.target !== menuBtn
){

menuDropdown.style.display =
"none";

}

});


// =========================
// PAGE LOADED
// =========================

console.log(
"St. Michael's Public School Loaded Successfully"
);
