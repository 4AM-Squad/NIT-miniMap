let task = document.getElementsByClassName("task");
let taskContainer = document.getElementById("taskContainer");
let checkbtn = document.getElementsByClassName("checkbtn");
let updatebtn = document.getElementsByClassName("updatebtn");
let addbtn = document.getElementsByClassName("addbtn");
let clrbtn = document.getElementsByClassName("clrbtn");
let inpTask = document.getElementById("inpTask");
let empty = document.getElementById("empty");
let msg = document.getElementById("msg");
let todos = [];
let checked = [];
document.getElementById("inpContainer").childNodes[5].disabled = true;
document.getElementById("inpContainer").childNodes[9].disabled = true;

if(JSON.parse(localStorage.getItem("todos")).length){
    document.getElementById("inpContainer").childNodes[9].disabled = false;
    empty.style.display = "none";
    for(let i=0; i<JSON.parse(localStorage.getItem("todos")).length; i++){
        todos.push(JSON.parse(localStorage.getItem("todos"))[i]);
        checked.push(JSON.parse(localStorage.getItem("checked"))[i]);
    }
    todos.forEach(element => {
        taskContainer.innerHTML += `<div class="task" onmouseenter="showicons(this)" onmouseleave="hideicons(this)">
        <input type="checkbox" class="checkbtn" onclick="check(this)">
        <div class="description">${element}</div>
        <i class="fa-regular fa-pen-to-square" onclick="updatetask(this)"></i>
        <i class="fa-regular fa-trash-can" onclick="deltask(this)"></i>
        </div>`;
    });
    for(let i=0; i<checked.length; i++){
        if(checked[i]=='1'){
            checkbtn[i].checked = true;
            check(checkbtn[i]);
        }
    }
}

function showicons(index){
    index.childNodes[1].style.opacity = "100%";
    index.childNodes[5].style.opacity = "100%";
    index.childNodes[7].style.opacity = "100%";
};

function hideicons(index){
    index.childNodes[1].style.opacity = "50%";
    index.childNodes[5].style.opacity = "50%";
    index.childNodes[7].style.opacity = "50%";
};

function addtask(){
    if(inpTask.value){
        document.getElementById("inpContainer").childNodes[9].disabled = false;
        empty.style.display = "none";
        taskContainer.innerHTML += `<div class="task" onmouseenter="showicons(this)" onmouseleave="hideicons(this)">
        <input type="checkbox" class="checkbtn" onclick="check(this)">
        <div class="description">${inpTask.value}</div>
        <i class="fa-regular fa-pen-to-square" onclick="updatetask(this)"></i>
        <i class="fa-regular fa-trash-can" onclick="deltask(this)"></i>
        </div>`;
        todos.push(inpTask.value);
        checked.push(0);
        localStorage.removeItem("todos");
        localStorage.removeItem("checked");
        localStorage.setItem("todos", JSON.stringify(todos));
        localStorage.setItem("checked", JSON.stringify(checked));
        inpTask.value = "";
        msganimate("Task Added");
    }
    else
        msganimate("Cannot enter an empty task");
}

function cleartask(){
    document.getElementById("inpContainer").childNodes[9].disabled = true;
    if(todos.length==0)
    msganimate("There is no task to be cleared");
    else
    msganimate("Cleared all tasks");
    localStorage.clear();
    todos = [];
    checked = [];
    empty.style.display = "block";
    taskContainer.innerHTML = '';
}

function check(element){
    let index = todos.indexOf(element.parentNode.childNodes[3].innerHTML);
    console.log(element.checked);
    if(element.checked){
        checked[index] = 1;
        element.parentNode.childNodes[3].style.textDecoration = "line-through #00ADB5 3px";
    }
    else{
        checked[index] = 0;
        element.parentNode.childNodes[3].style.textDecoration = "none";
    }
    localStorage.removeItem("checked");
    localStorage.setItem("checked", JSON.stringify(checked));
}

function deltask(element){
    let desc = String(element.parentNode.childNodes[3].innerHTML);
    let index = todos.indexOf(desc);
    todos.splice(index, 1);
    localStorage.removeItem("todos");
    localStorage.setItem("todos", JSON.stringify(todos));
    let list = element.parentNode.parentNode;
    list.removeChild(list.childNodes[index]);
    msganimate("Task Deleted");
    if(todos.length==0){
        empty.style.display = "block";
        document.getElementById("inpContainer").childNodes[9].disabled = true;
    }
}

function msganimate(str){
    let int = setInterval(opa, 20);
    msg.style.opacity = 1;
    function opa(){
        if(msg.style.opacity==0){
            clearInterval(int);
        }
        else{
            msg.style.opacity -= 0.01;
        }
    }
    msg.innerHTML = str;
}

let prevtext;
function updatetask(index){
    document.getElementById("inpContainer").childNodes[5].disabled = false;
    inpTask.value = index.parentNode.childNodes[3].innerHTML;
    prevtext = inpTask.value;
    inpTask.focus();
    document.getElementById("inpContainer").childNodes[7].disabled = true;
    document.getElementById("inpContainer").childNodes[9].disabled = true;
}

function update(){
    let index = todos.indexOf(prevtext);
    if(inpTask!=''){
        taskContainer.childNodes[index].childNodes[3].innerHTML = inpTask.value;    
        todos[todos.indexOf(prevtext)] = inpTask.value;
        localStorage.removeItem("todos");
        localStorage.setItem("todos", JSON.stringify(todos));
        inpTask.value = '';
        document.getElementById("inpContainer").childNodes[7].disabled = false;
        document.getElementById("inpContainer").childNodes[9].disabled = false;
        msganimate("Task Updated");
    }
    else
        msganimate("Cannot enter empty task");
}

var alarmSound = new Audio();
alarmSound.src = 'alarm.mp3';
alarmSound.loop = true;
var alarmTimer;

function setAlarm(button) {
    var ms = document.getElementById('alarmTime').valueAsNumber;
    if (isNaN(ms)) {
        alert('Invalid Date');
        return;
    }

    var alarm = new Date(ms);
    var alarmTime = new Date(alarm.getUTCFullYear(), alarm.getUTCMonth(), alarm.getUTCDate(), alarm.getUTCHours(), alarm.getUTCMinutes(), alarm.getUTCSeconds());

    var differenceInMs = alarmTime.getTime() - (new Date()).getTime();

    if (differenceInMs < 0) {
        alert('Specified time is already passed');
        return;
    }

    alarmTimer = setTimeout(initAlarm, differenceInMs);
    button.innerText = 'Cancel Alarm';
    button.setAttribute('onclick', 'cancelAlarm(this);');
};

function cancelAlarm(button) {
    clearTimeout(alarmTimer);
    button.innerText = 'Set Alarm';
    button.setAttribute('onclick', 'setAlarm(this);')
};

let alarmcnt=0;

function initAlarm() {
    alarmSound.play();
    document.getElementById('alarmOptions').style.display = '';
    setTimeout(snooze, 60000);
    alarmcnt++;
};

function stopAlarm() {
    alarmSound.pause();
    alarmSound.currentTime = 0;
    document.getElementById('alarmOptions').style.display = 'none';
    cancelAlarm(document.getElementById('alarmButton'));
};

function snooze() {
    stopAlarm();
    alarmTimer = setTimeout(initAlarm, 300000); // 5 * 60 * 1000 = 5 Minutes
    if(alarmcnt==3)
        stopAlarm();
};