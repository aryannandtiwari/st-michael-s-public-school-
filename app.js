// ===================================
// FIREBASE IMPORTS
// ===================================

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

// ===================================
// FIREBASE CONFIG
// ===================================

const firebaseConfig = {

apiKey:"AIzaSyAUAeUvu6M1u8gKfrLnjI8Yrup27U0D5xw",

authDomain:"st-michael-public-school-45c59.firebaseapp.com",

projectId:"st-michael-public-school-45c59",

storageBucket:"st-michael-public-school-45c59.firebasestorage.app",

messagingSenderId:"540750803774",

appId:"1:540750803774:web:9f1149236f631ef81af26f"

};

// ===================================
// INITIALIZE
// ===================================

const app =
initializeApp(firebaseConfig);

const db =
getFirestore(app);

const auth =
getAuth(app);

window.db = db;
window.auth = auth;

console.log("Firebase Connected");

// ===================================
// MENU
// ===================================

const menuBtn =
document.getElementById("menuBtn");

const menuDropdown =
document.getElementById("menuDropdown");

if(menuBtn){

menuBtn.addEventListener("click",()=>{

if(menuDropdown.style.display==="block"){

menuDropdown.style.display="none";

}else{

menuDropdown.style.display="block";

}

});

}

// ===================================
// CLOSE MENU OUTSIDE CLICK
// ===================================

document.addEventListener("click",(e)=>{

if(
menuDropdown &&
!menuDropdown.contains(e.target) &&
e.target !== menuBtn
){

menuDropdown.style.display="none";

}

});

// ===================================
// ADMIN LOGIN
// ===================================

const loginBtn =
document.getElementById("loginBtn");

if(loginBtn){

loginBtn.addEventListener(
"click",
async()=>{

const email =
document.getElementById("adminEmail").value;

const password =
document.getElementById("adminPassword").value;

if(!email || !password){

alert("Enter Email & Password");
return;

}

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

alert("Invalid Login");

}

});

}
// ===================================
// LOAD NOTICES
// ===================================

const noticeContainer =
document.getElementById(
"noticeContainer"
);

if(noticeContainer){

onSnapshot(
collection(db,"notices"),

(snapshot)=>{

noticeContainer.innerHTML="";

if(snapshot.empty){

noticeContainer.innerHTML=`

<div class="notice-box">

<h3>
No Notices Available
</h3>

</div>

`;

return;

}

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

noticeContainer.innerHTML += `

<div class="notice-box">

<h3>
${data.title || "Notice"}
</h3>

<p>
${data.content || ""}
</p>

<div class="notice-sign">
By M.N. Tiwari
</div>

</div>

`;

});

});

}

// ===================================
// MAINTENANCE MODE
//  ===================================


async function checkMaintenance(){

const banner =
document.getElementById(
"maintenanceBanner"
);

try{

const snap =
await getDoc(
doc(
db,
"settings",
"website"
)
);

if(!snap.exists()) return;

const data =
snap.data();

if(data.maintenance){

document.body.innerHTML = `
<div class="maintenance-page">

    <h1>⚠ Website Under Maintenance</h1>

    <h2>St. Michael's Public School</h2>

    <p>
        We are currently improving our website to provide a better experience
        for students, parents and visitors.
    </p>

    <p>
        Thank you for your patience and support.
        We will be back online shortly.
    </p>

    <div class="contact-box">
        📞 +91 9835172689<br>
        ✉ director.stmichael@gmail.com
    </div>

    <div class="bottom-message">
        St. Michael's Public School, School Road, Thakurgaon, Ranchi, Jharkhand.
        <br>
        Committed to Excellence, Discipline and Character.
    </div>

</div>
`;

return;

}

if(banner){
banner.style.display = "none";
}

}
catch(error){

console.error(error);

}

}

checkMaintenance();


// ===================================
// REVIEW SUBMISSION
// ===================================

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
collection(db,"reviews"),
{
name:name,
role:role,
review:review,
approved:false,
createdAt:Date.now()
}
);

alert(
"Review Submitted Successfully"
);

reviewForm.reset();

}
catch(error){

console.error(error);

alert(
"Failed To Submit Review"
);

}

});

}

// ===================================
// APPROVED REVIEWS
// ===================================

const reviewsContainer =
document.getElementById(
"reviewsContainer"
);

if(reviewsContainer){

const q =
query(
collection(db,"reviews"),
where("approved","==",true)
);

onSnapshot(q,(snapshot)=>{

reviewsContainer.innerHTML="";

snapshot.forEach((docSnap)=>{

const data =
docSnap.data();

reviewsContainer.innerHTML += `

<div class="review-card">

<h4>
${data.name}
</h4>

<p>
${data.role}
</p>

<p>
${data.review}
</p>

</div>

`;

});

});

}

// ===================================
// PAGE READY
// ===================================

console.log(
"St. Michael's Public School Loaded Successfully"
);
