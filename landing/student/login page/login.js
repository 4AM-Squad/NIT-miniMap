let rollbox = document.getElementById("roll");
let passbox = document.getElementById("pas");
let btn = document.getElementById("log");

btn.addEventListener('click', async (e) => {
    e.preventDefault();
    let user;

    await fetch(`http://localhost:3000/studentdb/${rollbox.value}`)
        .then(response => response.json())
        .then(data => {
            if (data.length == 0) {
                alert("User isn't registered");
                return false;
            }
            else {
                user = data[0];
                if (user.password == passbox.value) {
                    localStorage.setItem('role', 'student')
                    localStorage.setItem('user', JSON.stringify(user));
                    window.location.href = '../student.html';
                }
                else{
                    alert("Password is Incorrect");
                    return false
                }
            }
        })
})