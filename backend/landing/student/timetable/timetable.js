
let locations;
let loclist = document.getElementById('loclist');
let sub = document.getElementById('sub');
let loc = document.getElementById('loc');
let time = document.getElementById('time');
let type = document.getElementById('type');
let table = document.getElementsByClassName('table');
table = table[0];

let today = new Date();
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = days[today.getDay()];
const user = JSON.parse(localStorage.getItem('user'));

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
        url: '../marker.png',
        size: new google.maps.Size(20, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(0, 32),
    };

    const shape = {
        coords: [1, 1, 1, 20, 18, 20, 18, 1],
        type: "poly",
    };

    fetch('../locations.json')
        .then(response => response.json())
        .then(data => {
            data.places.forEach(element => {
                loclist.innerHTML += `<li><a href="#" onclick="onClickHandler(this)">${element.name}</a></li>`;
            });
        });

    infoWindow = new google.maps.InfoWindow({
        content: ""
    });

    let subsec = user.subsection;
    subsec = Number(subsec);
    let sec;
    if (subsec <= 12)
        sec = 'C';
    if (subsec <= 8)
        sec = 'B';
    if (subsec <= 4)
        sec = 'A';

    fetch(`http://localhost:3000/timetable/${day}/${user.branch}/${sec}/${subsec}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(el => {
                table.innerHTML += `
                <div id="data">
                    <img src="./marker100.png" alt="marker">
                    <div class="details">
                        <h4 id="sub">${el.subject}</h4>
                        <h4 id="type">(${el.type})</h4>
                        <h4 id="loc">${el.location}</h4>
                        <h4 id="time">${el.start_time} - ${el.end_time}</h4>
                    </div>
                </div>
            `
            });

            data.forEach(el => {
                let loc = el.location;
                let element;
                fetch('../locations.json')
                    .then(response => response.json())
                    .then(dt => {
                        dt.places.forEach(i => {
                            if (i.name == loc)
                                element = i;
                        })

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
        })
        .catch(err => console.log(err));

    fetch(`http://localhost:3000/clubdb`)
        .then(response => response.json())
        .then(data => {
            data.forEach(club => {
                let rollArray = club.roll_no
                let meetArray = club.meetings
                for (let i = 0; i < rollArray.length; i++) {
                    if (us.RollNo == rollArray[i][i].RollNo) {
                        for (let j = 0; j < meetArray.length; j++) {
                            let m = meetArray[j][j]
                            let today = new Date();
                            let meetdate = new Date(m.date);
                            if (today.getTime() <= meetdate.getTime()) {
                                meets.innerHTML += `
                            <div id="data">
                            <img src="./marker100.png" alt="marker">
                            <div class="details">
                            <h4 id="sub">${club.name}</h4>
                            <h4 id="type">at ${m.location}</h4>
                            <h4 id="loc">on ${m.date} at ${m.time}</h4>
                            <h4 id="time">${m.agenda}</h4>
                            </div>
                            </div>
                            `
                                let element

                                fetch('../locations.json')
                                    .then(response => response.json())
                                    .then(data => {
                                        data.places.forEach(i => {
                                            if (i.name == m.location) {
                                                element = i
                                            }
                                        })
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
                                    })

                            }
                        }
                    }
                }
            })
        })
        .catch(err => console.log(err))
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
            window.location.href = '../directions/directions.html'
        });
}

let username = document.getElementById('username');
let userrollno = document.getElementById('userrollno');
let logout = document.getElementById('logout');

console.log(JSON.parse(localStorage.user));

let us = JSON.parse(localStorage.user);

username.innerHTML = us.name;
userrollno.innerHTML = us.roll_no;

logout.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../../landing.html';
});

let meets = document.getElementById('meets');