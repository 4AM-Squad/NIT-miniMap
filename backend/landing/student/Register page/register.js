let namebox = document.getElementById("name");
let rollbox = document.getElementById("Roll");
let passbox = document.getElementById("pass");
let branchbox = document.getElementById("branch_select");
let subbox = document.getElementById("sub_select");
let domainidbox = document.getElementById("domainid");
let insertbtn = document.getElementById("signUp");

function validateDomainID(domain) {
    let str = String(rollbox.value)
    if (!domain.includes(str)) {
        alert("Roll Number and Domain ID doesn't match");
        return false;
    }
    if (!domain.includes("@nitkkr.ac.in")) {
        alert("Enter valid domain id");
        return false;
    }
    return true;
}

function validatePassword() {
    var re = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/;
    return re.test(passbox.value);
}

insertbtn.addEventListener("click", async (event) => {
    event.preventDefault();
    if (branchbox.value == "") {
        alert("Must select your branch");
        return false;
    }
    if (subbox.value == "") {
        alert("Must select your subsection");
        return false;
    }
    if (!validateDomainID(domainidbox.value)) {
        return false;
    }
    if (!validatePassword()) {
        alert("Password is invalid ( must have at least one letter , number and special character with length in 6 to 16)");
        return false;
    }

    let user = {
        "name": namebox.value,
        "roll_no": rollbox.value,
        "branch": branchbox.value,
        "subsection": subbox.value,
        "domain_id": domainidbox.value,
        "password": passbox.value
    }
    console.log(user)
    localStorage.removeItem('user');
    localStorage.setItem("user", JSON.stringify(user));
    window.location.href = './otp.html'
})