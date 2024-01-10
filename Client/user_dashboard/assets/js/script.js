/*   Format Date   */
function formatDate(date) {
  var options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

function formatDateTime(date) {
  return new Date(date).toLocaleString("en-US", { timeZone: "IST" });
}

/*   Token   */
function getToken() {
  try {
    return window.sessionStorage.getItem("hms_user");
  } catch (err) {
    alert(
      "Couldn't get the token. Please login. (Try update your web browser)",
      err.message
    );
    window.location = "../login.html";
  }
}

/*   Health Status   */

function addStatus() {
  const description = document.getElementById("description");
  const date = document.getElementById("date");
  const list = document.getElementById("comment-list");

  if (description.value.trim() !== "" && date.value.trim() !== "") {
    const data = {
      date: date.value,
      description: description.value,
    };

    const jsonData = JSON.stringify(data);

    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        const res = request.responseText;
        if (request.status === 200) {
          // window.location.reload();
          loadStatus();

          description.value = "";
          date.value = "";
        } else {
          console.log("Bad Request", request.status, res);
          alert(res);
          if (request.status === 401) {
            window.location = "../login.html";
          }
        }
      }
    };

    request.open("POST", "http://localhost:3000/api/status/");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("x-auth-token", getToken());
    request.send(jsonData);
  }
}

function loadStatus() {
  const list = document.getElementById("comment-list");
  list.innerHTML = "";

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);

        for (var obj of resObj) {
          const dateTxt = document.createElement("span");
          dateTxt.textContent = formatDate(obj.date);

          const li = document.createElement("li");
          li.className = "comment status";
          li.textContent = obj.description;
          li.appendChild(dateTxt);

          list.append(li);
        }
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/status/user");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

/* Create Items */

function createItems(resObj) {
  const list = document.getElementById("comment-list");
  list.innerHTML = "";

  for (var obj of resObj) {
    const div = document.createElement("div");

    const status = document.createElement("span");
    status.textContent = "Status : " + obj.status;
    div.append(status);

    const dateTxt = document.createElement("span");
    dateTxt.textContent = formatDate(obj.date);
    div.append(dateTxt);

    const p = document.createElement("p");
    p.textContent = obj.description;

    const li = document.createElement("li");
    // li.className = obj.status === "Approved" ? "comment approved" : (obj.status === "Rejected" ? "comment rejected" : "comment");
    li.className = `comment ${
      obj.status === "Approved"
        ? " approved"
        : obj.status === "Rejected"
        ? " rejected"
        : ""
    }`;
    li.appendChild(p);
    li.appendChild(div);

    list.append(li);
  }
}

/*   Claims   */

function addClaim() {
  const description = document.getElementById("description");
  const date = document.getElementById("date");

  if (description.value.trim() !== "" && date.value.trim() !== "") {
    const data = {
      date: date.value,
      description: description.value,
    };

    const jsonData = JSON.stringify(data);

    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        const res = request.responseText;
        if (request.status === 200) {
          // let resObj = JSON.parse(res);
          // createItems(resObj);

          // window.location.reload();
          loadClaims();

          description.value = "";
          date.value = "";
        } else {
          console.log("Bad Request", request.status, res);
          alert(res);
          if (request.status === 401) {
            window.location = "../login.html";
          }
        }
      }
    };

    request.open("POST", "http://localhost:3000/api/claims/");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("x-auth-token", getToken());
    request.send(jsonData);
  }
}

function loadClaims() {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);

        createItems(resObj);
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/claims/user");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

/*   Leaves   */

function addLeave() {
  const description = document.getElementById("description");
  const date = document.getElementById("date");

  if (description.value.trim() !== "" && date.value.trim() !== "") {
    const data = {
      date: date.value,
      description: description.value,
    };

    const jsonData = JSON.stringify(data);

    const request = new XMLHttpRequest();

    request.onreadystatechange = function () {
      if (request.readyState === 4) {
        const res = request.responseText;
        if (request.status === 200) {
          // let resObj = JSON.parse(res);
          // createItems(resObj);

          // window.location.reload();
          loadLeaves();

          description.value = "";
          date.value = "";
        } else {
          console.log("Bad Request", request.status, res);
          alert(res);
          if (request.status === 401) {
            window.location = "../login.html";
          }
        }
      }
    };

    request.open("POST", "http://localhost:3000/api/leaves/");
    request.setRequestHeader("Content-Type", "application/json");
    request.setRequestHeader("x-auth-token", getToken());
    request.send(jsonData);
  }
}

function loadLeaves() {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);

        createItems(resObj);
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/leaves/user");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

/* Notifications */

function getNotificationCount() {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);
        document.getElementById("count").textContent = resObj;
        document.getElementById(
          "indicator"
        ).textContent = `${resObj} Notifications`;
        loadNotifications(true);
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/notifications/count/user");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

function loadNotifications(isLimit) {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        // alert(res);
        let resObj = JSON.parse(res);
        if (isLimit) {
          const list = document.getElementById("notify-list");
          list.innerHTML = "";

          var count = 1;
          for (var obj of resObj) {
            const a = document.createElement("a");
            a.href = "notifications.html";
            a.textContent = `${count++}. New ${obj.target.type} Alert `;

            const li = document.createElement("li");
            li.append(a);

            list.append(li);
          }
        } else {
          createNotificationItems(resObj);
          setTimeout(() => {
            updateSeen();
          }, 10 * 1000);
        }
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open(
    "GET",
    `http://localhost:3000/api/notifications/user${isLimit ? "?limit=5" : ""}`
  );
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

function createNotificationItems(resObj) {
  const list = document.getElementById("notification-list");
  list.innerHTML = "";

  for (var obj of resObj) {
    const div = document.createElement("div");

    const status = document.createElement("span");
    status.textContent = "Type : " + obj.target.type;
    div.append(status);

    const dateTxt = document.createElement("span");
    dateTxt.textContent = formatDateTime(obj.datetime);
    div.append(dateTxt);

    const p = document.createElement("p");
    p.textContent = obj.message;

    const li = document.createElement("li");
    li.className = obj.seen ? "notifications seen" : "notifications";
    li.appendChild(p);
    li.appendChild(div);

    list.append(li);
  }
}

function updateSeen() {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        // loadNotifications(false);
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("PUT", "http://localhost:3000/api/notifications/user");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

/* Profile */
function loadProfile() {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);

        document.getElementById("name").value = resObj.nwi;
        document.getElementById("email").value = resObj.email;
        document.getElementById("email2").value = resObj.email;
        document.getElementById("mobile").value = resObj.mobile;
        document.getElementById("dob").value = resObj.dob;
        document.getElementById("position").value = resObj.position.name;
        document.getElementById("position2").value = resObj.position.name;
        document.getElementById("department").value = resObj.department.name;
        document.getElementById("department2").value = resObj.department.name;

        const aObj = resObj.address;
        document.getElementById("address").value =
          aObj.line1 +
          ", " +
          aObj.line2 +
          ", " +
          aObj.line3 +
          ", " +
          aObj.zipcode;
        document.getElementById("province").value = aObj.province.name;
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/profile/user");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

function updateProfile() {
  const email2 = document.getElementById("email2");
  const position2 = document.getElementById("position2");
  const department2 = document.getElementById("department2");
  let address = document.getElementById("address");
  const mobile = document.getElementById("mobile");
  const province = document.getElementById("province");
  const password = document.getElementById("password");
  const cPassword = document.getElementById("cPassword");

  address = address.value.trim().split(",");

  const data = {
    email: email2.value,
    mobile: mobile.value,
    position: position2.value,
    department: department2.value,
    password: password.value,
    cPassword: cPassword.value,
    address: {
      line1: address[0],
      line2: address[1],
      line3: address[2],
      zipcode: address[3],
      province: province.value,
    },
  };

  const jsonData = JSON.stringify(data);

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        // let resObj = JSON.parse(res);

        window.location.reload();
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("PUT", "http://localhost:3000/api/users/user");
  request.setRequestHeader("content-type", "application/json");
  request.setRequestHeader("x-auth-token", getToken());
  request.send(jsonData);
}
