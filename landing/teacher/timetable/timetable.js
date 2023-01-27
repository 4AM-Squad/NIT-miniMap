/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
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
const user = JSON.parse(localStorage.getItem('teacher'));
console.log(user);

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 17,
        center: { lat: 29.946076, lng: 76.817682 },
        mapTypeId: 'satellite'
    });

    map.setOptions({ minZoom: 16 });

    const image = {
        url: "../marker.png",
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

    fetch('../locations.json')
        .then(response => response.json())
        .then(data => {
            data.places.forEach(element => {
                loclist.innerHTML += `<li><a href="#" onclick="onClickHandler(this)">${element.name}</a></li>`;
            });
        });

    let name = user.name.replaceAll(' ', '_');
    console.log(name)
    console.log(day)
    // day = 'Monday';
    fetch(`http://localhost:3000/timetable/${day}/${name}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(el => {
                table.innerHTML += `
                <div id="data">
                    <img src="./marker100.png" alt="marker">
                    <div class="details">
                        <h4 id="sub">${el.subject}</h4>
                        <h4 id="type">(${el.type})</h4>
                        <h4 id="branchsec">${el.branch} - ${el.section}${el.subsection}</h4>
                        <h4 id="loc">${el.location}</h4>
                        <h4 id="time">${el.start_time} - ${el.end_time}</h4>
                        <button class="remclass" onclick="removeClass(this)">Remove Class</button>
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

    infoWindow = new google.maps.InfoWindow({
        content: ""
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
            window.location.href = '../directions/directions.html'
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

async function removeClass(element){
    let classid;
    const time = element.parentNode.childNodes[9].innerHTML.split(' - ')[0].replaceAll(':', '_')
    const branch = element.parentNode.childNodes[5].innerHTML.split(' - ')[0]
    const section = element.parentNode.childNodes[5].innerHTML.split(' - ')[1][0]
    const subsection = element.parentNode.childNodes[5].innerHTML.split(' - ')[1][1]
    await fetch(`http://localhost:3000/timetable/${day}/${branch}/${section}/${subsection}/${time}`)
    .then(response => response.json())
    .then(data => {
        classid = data[0]._id;
        console.log(classid);
    })
    .catch(err => console.log(err));

    await fetch(`http://localhost:3000/timetable/${classid}`, {
        method : 'DELETE'
    })
    .then(response => response.json())
    .then(data => console.log(data))
    .catch(err => console.log(err));

    window.location.reload();
}

