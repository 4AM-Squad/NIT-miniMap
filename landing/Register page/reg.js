import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";

const firebaseConfig = {
  apiKey: "AIzaSyAFVePIVi82ZoIcPBA7FstcTFTyzVH4Zjc",
  authDomain: "minimap-9a0ff.firebaseapp.com",
  databaseURL: "https://minimap-9a0ff-default-rtdb.firebaseio.com",
  projectId: "minimap-9a0ff",
  storageBucket: "minimap-9a0ff.appspot.com",
  messagingSenderId: "415178231023",
  appId: "1:415178231023:web:1fc83c03ed7a7430579f1a",
  measurementId: "G-0LX8D9QY03",
};

const app = initializeApp(firebaseConfig);

import {
  getDatabase,
  set,
  get,
  update,
  child,
  ref,
  remove,
} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const db = getDatabase();

var namebox = document.getElementById("name");
var rollbox = document.getElementById("Roll");
var passbox = document.getElementById("pass");
var branchbox = document.getElementById("branch_select");
var subbox = document.getElementById("sub_select");

var insertbtn = document.getElementById("signUp");

function validatePassword() {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return re.test(passbox.value);
}

function InsertData() {
  const dbref = ref(db);

  get(child(dbref, "roll_no/" + rollbox.value)).then((snapshot) => {
    
    if (!validatePassword()) {
      alert("Password is invalid ( must have at least one letter , number and special character with length in 6 to 16)");
      return;
    }
    
    if (snapshot.exists()) {
      alert("Account already exists");
    } else {
      set(
        ref(db, "roll_no/" + rollbox.value),
        {
          Name: namebox.value,
          RollNo: rollbox.value,
          Branch: branchbox.value,
          Subsection: subbox.value,
          Password: passbox.value,
        },
        alert("Successfully added")
      )
        .then(()=>{
        	window.location.href = '../student/student.html';
        })
        .catch((error) => {
          alert("Unsucessfullly");
        });

        RetrieveData();
    }
  });
}

function RetrieveData() {
  const dbref = ref(db);

  get(child(dbref, "roll_no/" + rollbox.value))
    .then((snapshot) => {
      if (snapshot.exists()) {
        // console.log(snapshot.val()); 
        localStorage.setItem('user', JSON.stringify(snapshot.val()));
      } else {
        alert("No data found");
      }
    })
    .catch((error) => {
      alert("unsuccessful" + error);
    });
}

insertbtn.addEventListener("click", (event) => {
  event.preventDefault();
  InsertData();
  
});