let teacher = document.getElementById('teacher');
let student = document.getElementById('student');
let visitor = document.getElementById('visitor');
let club = document.getElementById('club');

window.addEventListener('load', () => {
    if(localStorage.role){
        window.location.href = `${localStorage.role}/${localStorage.role}.html`;
    }
});

teacher.addEventListener('click', () => {
    localStorage.removeItem('role');
    localStorage.setItem('role', 'teacher');
    window.location.href = 'teacher/teacher.html';
});

student.addEventListener('click', () => {
    localStorage.removeItem('role');
    localStorage.setItem('role', 'student');
    window.location.href = 'student/student.html';
});

visitor.addEventListener('click', () => {
    localStorage.removeItem('role');
    localStorage.setItem('role', 'visitor');
    window.location.href = 'visitor/visitor.html';
});

club.addEventListener('click', () => {
    localStorage.removeItem('role');
    localStorage.setItem('role', 'club');
    window.location.href = 'club/club.html';
});