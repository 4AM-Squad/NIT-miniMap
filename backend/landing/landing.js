let teacher = document.getElementById('teacher');
let student = document.getElementById('student');
let visitor = document.getElementById('visitor');
let club = document.getElementById('club');
let body = document.getElementById('body');

window.addEventListener('load', () => {
    if (localStorage.role) {
        window.location.href = `${localStorage.role}/${localStorage.role}.html`;
    }
});

teacher.addEventListener('click', () => {
    window.location.href = 'teacher/login page/login.html';
});

student.addEventListener('click', () => {
    window.location.href = 'student/Register page/register.html';
});

visitor.addEventListener('click', () => {
    localStorage.removeItem('role');
    localStorage.setItem('role', 'visitor');
    window.location.href = 'visitor/visitor.html';
});

club.addEventListener('click', () => {
    window.location.href = 'club/login page/login.html';
});