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

let clubname = document.getElementById('clubname');
let logout = document.getElementById('logout');
let addmembtn = document.getElementById('addmembtn')
let searchmembtn = document.getElementById('searchmembtn')
let inpmemTask = document.getElementById('inpmemTask')
let list = document.getElementsByClassName('list')[0]

let us = JSON.parse(localStorage.clubuser);
clubname.innerHTML = us.name.replaceAll('_', ' ');

logout.addEventListener('click', () => {
	localStorage.clear();
	window.location.href = '../landing.html';
});

addmembtn.addEventListener('click', () => {
	RetrieveData()
})

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

let user;
let club = JSON.parse(localStorage.clubuser)
let rolls = club.roll_no
console.log(rolls)

function RetrieveData() {
	const dbref = ref(db);

	get(child(dbref, "roll_no/" + inpmemTask.value))
		.then((snapshot) => {
			let flag = true
			rolls.forEach(r => {
				if (r[0].RollNo == inpmemTask.value)
					flag = false
			})
			if (flag) {
				if (snapshot.exists()) {
					user = snapshot.val();
					console.log(user)
					list.innerHTML += `
					<div class="meeting">
					<div class="memberroll">${user.RollNo}</div>
					<div class="membername">${user.Name}</div>
					<div class="memberclass">${user.Branch} - ${user.Subsection}</div>
					</div>
					`
				} else {
					list.innerHTML += `
					<div class="meeting">
					<div class="memberroll">${inpmemTask.value}</div>
					<div class="membername">- - -</div>
					<div class="memberclass">- - -</div>
					</div>
                	`
				}
				club.roll_no.push(user)
				changedb(club)
			}
			else{
				alert("Member already exists")
			}
		})
		.catch((error) => {
			alert("unsuccessful " + error);
		});
}

async function changedb(clb) {
	await fetch(`http://localhost:3000/clubdb/addRollNo`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(clb)
	})
	.then(response => response.json())
	.then(data => {
		console.log(data)
		localStorage.removeItem('clubuser');
		localStorage.setItem('clubuser', JSON.stringify(data))
	})
}

searchmembtn.addEventListener('click', () => {
	let mem = inpmemTask.value
	inpmemTask.value = ''
	let i=0;
	if(rolls){
		for(i=0; i<rolls.length; i++){
			if(rolls[i][i]){
				if(mem == rolls[i][i].RollNo){
					let user = rolls[i][i]
					list.innerHTML = `
					<div class="meeting">
					<div class="memberroll">${user.RollNo}</div>
					<div class="membername">${user.Name}</div>
					<div class="memberclass">${user.Branch} - ${user.Subsection}</div>
					</div>
					`
					break;
				}
			}
		}
		if(i==rolls.length)
			alert(`Member doesn't exist`)
	}
	else
		alert(`Member doesn't exist`)
})