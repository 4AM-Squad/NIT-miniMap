let latt = 29.947001, lngg = 76.816805;

function loadGoogleMaps(url) {
	const script = document.createElement('script');
	script.src = url;
	script.defer = true;
	script.async = true;
	document.head.appendChild(script);
	console.log('Google Maps API loaded')
}

fetch('http://localhost:3000/apiurl')
	.then(response => response.json())
	.then(data => {
		loadGoogleMaps(data.apiURL);
	})

function initMap() {
	let directionsService = new google.maps.DirectionsService();
	let directionsRenderer = new google.maps.DirectionsRenderer();

	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 16,
		center: { lat: 29.946076, lng: 76.817682 },
		mapTypeId: 'satellite'
	});

	fetch('../locations.json')
		.then(response => response.json())
		.then(data => {
			data.places.forEach(element => {
				loclist.innerHTML += `<li><a href="#" onclick="onClickHandler(this)">${element.name}</a></li>`;
			});
		});

	navigator.geolocation.watchPosition(
		function (position) {
			latt = position.coords.latitude;
			lngg = position.coords.longitude;

			directionsRenderer.setMap(map);
			let origin = new google.maps.LatLng(latt, lngg);
			let destination = new google.maps.LatLng(localStorage.targetLat, localStorage.targetLng);

			directionsService.route({
				origin: origin,
				destination: destination,
				travelMode: 'WALKING'
			}, function (response, status) {
				if (status === 'OK') {
					directionsRenderer.setDirections(response);
				} else {
					window.alert('Directions request failed. Try Again');
				}
			},
				function (error) {
					console.log("Error occurred. Error code: " + error.code);
				},
				{
					enableHighAccuracy: true,
					timeout: 5000,
					maximumAge: 0
				}
			)
		});
}

function onClickHandler(element) {
	let str = element.innerHTML;
	let obj;

	fetch('../locations.json')
		.then(response => response.json())
		.then(data => {
			obj = data.places.find(el => el.name == str);
			localStorage.setItem('targetLat', obj.latitude);
			localStorage.setItem('targetLng', obj.longitude);
			location.reload();
		});
}

let username = document.getElementById('username');
let logout = document.getElementById('logout');

let teacher = JSON.parse(localStorage.teacher);
username.innerHTML = teacher.name

logout.addEventListener('click', () => {
	localStorage.clear();
	window.location.href = '../../landing.html';
});

async function removeClass(element) {
	let classid;
	const time = element.parentNode.childNodes[9].innerHTML.split(' - ')[0].replaceAll(':', '_')
	const branch = element.parentNode.childNodes[5].innerHTML.split(' - ')[0]
	const section = element.parentNode.childNodes[5].innerHTML.split(' - ')[1][0]
	const subsection = element.parentNode.childNodes[5].innerHTML.split(' - ')[1][1]
	await fetch(`http://localhost:3000/timetable/${day}/${branch}/${section}/${subsection}/${time}`)
		.then(response => response.json())
		.then(data => {
			classid = data[0]._id;
		})
		.catch(err => console.log(err));

	await fetch(`http://localhost:3000/timetable/${classid}`, {
		method: 'DELETE'
	})
		.then(response => response.json())
		.then(data => console.log(data))
		.catch(err => console.log(err));

	window.location.reload();
}

let date = document.getElementsByClassName('date')[0];

date.addEventListener('change', async () => {
	for (let i = 1; i < loc_select.childNodes.length; i += 2) {
		loc_select.childNodes[i].style.background = 'white';
	}

	let thatdate = new Date(date.value);
	let dayNumber = thatdate.getDay();
	let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	let dayName = daysOfWeek[dayNumber];
	let time = date.value.split('T')[1].concat(':00');

	fetch(`http://localhost:3000/timetable/${dayName}`)
		.then(response => response.json())
		.then(data => {
			data.forEach(cls => {
				if (cls.start_time <= time && time <= cls.end_time) {
					let place = cls.location
					for (let i = 1; i < loc_select.childNodes.length; i += 2) {
						if (loc_select.childNodes[i].value == place) {
							loc_select.childNodes[i].style.background = 'red';
						}
					}
				}
			})
		})
})

let addbtn = document.getElementById('addbtn')
let loc_select = document.getElementById('loc_select');
let branch_select = document.getElementById('branch_select');
let sub_select = document.getElementById('sub_select');

addbtn.addEventListener('click', async () => {
	if (branch_select.value == '') {
		alert('Select Branch');
		return false;
	}
	if (sub_select.value == '') {
		alert('Select Subsection');
		return false;
	}
	if (date.value == '') {
		alert('Select Date');
		return false;
	}
	if (loc_select.value == '') {
		alert('Select Location');
		return false;
	}
	let thatdate = new Date(date.value);
	let dayNumber = thatdate.getDay();
	let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	let dayName = daysOfWeek[dayNumber];
	let time = date.value.split('T')[1].concat(':00');
	let sec;
	if (sub_select.value <= 12)
		sec = 'C';
	if (sub_select.value <= 8)
		sec = 'B';
	if (sub_select.value <= 4)
		sec = 'A';

	let timeString = time;
	let currentDate = new Date();
	currentDate.setHours(timeString.substr(0, 2));
	currentDate.setMinutes(timeString.substr(3, 2));
	currentDate.setSeconds(timeString.substr(6, 2));
	currentDate.setTime(currentDate.getTime() + (55 * 60 * 1000));
	let newTimeString = currentDate.toTimeString().substring(0, 8);

	let sub, flag = true;
	await fetch(`http://localhost:3000/timetable`)
		.then(response => response.json())
		.then(data => {
			data.forEach(cls => {
				if (flag && cls.teacher == teacher.name && cls.branch == branch_select.value && cls.section == sec) {
					sub = cls.subject;
					flag = false;
				}
			})
		})

	const myClass = {
		"subject": sub,
		"type": "Lecture",
		"location": loc_select.value,
		"day": dayName,
		"start_time": time,
		"end_time": newTimeString,
		"teacher": teacher.name,
		"branch": branch_select.value,
		"section": sec,
		"subsection": sub_select.value
	}

	await fetch('http://localhost:3000/timetable/', {
		method: 'POST',
		body: JSON.stringify(myClass),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(response => response.json())
		.then(data => alert('Class Added'))
		.catch(error => console.error(error))

	window.location.reload();
})