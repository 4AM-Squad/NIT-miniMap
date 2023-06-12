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

    fetch('../locations.json')
        .then(response => response.json())
        .then(data => {
            data.places.forEach(element => {
                loclist.innerHTML += `<li><a href="#" onclick="onClickHandler(this)">${element.name}</a></li>`;
            });
        });

    let name = user.name.replaceAll(' ', '_');

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

async function removeClass(element) {
    let classid;
    const time = element.parentNode.childNodes[9].innerHTML.split(' - ')[0].replaceAll(':', '_')
    const branch = element.parentNode.childNodes[5].innerHTML.split(' - ')[0]
    const section = element.parentNode.childNodes[5].innerHTML.split(' - ')[1][0]
    const subsection = element.parentNode.childNodes[5].innerHTML.split(' - ')[1][1]
    await fetch(`http://localhost:3000/timetable/${day}/${branch}/${section}/${subsection}/${time}`)
        .then(response => response.json())
        .then(data => {
            classid = data[0]._id;
        })
        .catch(err => console.log(err));

    await fetch(`http://localhost:3000/timetable/${classid}`, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(err => console.log(err));

    window.location.reload();
}

let date = document.getElementsByClassName('date')[0];

date.addEventListener('change', async () => {
    for (let i = 1; i < loc_select.childNodes.length; i += 2) {
        loc_select.childNodes[i].style.background = 'white';
    }

    let thatdate = new Date(date.value);
    let dayNumber = thatdate.getDay();
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayName = daysOfWeek[dayNumber];
    let time = date.value.split('T')[1].concat(':00');

    fetch(`http://localhost:3000/timetable/${dayName}`)
        .then(response => response.json())
        .then(data => {
            data.forEach(cls => {
                if (cls.start_time <= time && time <= cls.end_time) {
                    console.log(cls)
                    let place = cls.location
                    for (let i = 1; i < loc_select.childNodes.length; i += 2) {
                        if (loc_select.childNodes[i].value == place) {
                            loc_select.childNodes[i].style.background = 'red';
                        }
                    }
                }
            })
        })
})

let addbtn = document.getElementById('addbtn')
let loc_select = document.getElementById('loc_select');
let branch_select = document.getElementById('branch_select');
let sub_select = document.getElementById('sub_select');

addbtn.addEventListener('click', async () => {
    if (branch_select.value == '') {
        alert('Select Branch');
        return false;
    }
    if (sub_select.value == '') {
        alert('Select Subsection');
        return false;
    }
    if (date.value == '') {
        alert('Select Date');
        return false;
    }
    if (loc_select.value == '') {
        alert('Select Location');
        return false;
    }
    let thatdate = new Date(date.value);
    let dayNumber = thatdate.getDay();
    let daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    let dayName = daysOfWeek[dayNumber];
    let time = date.value.split('T')[1].concat(':00');
    let sec;
    if (sub_select.value <= 12)
        sec = 'C';
    if (sub_select.value <= 8)
        sec = 'B';
    if (sub_select.value <= 4)
        sec = 'A';

    let timeString = time;
    let currentDate = new Date();
    currentDate.setHours(timeString.substr(0, 2));
    currentDate.setMinutes(timeString.substr(3, 2));
    currentDate.setSeconds(timeString.substr(6, 2));
    currentDate.setTime(currentDate.getTime() + (55 * 60 * 1000));
    let newTimeString = currentDate.toTimeString().substring(0, 8);

    let sub, flag = true;
    await fetch(`http://localhost:3000/timetable`)
        .then(response => response.json())
        .then(data => {
            data.forEach(cls => {
                if (flag && cls.teacher == teacher.name && cls.branch == branch_select.value && cls.section == sec) {
                    sub = cls.subject;
                    flag = false;
                }
            })
        })

    const myClass = {
        "subject": sub,
        "type": "Lecture",
        "location": loc_select.value,
        "day": dayName,
        "start_time": time,
        "end_time": newTimeString,
        "teacher": teacher.name,
        "branch": branch_select.value,
        "section": sec,
        "subsection": sub_select.value
    }

    await fetch('http://localhost:3000/timetable/', {
        method: 'POST',
        body: JSON.stringify(myClass),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => alert('Class Added'))
        .catch(error => console.error(error))

    window.location.reload();
})