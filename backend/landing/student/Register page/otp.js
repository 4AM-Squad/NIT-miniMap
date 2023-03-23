let user = JSON.parse(localStorage.getItem("user"));
let msg = document.getElementById('msg');
console.log(user)
let otpbox = document.getElementById('otp')
let reotp = document.getElementById('reotp')
let submitbtn = document.getElementById('signUp')

setTimeout(sendOTP, 1000);
let flag = false;
let unqid = 0;

async function sendOTP() {
    unqid = Date.now();
    unqid = parseInt((unqid % 100000000) / 100);
    let bd = {
        "to": user.domain_id,
        "otp": unqid
    }
    await fetch(`http://localhost:3000/otp/`, {
        method: 'POST',
        body: JSON.stringify(bd),
        headers: { 'Content-Type': 'application/json' }
    })
        .then(res => res.json())
        .then(data => {
            console.log(data)
            if (data.message == `OTP sent to mail ${user.domain_id} successfully`) {
                msg.innerHTML = `An OTP has been sent to the email - ${user.domain_id}`
                flag = true;
            }
            else {
                msg.innerHTML = "Error Sending mail"
            }
        })
}

submitbtn.addEventListener('click', async (e) => {
    e.preventDefault();
    if (flag == true && otpbox.value == unqid) {
        user.subsection = parseInt(user.subsection);
        console.log(user)
        await fetch(`http://localhost:3000/studentdb/`, {
            method: 'POST',
            body: JSON.stringify(user),
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                window.location.href = '../student.html'
            })
            .catch(err => console.log(err))

    } else {
        alert("Incorrect OTP");
        return false;
    }
})

reotp.addEventListener('click', sendOTP);