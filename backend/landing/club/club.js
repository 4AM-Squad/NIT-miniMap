let locations;
let loclist = document.getElementById('loclist');
function initMap() {
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 16,
		center: { lat: 29.946076, lng: 76.817682 },
		mapTypeId: 'satellite'
	});

	const image = {
		url: "marker.png",
		// This marker is 20 pixels wide by 32 pixels high.
		size: new google.maps.Size(20, 32),
		// The origin for this image is (0, 0).
		origin: new google.maps.Point(0, 0),
		// The anchor for this image is the base of the flagpole at (0, 32).
		anchor: new google.maps.Point(0, 32),
	};
	// Shapes define the clickable region of the icon. The type defines an HTML
	// <area> element 'poly' which traces out a polygon as a series of X,Y points.
	// The final coordinate closes the poly by connecting to the first coordinate.
	const shape = {
		coords: [1, 1, 1, 20, 18, 20, 18, 1],
		type: "poly",
	};

	fetch('./locations.json')
		.then(response => response.json())
		.then(data => {
			data.places.forEach(element => {
				loclist.innerHTML += `<li><a href="#" onclick="onClickHandler(this)">${element.name}</a></li>`;

				const marker = new google.maps.Marker({
					position: { lat: element.latitude, lng: element.longitude },
					map,
					icon: image,
					shape: shape,
					title: element.name,
					animation: google.maps.Animation.DROP
				});

				marker.addListener("click", (e) => {
					const contentString =
						'<div class="info-window-content">' +
						'<h2>' + element.name + '</h2>' +
						`<img src=${element.image} style="width:400px ;height:300px"/>` +
						'</div>';

					infoWindow.setContent(contentString);
					infoWindow.open({
						anchor: marker,
						map,
						shouldFocus: false,
					});
				});
			});
		});

	map.setOptions({ minZoom: 15 });

	infoWindow = new google.maps.InfoWindow({
		content: ""
	});
}

function onClickHandler(element) {
	let str = element.innerHTML;
	let obj;

	fetch('./locations.json')
		.then(response => response.json())
		.then(data => {
			obj = data.places.find(el => el.name == str);
			localStorage.setItem('targetLat', obj.latitude);
			localStorage.setItem('targetLng', obj.longitude);
			window.location.href = 'directions/directions.html'
		});
}

let memberArray = []
let meetArray = []
let club = JSON.parse(localStorage.clubuser)
let list = document.getElementsByClassName('list')[0]
let meets = club.meetings

async function getAllMems() {
	club = JSON.parse(localStorage.clubuser)
	memberArray = club.roll_no;
	list.innerHTML = '';
	await fetch(`http://localhost:3000/clubdb/${club.name}`)
		.then(res => res.json())
		.then(data => {
			data = data[0];
			memberArray = data.roll_no;
			memberArray.sort(function (a, b) {
				if (a.roll_no > b.roll_no) return 1;
				else return -1;
			})
			memberArray.forEach(elem => {

				list.innerHTML += `
					<div class="meeting">
						<div class="memberroll">${elem.roll_no}</div>
						<div class="membername">${elem.name}</div>
						<div class="memberclass">${elem.branch} - ${elem.subsection}</div>
						<div id="${elem.roll_no}">
							<button class="delete" onclick="removeClass(${elem.roll_no})">Remove</button>
						</div>
					</div>
				`
			})
		})
}

getAllMems();

let addmemheading = document.getElementById('addmemheading')
let loc_set = document.getElementById('loc_select')
let addmeetbtn = document.getElementById('addmeetbtn')
let addmembtn = document.getElementById('addmembtn')
let date = document.getElementById('date')
let agenda = document.getElementById('agenda')
let list1 = document.getElementsByClassName('list1')[0]


addmemheading.addEventListener('click', getAllMems)

// console.log('hello')
fetch('./locations.json')
	.then(response => response.json())
	.then(dt => {
		dt.places.forEach(e => {
			loc_set.innerHTML += `<option value="${e.name}">${e.name}</option>`
		})
	})

addmeetbtn.addEventListener('click', async () => {
	let meetdate = date.value.split('T')[0]
	let meettime = date.value.split('T')[1]
	let dd = meetdate.split('-')[2]
	let mm = meetdate.split('-')[1]
	let yy = meetdate.split('-')[0]
	list1.innerHTML += `
		<div class="meeting2">
			<div class="meetdetails">   
				<div class="datetime">${dd}-${mm}-${yy}</div>
				<div class="datetime2">${meettime}:00</div>
				<div class="membername">${loc_set.value}</div>
			</div>
			<div class="meetagenda">${agenda.value}</div>
		</div>
	`
	let meetobj = {
		date: meetdate,
		time: meettime,
		location: loc_set.value,
		agenda: agenda.value
	}

	club.meetings.push(meetobj)
	changedb(club)

	loc_set.value = ''
	date.value = ''
	agenda.value = ''
})

async function getAllMeets() {
	club = JSON.parse(localStorage.clubuser)
	list1.innerHTML = '';

	await fetch(`http://localhost:3000/clubdb/${club.name}`)
		.then(res => res.json())
		.then(data => {
			data = data[0];

			meetArray = data.meetings;
			// console.log(meetArray)
			meetArray.forEach(ele => {
				let meettime = ele.time
				let dd = ele.date.split('-')[2]
				let mm = ele.date.split('-')[1]
				let yy = ele.date.split('-')[0]
				list1.innerHTML += `
					<div class="meeting2">
						<div class="meetdetails">   
							<div class="datetime">${dd}-${mm}-${yy}</div>
							<div class="datetime2">${meettime}:00</div>
							<div class="membername">${ele.location}</div>
						</div>
						<div class="meetagenda">${ele.agenda}</div>
					</div>
				`
			})
		})
}

getAllMeets()

addmembtn.addEventListener('click', async () => {
	club = JSON.parse(localStorage.clubuser)
	list1.innerHTML = '';

	await fetch(`http://localhost:3000/clubdb/${club.name}`)
		.then(res => res.json())
		.then(async (data) => {
			data = data[0];
			let user = "";
			memberArray = data.roll_no;
			let flag = true, flag2 = true;
			memberArray.forEach(r => {
				if (r.roll_no == inpmemTask.value)
					flag = false
			})
			if (flag) {
				await fetch(`http://localhost:3000/studentdb/${inpmemTask.value}`)
					.then(response => response.json())
					.then(userdata => {
						if (userdata.length) {
							user = userdata[0];
							flag2 = false
						}
					})
				if (!flag2) {
					list.innerHTML += `
					<div class="meeting">
						<div class="memberroll">${user.roll_no}</div>
						<div class="membername">${user.name}</div>
						<div class="memberclass">${user.branch} - ${user.subsection}</div>
						<div id="${user.roll_no}">
							<button class="delete" onclick="removeClass(${user.roll_no})">Remove</button>
						</div>
					</div>
					`
					club.roll_no.push(user)
					changedb(club)

				} else {
					alert("User isn't registered");
				}
			}
			else {
				alert("Member already exists")
			}
		})
	inpmemTask.value = '';
})

searchmembtn.addEventListener('click', () => {
	let mem = inpmemTask.value
	inpmemTask.value = ''
	let i = 0;
	for (i = 0; i < memberArray.length; i++) {
		if (mem == memberArray[i].roll_no) {
			let user = memberArray[i]
			list.innerHTML = `
				<div class="meeting">
					<div class="memberroll">${user.roll_no}</div>
					<div class="membername">${user.name}</div>
					<div class="memberclass">${user.branch} - ${user.subsection}</div>
				</div>
			`
			break;
		}
	}
	if (i == memberArray.length)
		alert(`Member doesn't exist`)
})

async function changedb(clb) {
	await fetch(`http://localhost:3000/clubdb/${clb._id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(clb)
	})
		.then(response => response.json())
		.then(data => {
			console.log(data)
			// localStorage.removeItem('clubuser');
			localStorage.setItem('clubuser', JSON.stringify(data))
		})
}

let logout = document.getElementById('logout');
logout.addEventListener('click', () => {
	localStorage.clear();
	window.location.href = '../landing.html';
});

let clubname = document.getElementById('clubname');
clubname.innerHTML = club.name.replaceAll('_', ' ');

async function cancelbtn(elem) {
	let canl = document.getElementById(elem);
	canl.innerHTML = `<button class="delete" onclick="removeClass(${elem})">Remove</button>`
}
async function removeClass(element) {
	element = "" + element;
	let del1 = document.getElementById(element);
	del1.innerHTML =
	`
		<button class="cdelete" onclick="removeMem(${element})">Confirm Remove</button>
		<button class="cancel" onclick="cancelbtn(${element})">Cancel</button>
	`
}

async function removeMem(roll){
	for(let i=0; i<memberArray.length; i++){
		if(memberArray[i].roll_no==roll){
			memberArray.splice(i, 1);
			break;
		}
	}
	club = JSON.parse(localStorage.getItem('clubuser'));
	club.roll_no = memberArray
	changedb(club);
	window.location.reload();
}




// club meetings delete krne ka sochna hai
// sbhi locations ko space available ke according free dikhana hai
// css thik krni h