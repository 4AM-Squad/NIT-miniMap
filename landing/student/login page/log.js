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

var rollbox = document.getElementById("roll");
var passbox = document.getElementById("pas");

var btn = document.getElementById("log");

function login() {
  const dbref = ref(db);

  get(child(dbref, "roll_no/" + rollbox.value))
    .then((snapshot) => {
      if (!snapshot.exists()) {
        alert("Pls register");
      } else {
        if (rollbox.value == snapshot.val().RollNo) {
          if (passbox.value == snapshot.val().Password) {
            localStorage.setItem('role', 'student')
            localStorage.setItem('user', JSON.stringify(snapshot.val()));
            window.location.href = '../student.html';
          } else {
            alert("Enter correct password!");
          }
        } else {
          alert("Roll no is incorrect");
        }
      }
    })
    .catch((error) => {
      alert("unsuccessful" + error);
    });
}

btn.addEventListener("click", (event) => {
  event.preventDefault();
  login();
});