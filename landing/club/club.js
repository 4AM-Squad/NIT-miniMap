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
						'<img src="https://www.mystudyindia.com/storage/colleges/medias/aTSlBx_1618989003.webp" style="width: 100%"/>' +
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
	list.innerHTML = '';
	await fetch(`http://localhost:3000/clubdb/${club.name}`)
		.then(res => res.json())
		.then(data => {
			data = data[0];
			memberArray = data.roll_no;
			console.log(memberArray)
			let i = -1;
			memberArray.forEach(elem => {
				i++;
				let ele = elem[i]
				list.innerHTML += `
				<div class="meeting">
				<div class="memberroll">${ele.RollNo}</div>
				<div class="membername">${ele.Name}</div>
				<div class="memberclass">${ele.Branch} - ${ele.Subsection}</div>
				</div>
			`
			})
		})
}

getAllMems();

let addmemheading = document.getElementById('addmemheading')
let loc_set = document.getElementById('branch_select')
let addmeetbtn = document.getElementById('addmeetbtn')
let date = document.getElementById('date')
let agenda = document.getElementById('agenda')
let list1 = document.getElementsByClassName('list1')[0]


addmemheading.addEventListener('click', getAllMems)
fetch('./locations.json')
	.then(response => response.json())
	.then(data => {
		data.places.forEach(e => {
			loc_set.innerHTML += `<option value="${e.name}">${e.name}</option>`
		})
	})

addmeetbtn.addEventListener('click', async () => {
	let meetdate = date.value.split('T')[0]
	let meettime = date.value.split('T')[1]
	let dd = meetdate.split('-')[2]
	let mm = meetdate.split('-')[1]
	let yy = meetdate.split('-')[0]
	console.log(meetdate)
	console.log(meettime)
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

	await fetch(`http://localhost:3000/clubdb/addMeeting`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(club)
	})
		.then(response => response.json())
		.then(data => {
			localStorage.removeItem('clubuser');
			localStorage.setItem('clubuser', JSON.stringify(data))
		})
})

async function getAllMeets() {
	club = JSON.parse(localStorage.clubuser)
	list1.innerHTML = '';

	await fetch(`http://localhost:3000/clubdb/${club.name}`)
		.then(res => res.json())
		.then(data => {
			data = data[0];
			meetArray = data.meetings;
			console.log(meetArray)
			let i = -1;
			meetArray.forEach(elem => {
				i++;
				let ele = elem[i]
				// console.log(ele)
				// let meettime = ele.time
				// let dd = ele.date.split('-')[2]
				// let mm = ele.date.split('-')[1]
				// let yy = ele.date.split('-')[0]
				// list1.innerHTML += `
				// 	<div class="meeting2">
				// 		<div class="meetdetails">   
				// 			<div class="datetime">${dd}-${mm}-${yy}</div>
				// 			<div class="datetime2">${meettime}:00</div>
				// 			<div class="membername">${ele.location}</div>
				// 		</div>
				// 		<div class="meetagenda">${ele.agenda}</div>
				// 	</div>
				// `
			})
		})
}

getAllMeets()