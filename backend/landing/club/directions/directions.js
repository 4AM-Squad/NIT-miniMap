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
			console.log(position.coords.latitude, position.coords.longitude);

			directionsRenderer.setMap(map);
			let origin = new google.maps.LatLng(latt, lngg);
			let destination = new google.maps.LatLng(localStorage.targetLat, localStorage.targetLng);

			directionsService.route({
				origin: origin,
				destination: destination,
				travelMode: 'WALKING'
			}, function (response, status) {
				if (status === 'OK') {
					console.log(response);
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

	console.log(google.maps.geometry.spherical.computeDistanceBetween(origin, destination));
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
let userrollno = document.getElementById('userrollno');
let logout = document.getElementById('logout');


let club = JSON.parse(localStorage.clubuser)
let clubname = document.getElementById('clubname');
clubname.innerHTML = club.name.replaceAll('_', ' ');

logout.addEventListener('click', () => {
	localStorage.clear();
	window.location.href = '../../landing.html';
});