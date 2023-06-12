
let locations;
let loclist = document.getElementById('loclist');

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
	const map = new google.maps.Map(document.getElementById("map"), {
		zoom: 16,
		center: { lat: 29.946076, lng: 76.817682 },
		mapTypeId: 'satellite'
	});

	const image = {
		url: "marker.png",
		size: new google.maps.Size(20, 32),
		origin: new google.maps.Point(0, 0),
		anchor: new google.maps.Point(0, 32),
	};

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

let username = document.getElementById('username');
let userrollno = document.getElementById('userrollno');
let logout = document.getElementById('logout');

let us = JSON.parse(localStorage.user);

username.innerHTML = us.name;
userrollno.innerHTML = us.roll_no;

logout.addEventListener('click', () => {
	localStorage.clear();
	window.location.href = '../landing.html';
});




/* Responsive navbar */

let navb = document.querySelector('#menu');
let navbar = document.querySelector('#navbarid');

navb.onclick = () => {
	navb.classList.toggle('bx-x');
	navbar.classList.toggle('active');
};