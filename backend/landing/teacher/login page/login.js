let teacherid = document.getElementById('teacherid')
let teacherpwd = document.getElementById('teacherpwd')
let loginbtn = document.getElementById('loginbtn')

loginbtn.addEventListener('click', async (event) => {
    event.preventDefault()
    await fetch(`http://localhost:3000/teacherdb/${teacherid.value}`)
    .then(response => response.json())
    .then(data => {
        if(data.password == teacherpwd.value){
            localStorage.removeItem('role');
            localStorage.setItem('role', 'teacher');
            localStorage.setItem('teacher', JSON.stringify(data))
            window.location.href = '../teacher.html'
        }
        else{
            teacherpwd.value = ''
            alert('Incorrect Password')
        }
    })
})