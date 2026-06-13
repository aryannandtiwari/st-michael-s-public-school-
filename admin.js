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
deleteDoc,
doc,
getDoc,
setDoc,
onSnapshot,
updateDoc
}
from
"https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js";


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


// =========================
// MAINTENANCE MODE
// =========================

const maintenanceToggle =
document.getElementById(
"maintenanceToggle"
);

async function loadMaintenance(){

try{

const snap =
await getDoc(
doc(
db,
"settings",
"website"
)
);

if(
snap.exists()
){

maintenanceToggle.checked =
snap.data().maintenance || false;

}

}
catch(error){

console.error(error);

}

}

loadMaintenance();

if(maintenanceToggle){

maintenanceToggle.addEventListener(
"change",
async()=>{

try{

await setDoc(
doc(
db,
"settings",
"website"
),
{
maintenance:
maintenanceToggle.checked
}
);

alert(
"Website status updated."
);

}
catch(error){

console.error(error);

alert(
"Failed to update."
);

}

});

}


// =========================
// ADD NOTICE
// =========================

const addNoticeBtn =
document.getElementById(
"addNoticeBtn"
);

if(addNoticeBtn){

addNoticeBtn.addEventListener(
"click",
async()=>{

const title =
document.getElementById(
"noticeTitle"
).value;

const content =
document.getElementById(
"noticeContent"
).value;

if(
!title ||
!content
){

alert(
"Please fill all fields."
);

return;

}

try{

await addDoc(
collection(
db,
"notices"
),
{
title,
content,
createdAt:
Date.now()
}
);

alert(
"Notice Published Successfully"
);

document.getElementById(
"noticeTitle"
).value = "";

document.getElementById(
"noticeContent"
).value = "";

}
catch(error){

console.error(error);

alert(
"Failed to publish notice."
);

}

});

}


// =========================
// LOAD NOTICES
// =========================

const adminNotices =
document.getElementById(
"adminNotices"
);

if(adminNotices){

onSnapshot(
collection(
db,
"notices"
),
(snapshot)=>{

adminNotices.innerHTML = "";

snapshot.forEach(
(docSnap)=>{

const data =
docSnap.data();

adminNotices.innerHTML += `

<div class="contact-card">

<h3>
${data.title}
</h3>

<p>
${data.content}
</p>

<button
class="btn deleteNotice"
data-id="${docSnap.id}">

Delete

</button>

</div>

`;

});

});

}
// =========================
// DELETE NOTICE
// =========================

document.addEventListener(
"click",
async(e)=>{

if(
e.target.classList.contains(
"deleteNotice"
)
){

const id =
e.target.dataset.id;

if(
!confirm(
"Delete this notice?"
)
) return;

try{

await deleteDoc(
doc(
db,
"notices",
id
)
);

alert(
"Notice deleted."
);

}
catch(error){

console.error(error);

alert(
"Failed to delete notice."
);

}

}

});


// =========================
// LOAD REVIEWS
// =========================

const reviewsList =
document.getElementById(
"reviewsList"
);

const approvedReviewsList =
document.getElementById(
"approvedReviewsList"
);

onSnapshot(
collection(
db,
"reviews"
),
(snapshot)=>{

if(reviewsList)
reviewsList.innerHTML = "";

if(approvedReviewsList)
approvedReviewsList.innerHTML = "";

snapshot.forEach(
(docSnap)=>{

const data =
docSnap.data();

const reviewHTML = `

<div class="contact-card">

<h3>
${data.name || "Parent"}
</h3>

<p>
<strong>
${data.role || ""}
</strong>
</p>

<p>
${data.review || ""}
</p>

${
!data.approved
?
`<button
class="btn approveReview"
data-id="${docSnap.id}">
Approve
</button>`
:
""
}

<button
class="btn deleteReview"
data-id="${docSnap.id}">
Delete
</button>

</div>

`;

if(data.approved){

if(approvedReviewsList){

approvedReviewsList.innerHTML +=
reviewHTML;

}

}
else{

if(reviewsList){

reviewsList.innerHTML +=
reviewHTML;

}

}

});

});


// =========================
// APPROVE REVIEW
// =========================

document.addEventListener(
"click",
async(e)=>{

if(
e.target.classList.contains(
"approveReview"
)
){

const id =
e.target.dataset.id;

try{

await updateDoc(
doc(
db,
"reviews",
id
),
{
approved:true
}
);

alert(
"Review Approved"
);

}
catch(error){

console.error(error);

alert(
"Failed to approve review."
);

}

}

});


// =========================
// DELETE REVIEW
// =========================

document.addEventListener(
"click",
async(e)=>{

if(
e.target.classList.contains(
"deleteReview"
)
){

const id =
e.target.dataset.id;

if(
!confirm(
"Delete this review?"
)
) return;

try{

await deleteDoc(
doc(
db,
"reviews",
id
)
);

alert(
"Review Deleted"
);

}
catch(error){

console.error(error);

alert(
"Failed to delete review."
);

}

}

});


// =========================
// DASHBOARD READY
// =========================

console.log(
"Admin Dashboard Loaded Successfully"
);
