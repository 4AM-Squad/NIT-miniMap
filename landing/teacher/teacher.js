
let locations;
let loclist = document.getElementById('loclist');
console.log(loclist.childNodes);

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
					`<img src=${element.image}  style="width:400px ;height:300px"/>` +
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

	map.setOptions({minZoom: 15});

	infoWindow = new google.maps.InfoWindow({
		content: ""
	});
}

function onClickHandler(element){
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
let logout = document.getElementById('logout');

// console.log(JSON.parse(localStorage.user));

let teacher = JSON.parse(localStorage.teacher);
username.innerHTML = teacher.name

// username.innerHTML = us.Name;
// userrollno.innerHTML = us.RollNo;

logout.addEventListener('click', () => {
	localStorage.clear();
	window.location.href = '../landing.html';
});