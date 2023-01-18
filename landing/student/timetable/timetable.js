/**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
let locations;
let loclist = document.getElementById('loclist');

function initMap() {
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        center: { lat: 29.946076, lng: 76.817682 },
        mapTypeId: 'satellite'
    });

    map.setOptions({minZoom: 15});

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

    fetch('./timetable.json')
        .then(response => response.json())
        .then(data => {
            let arr;
            if (day == 'Monday') {
                if (user.branch == 'CS') {
                    if(user.section == 'A' && user.subsection == 1){
                        arr = data.Monday[0].CS[0].A1;
                    }
                    if (user.section == 'A' && user.subsection == 2) {
                        arr = data.Monday[0].CS[0].A2;
                    }
                    if (user.section == 'A' && user.subsection == 3) {
                        arr = data.Monday[0].CS[0].A3;
                    }
                    if (user.section == 'A' && user.subsection == 4) {
                        arr = data.Monday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Tuesday') {
                if (user.branch == 'CS') {
                    if(user.section == 'A' && user.subsection == 1){
                        arr = data.Tuesday[0].CS[0].A1;
                    }
                    if (user.section == 'A' && user.subsection == 2) {
                        arr = data.Tuesday[0].CS[0].A2;
                    }
                    if (user.section == 'A' && user.subsection == 3) {
                        arr = data.Tuesday[0].CS[0].A3;
                    }
                    if (user.section == 'A' && user.subsection == 4) {
                        arr = data.Tuesday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Wednesday') {
                if (user.branch == 'CS') {
                    if(user.section == 'A' && user.subsection == 1){
                        arr = data.Wednesday[0].CS[0].A1;
                    }
                    if (user.section == 'A' && user.subsection == 2) {
                        arr = data.Wednesday[0].CS[0].A2;
                    }
                    if (user.section == 'A' && user.subsection == 3) {
                        arr = data.Wednesday[0].CS[0].A3;
                    }
                    if (user.section == 'A' && user.subsection == 4) {
                        arr = data.Wednesday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Thursday') {
                if (user.branch == 'CS') {
                    if(user.section == 'A' && user.subsection == 1){
                        arr = data.Thursday[0].CS[0].A1;
                    }
                    if (user.section == 'A' && user.subsection == 2) {
                        arr = data.Thursday[0].CS[0].A2;
                    }
                    if (user.section == 'A' && user.subsection == 3) {
                        arr = data.Thursday[0].CS[0].A3;
                    }
                    if (user.section == 'A' && user.subsection == 4) {
                        arr = data.Thursday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Friday') {
                if (user.branch == 'CS') {
                    if(user.section == 'A' && user.subsection == 1){
                        arr = data.Friday[0].CS[0].A1;
                    }
                    if (user.section == 'A' && user.subsection == 2) {
                        arr = data.Friday[0].CS[0].A2;
                    }
                    if (user.section == 'A' && user.subsection == 3) {
                        arr = data.Friday[0].CS[0].A3;
                    }
                    if (user.section == 'A' && user.subsection == 4) {
                        arr = data.Friday[0].CS[0].A4;
                    }
                }
            }
            arr.forEach(el => {
                let loc = el.Location;
                let element;
                fetch('../locations.json')
                    .then(response => response.json())
                    .then(data => {

                        element = data.places.find(el => el.name == loc);
                        console.log(element);

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
        });

    map.setOptions({ minZoom: 15 });

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

const obj = {
    "name": "Vansh Sukhija",
    "rollno": 12112021,
    "branch": "CS",
    "section": "A",
    "subsection": 2,
    "password": "flana flana"
};

localStorage.setItem('user', JSON.stringify(obj));

const user = JSON.parse(localStorage.getItem('user'));

let today = new Date();
let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let day = days[today.getDay()];


