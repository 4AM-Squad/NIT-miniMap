
// let watchID = navigator.geolocation.watchPosition(handleGetCurrentPosition, handleGetCurrentPositionError, {enableHighAccuracy:true, maximumAge: 0, timeout: 5000});

let latt = 29.947001, lngg = 76.816805;

// window.onload(navigator.geolocation.watchPosition(
//     function (position) {
//         latt = position.coords.latitude;
//         lngg = position.coords.longitude;
//     },
//     function (error) {
//         console.log("Error occurred. Error code: " + error.code);
//     },
//     {
//         enableHighAccuracy: true,
//         timeout: 5000,
//         maximumAge: 0
//     }
// ));

// function handleGetCurrentPosition(location) {
//     latt = location.coords.latitude;
//     lngg = location.coords.longitude;
//     console.log(location.coords.accuracy);
//     // document.forms["myform"].submit();
// }

// function handleGetCurrentPositionError() {
//     alert("Location could not be found.")
// }

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
            window.alert('Directions request failed due to ' + status);
        }
    });

    console.log(google.maps.geometry.spherical.computeDistanceBetween(origin, destination));
}

function onClickHandler(element){
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
let logout = document.getElementById('logout');
logout.addEventListener('click', () => {
	localStorage.clear();
	window.location.href = '../../landing.html';
});