function login() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if (username.value.trim() !== "" && password.value.trim() !== "") {
    const data = {
      email: username.value,
      password: password.value,
    };
    
    const jsonData = JSON.stringify(data);

    // fetch('http://localhost:3000/api/auth/user', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: jsonData
    // })
    //   .then(res => {
    //     if (res.ok || res.status === 200) {
    //       console.log('success')
    //       return res.json();
    //     } else if (res.status == 403) {
    //       console.log('unauthorized')
    //     } else {
    //       console.log('unsuccess')
    //     }
    //   })
    //   .then(data => console.log(data))
    //   .catch(err => console.log(err.message))

    

    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        const res = request.responseText;
        if (request.status == 200) {
          window.sessionStorage.setItem("hms_user", res);
          window.location = "user_dashboard/user.html";
        } else {
          console.log("Bad Request", request.status, res);
          alert(res);
        }
      }
    };

    request.open("POST", "http://localhost:3000/api/auth/user");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(jsonData);
  } else {
    alert("Username & Password required");
  }
}

function adminLogin() {
  const username = document.getElementById("username");
  const password = document.getElementById("password");

  if (username.value.trim() !== "" && password.value.trim() !== "") {
    const data = {
      email: username.value,
      password: password.value,
    };

    const jsonData = JSON.stringify(data);

    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState == 4) {
        const res = request.responseText;
        if (request.status == 200) {
          window.sessionStorage.setItem("hms_admin", res);
          window.location = "admin_dashboard/dashboard.html";
        } else {
          console.log("Bad Request", request.status, res);
          alert(res);
        }
      }
    };

    request.open("POST", "http://localhost:3000/api/auth/admin");
    request.setRequestHeader("Content-Type", "application/json");
    request.send(jsonData);
  } else {
    alert("Username & Password required");
  }
}
