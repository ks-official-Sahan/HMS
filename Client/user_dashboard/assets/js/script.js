/*   Format Date   */
function formatDate(date) {
  var options = { year: "numeric", month: "numeric", day: "numeric" };
  return new Date(date).toLocaleDateString("en-US", options);
}

function formatDateTime(date) {
  return new Date(date).toLocaleString("en-US", { timeZone: "IST" });
}

function setMaxDateToday() {
  document.getElementById("date").max = formatDate(Date.now());
}

/*   Token   */
function getToken() {
  try {
    return window.sessionStorage.getItem("hms_user");
  } catch (err) {
    alert(
      "Couldn't get the Session. Please login. (Try update your web browser)",
      err.message
    );
    window.location = "../login.html";
  }
}

function logout() {
  try {
    window.sessionStorage.removeItem("hms_user");
    window.location = "../login.html";
  } catch (error) {
    alert(
      "Couldn't access the Session. Please login. (Try update your web browser)",
      err.message
    );
    window.location = "../login.html";
  }
}

/*   Health Status   */

function addStatus() {
  let data = {};

  for (let i = 1; i <= 12; i++) {
    const stat = document.getElementById(`stat${i}`);
    if (stat.value == 0 || stat.value.trim() === "") {
      if (!(i === 8 || i === 11 || i === 12)) {
        stat.focus();
        return alert(
          `Insufficient information. Update information on form ${i}`
        );
      }
    }
    data[`stat${i}`] = stat.value;
  }

  const jsonData = JSON.stringify(data);
  console.log(jsonData);

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        // window.location.reload();
        loadStatus();

        for (let i = 1; i <= 12; i++) {
          document.getElementById(`stat${i}`).value = "" || 0;
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

  request.open("POST", "http://localhost:3000/api/status/");
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("x-auth-token", getToken());
  request.send(jsonData);
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
          dateTxt.textContent = formatDateTime(obj.date);

          const li = document.createElement("li");
          li.className = "status";
          li.appendChild(dateTxt);
          li.appendChild(document.createElement("hr"));

          const stats = [
            "Currently have any health concerns or symptoms: ",
            "Been diagnosed with any chronic health conditions recently: ",
            "Taking any medication that may affect your ability to work: ",
            "Overall welbeing rate: ",
            "Been experiencing high levels of stress or anxiety lately: ",
            "Getting sufficient sleep and rest: ",
            "Experiencing any discomfort or pain related to your workstation setup: ",
            "How often do engage in physical activity and exercise during the week: ",
            "Able to maintain healthy and balanced diet: ",
            "Aware of the available mental health resources and support: ",
            "Utilized any mental health rosources provided by the company: ",
            "Any suggestions or feedback: ",
          ];
          for (let i = 0; i < 12; i++) {
            const item = document.createElement("p");

            const question = document.createElement("span");
            question.textContent = stats[i];
            item.appendChild(question);

            const answer = document.createElement("span");
            answer.textContent = obj["stat" + (i + 1)];
            item.appendChild(answer);

            li.append(item);
          }

          list.append(li);
          li.scrollIntoView({ smooth: true });
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
    dateTxt.textContent = formatDateTime(obj.appliedOn);
    div.append(dateTxt);

    const p = document.createElement("p");
    p.textContent = `${formatDate(obj.date)}:  ${obj.description}`;

    const li = document.createElement("li");
    li.className = `comment ${
      obj.status === "Approve"
        ? " approved"
        : obj.status === "Reject"
        ? " rejected"
        : ""
    }`;
    li.appendChild(p);
    li.appendChild(div);

    list.append(li);
    li.scrollIntoView({ smooth: true });
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

        createItems(resObj.leaves);
        document.getElementById(
          "availableLeavesCount"
        ).textContent = `You have ${resObj.availableLeaves} leaves left to take.`;
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
          }, 5 * 1000);
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
    li.setAttribute(
      "onclick",
      `window.location = '${
        obj.target.type === "Claim" ? "claim.html" : "leave.html"
      }'`
    );
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

        document.getElementById("name").textContent = resObj.nwi;
        document.getElementById("fname").textContent = resObj.fname;
        document.getElementById("lname").textContent = resObj.lname;
        document.getElementById("email").textContent = resObj.email;
        document.getElementById("dob").textContent = resObj.dob;
        document.getElementById("position").textContent = resObj.position.name;
        document.getElementById("department").textContent =
          resObj.department.name;
        document.getElementById("email2").value = resObj.email;
        document.getElementById("mobile").value = resObj.mobile;

        const aObj = resObj.address;
        document.getElementById("line1").value = aObj.line1;
        document.getElementById("line2").value = aObj.line2;
        document.getElementById("line3").value = aObj.line3;
        document.getElementById("zipcode").value = aObj.zipcode;

        loadProvinces(aObj.province.name);
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/users/user");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

function loadProvinces(selectedProvince) {
  province = document.getElementById("province");

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      const res = request.responseText;
      if (request.status == 200) {
        let resObj = JSON.parse(res);

        for (var obj of resObj) {
          var option = document.createElement("option");
          option.value = obj._id;
          option.innerText = obj.name;
          if (obj.name === selectedProvince) option.selected = true;
          province.append(option);
        }
      } else {
        console.log("Bad Request", request.status, res);
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/statics/province");
  request.send();
}

function updateProfile() {
  const oPassword = document.getElementById("oPassword");
  const password = document.getElementById("password");
  const cPassword = document.getElementById("cPassword");

  const data = {
    email: document.getElementById("email2").value,
    mobile: document.getElementById("mobile").value,
    address: {
      line1: document.getElementById("line1").value,
      line2: document.getElementById("line2").value,
      line3: document.getElementById("line3").value,
      zipcode: document.getElementById("zipcode").value,
      province: document.getElementById("province").value,
    },
  };

  if (oPassword.value.trim() !== "" && password.value.trim() !== "") {
    if (password.value.trim() === cPassword.value.trim()) {
      data.oPassword = oPassword.value;
      data.password = password.value;
      data.cPassword = cPassword.value;
    } else {
      return alert("Passwords doesn't match");
    }
  }

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
