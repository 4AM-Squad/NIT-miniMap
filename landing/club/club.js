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
let club = JSON.parse(localStorage.clubuser)
let list = document.getElementsByClassName('list')[0]

fetch(`http://localhost:3000/clubdb/${club.name}`)
.then(res => res.json())
.then(data => {
	data = data[0];
	memberArray = data.roll_no;
	console.log(memberArray)
	let i=-1;
	memberArray.forEach(elem => {
		i++;
		let ele = elem[i]
		list.innerHTML += `
			<div class="meeting">
				<div class="memberroll">${ele.RollNo}</div>
				<div class="membername">${ele.Name}</div>
				<div class="memberclass">${ele.Branch} - ${ele.Subsection}</div>
				<img src="./trash.png" alt="delete" class="deletemem" onclick="delmem(this)">
			</div>
		`
	})
})

function delmem(element){
    console.log(element.parentNode.parentNode.childNodes)
    // console.log(document.getElementsByClassName('meeting'))
}