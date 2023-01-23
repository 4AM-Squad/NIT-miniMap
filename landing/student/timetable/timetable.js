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
const user = JSON.parse(localStorage.getItem('user'));

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

    fetch('./timetable.json')
        .then(response => response.json())
        .then(data => {
            let arr;
            if (day == 'Monday') {
                if (user.Branch == 'CS') {
                    if (user.Subsection == '01') {
                        arr = data.Monday[0].CS[0].A1;
                    }
                    if (user.Subsection == '02') {
                        arr = data.Monday[0].CS[0].A2;
                    }
                    if (user.Subsection == '03') {
                        arr = data.Monday[0].CS[0].A3;
                    }
                    if (user.Subsection == '04') {
                        arr = data.Monday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Tuesday') {
                if (user.Branch == 'CS') {
                    if (user.Subsection == '01') {
                        arr = data.Tuesday[0].CS[0].A1;
                    }
                    if (user.Subsection == '02') {
                        arr = data.Tuesday[0].CS[0].A2;
                    }
                    if (user.Subsection == '03') {
                        arr = data.Tuesday[0].CS[0].A3;
                    }
                    if (user.Subsection == '04') {
                        arr = data.Tuesday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Wednesday') {
                if (user.Branch == 'CS') {
                    if (user.Subsection == '01') {
                        arr = data.Wednesday[0].CS[0].A1;
                    }
                    if (user.Subsection == '02') {
                        arr = data.Wednesday[0].CS[0].A2;
                    }
                    if (user.Subsection == '03') {
                        arr = data.Wednesday[0].CS[0].A3;
                    }
                    if (user.Subsection == '04') {
                        arr = data.Wednesday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Thursday') {
                if (user.Branch == 'CS') {
                    if (user.Subsection == '01') {
                        arr = data.Thursday[0].CS[0].A1;
                    }
                    if (user.Subsection == '02') {
                        arr = data.Thursday[0].CS[0].A2;
                    }
                    if (user.Subsection == '03') {
                        arr = data.Thursday[0].CS[0].A3;
                    }
                    if (user.Subsection == '04') {
                        arr = data.Thursday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Friday') {
                if (user.Branch == 'CS') {
                    if (user.Subsection == '01') {
                        arr = data.Friday[0].CS[0].A1;
                    }
                    if (user.Subsection == '02') {
                        arr = data.Friday[0].CS[0].A2;
                    }
                    if (user.Subsection == '03') {
                        arr = data.Friday[0].CS[0].A3;
                    }
                    if (user.Subsection == '04') {
                        arr = data.Friday[0].CS[0].A4;
                    }
                }
            }
            if (day == 'Saturday') {
                if (user.Branch == 'CS') {
                    table.innerHTML += `
                    <div id="data">
                        <div class="details">
                            <h2>No Class Today</h2>
                        </div>
                    </div>
                `
                }
            }
            if (day == 'Sunday') {
                if (user.Branch == 'CS') {
                    table.innerHTML += `
                    <div id="data">
                        <div class="details">
                            <h2>No Class Today</h2>
                        </div>
                    </div>
                `
                }
            }
            arr.forEach(el => {
                table.innerHTML += `
                    <div id="data">
                        <img src="./marker100.png" alt="marker">
                        <div class="details">
                            <h4 id="sub">${el.Subject}</h4>
                            <h4 id="type">(${el.Type})</h4>
                            <h4 id="loc">${el.Location}</h4>
                            <h4 id="time">${el.Time}</h4>
                        </div>
                    </div>
                `
            });

            arr.forEach(el => {
                let loc = el.Location;
                let element;
                fetch('../locations.json')
                    .then(response => response.json())
                    .then(data => {

                        element = data.places.find(el => el.name == loc);

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


    infoWindow = new google.maps.InfoWindow({
        content: ""
    });

    // fetch('http://localhost:3000/timetable/CS/A/1')
    // .then(response => response.json())
    // .then(data => console.log(data))
    // .catch(err => console.log(err));

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

// console.log(JSON.parse(localStorage.user));

let us = JSON.parse(localStorage.user);

username.innerHTML = us.Name;
userrollno.innerHTML = us.RollNo;

logout.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = '../../landing.html';
});

// NOTIFICATION NHI AA RHA :(

// let notificationTimes = ["17:18:00", "17:19:00"]; // Times in the format of "HH:MM:SS"
// let notificationInterval = 86400000; // 24 hours in milliseconds

// let i = 0; // Index for the notification times

// // Convert the notification time to a date object
// let notificationDate = new Date();
// notificationDate.setHours(notificationTimes[i].split(":")[0]);
// notificationDate.setMinutes(notificationTimes[i].split(":")[1]);
// notificationDate.setSeconds(notificationTimes[i].split(":")[2]);

// // Check if the current time is after the notification time
// let currentDate = new Date();
// if (currentDate > notificationDate) {
//     notificationDate.setDate(notificationDate.getDate() + 1);
// }

// // Schedule the notifications
// setInterval(() => {
//     if (Notification.permission === "granted") {
//         let notification = new Notification("Hello World!");
//     } else if (Notification.permission !== "denied") {
//         Notification.requestPermission().then(function (permission) {
//             if (permission === "granted") {
//                 let notification = new Notification("Hello World!");
//             }
//         });
//     }
//     i = (i + 1) % notificationTimes.length; // Increment the index and reset to 0 if it's out of range
//     notificationDate.setHours(notificationTimes[i].split(":")[0]);
//     notificationDate.setMinutes(notificationTimes[i].split(":")[1]);
//     notificationDate.setSeconds(notificationTimes[i].split(":")[2]);
//     if (currentDate > notificationDate) {
//         notificationDate.setDate(notificationDate.getDate() + 1);
//     }
// }, notificationInterval);