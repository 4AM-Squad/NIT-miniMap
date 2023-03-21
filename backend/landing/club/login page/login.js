
let branch_select = document.getElementById('branch_select')
let loginbtn = document.getElementById('loginbtn')
let loginpwd = document.getElementById('loginpwd')


fetch('http://localhost:3000/clubdb')
.then(response => response.json())
.then(data => {
    data.forEach(element => {
        console.log(element)
        let str = element.name.replaceAll('_', ' ')
        branch_select.innerHTML += `<option value="${str}">${str}</option>`
    })
})

loginbtn.addEventListener('click', (event) => {
    event.preventDefault()
    let str = branch_select.value.replaceAll(' ', '_')
    let pwd
    fetch(`http://localhost:3000/clubdb/${str}`)
    .then(response => response.json())
    .then(data => {
        pwd = data[0].password
        if(pwd == loginpwd.value){
            localStorage.removeItem('role');
            localStorage.setItem('role', 'club');
            localStorage.setItem('clubuser', JSON.stringify(data[0]))
            window.location.href = '../club.html'
        }
        else{
            alert('Incorrect Password')
        }
    })
})