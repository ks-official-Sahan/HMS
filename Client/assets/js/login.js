
function login() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');

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
        // alert(res);
        let resObj = JSON.parse(res);
        window.sessionStorage.setItem("hms_user", resObj);
        window.location = 'user_dashboard/user.html';
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
      }
    }
  };

  request.open("POST", "http://localhost:3000/api/auth/user");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(jsonData);
}

function adminLogin() {
  const username = document.getElementById('username');
  const password = document.getElementById('password');

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
        // alert(res);
        let resObj = JSON.parse(res);
        window.sessionStorage.setItem("hms_admin", resObj);
        window.location = 'admin_dashboard/dashboard.html';
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
      }
    }
  };

  request.open("POST", "http://localhost:3000/api/auth/admin");
  request.setRequestHeader("Content-Type", "application/json");
  request.send(jsonData);
}
