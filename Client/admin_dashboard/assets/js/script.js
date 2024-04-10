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
    return window.sessionStorage.getItem("hms_admin");
  } catch (err) {
    alert(
      "Couldn't get the Session. Please login. (Try update your web browser)",
      err.message
    );
    window.location = "../adminLogin.html";
  }
}

function logout() {
  try {
    window.sessionStorage.removeItem("hms_admin");
    window.location = "../adminLogin.html";
  } catch (error) {
    alert(
      "Couldn't access the Session. Please login. (Try update your web browser)",
      err.message
    );
    window.location = "../adminLogin.html";
  }
}

/*   Health Status   */

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
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open(
    "GET",
    "http://localhost:3000/api/status/" + window.sessionStorage.getItem("user")
  );
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

/* Create Items */

function createItems(resObj, type) {
  const list = document.getElementById("item-list");
  list.innerHTML = "";

  for (var obj of resObj) {
    const item = document.createElement("div");
    item.className = "request";

    const info = document.createElement("div");
    info.className = "employee-info";

    const img = document.createElement("img");
    img.src =
      "https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg";
    img.alt = "Employee Profile Picture";

    const details = document.createElement("div");
    details.className = "employee-details";

    const name = document.createElement("p");
    name.textContent = `Name: ${obj.user.nwi}`;
    const id = document.createElement("p");
    id.textContent = `ID: ${obj.user._id}`;

    details.appendChild(name);
    details.appendChild(id);

    info.appendChild(img);
    info.appendChild(details);

    const section = document.createElement("div");
    section.className = "item";

    const date = document.createElement("p");
    date.textContent = `Date: ${formatDate(obj.date)}`;
    const description = document.createElement("p");
    description.textContent = `${
      type === "Leave" ? "Reason for leave" : "Claim description"
    }: ${obj.description}`;

    section.appendChild(description);
    section.appendChild(date);

    const buttons = document.createElement("div");
    buttons.className = "action-buttons";

    if (obj.status === "Pending") {
      const accept = document.createElement("button");
      accept.className = "accept";
      accept.textContent = "Accept";
      accept.setAttribute("onclick", `acceptItem('${type}', '${obj._id}')`);

      const decline = document.createElement("button");
      decline.className = "decline";
      decline.textContent = "Decline";
      decline.setAttribute("onclick", `declineItem('${type}', '${obj._id}')`);

      buttons.appendChild(accept);
      buttons.appendChild(decline);
    } else {
      item.className = `${
        obj.status === "Approve" ? "approved" : "rejected"
      } request`;

      const updated = document.createElement("button");
      updated.className = `${
        obj.status === "Approve" ? "accept" : "decline"
      } updated`;
      updated.textContent = `${
        obj.status === "Approve" ? "Approved" : "Rejected"
      } by ${obj.updatedBy.nwi}`;
      buttons.appendChild(updated);
    }

    item.appendChild(info);
    item.appendChild(section);
    item.appendChild(buttons);

    list.append(item);
    item.scrollIntoView({ smooth: true });
  }
}

function acceptItem(type, _id) {
  if (type === "Leave") return updateLeave(_id, "Approve");
  updateClaim(_id, "Approve");
}

function declineItem(type, _id) {
  if (type === "Leave") return updateLeave(_id, "Reject");
  updateClaim(_id, "Reject");
}

/*   Claims   */

function updateClaim(_id, status) {
  const jsonData = JSON.stringify({
    _id: _id,
    status: status,
  });

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        loadClaims();
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("PUT", "http://localhost:3000/api/claims/");
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("x-auth-token", getToken());
  request.send(jsonData);
}

function loadClaims() {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);

        createItems(resObj, "Claim");
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("POST", "http://localhost:3000/api/claims/admin");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

/*   Leaves   */

function updateLeave(_id, status) {
  const jsonData = JSON.stringify({
    _id: _id,
    status: status,
  });

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        loadLeaves();
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("PUT", "http://localhost:3000/api/leaves/");
  request.setRequestHeader("Content-Type", "application/json");
  request.setRequestHeader("x-auth-token", getToken());
  request.send(jsonData);
}

function loadLeaves() {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);

        createItems(resObj, "Leave");
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("POST", "http://localhost:3000/api/leaves/admin");
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
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/notifications/count/admin");
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
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open(
    "GET",
    `http://localhost:3000/api/notifications/admin${isLimit ? "?limit=5" : ""}`
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
    li.classList.add(!obj.seen && obj.receiver === "User" ? "user" : "admin");
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
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("PUT", "http://localhost:3000/api/notifications/admin");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

/* Users */
function loadUsers() {
  if (window.sessionStorage.getItem("user"))
    window.sessionStorage.removeItem("user");

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);

        const container = document.getElementById("container");
        container.innerHTML = "";

        for (var obj of resObj) {
          const profile = document.createElement("div");
          profile.className = !obj.status ? "profile rejected" : "profile";

          const img = document.createElement("img");
          img.src =
            "https://imgv3.fotor.com/images/gallery/Realistic-Male-Profile-Picture.jpg";
          img.alt = "Employee Profile Picture";

          const name = document.createElement("h4");
          name.textContent = obj.nwi;

          const div = document.createElement("div");
          const email = document.createElement("p");
          email.textContent = obj.email;
          const position = document.createElement("p");
          position.textContent = obj.position.name;
          const department = document.createElement("p");
          department.textContent = obj.department.name;

          div.appendChild(email);
          div.appendChild(position);
          div.appendChild(department);

          const button = document.createElement("button");
          button.textContent = "View";
          button.setAttribute("onclick", `openUserProfile('${obj._id}')`);
          button.className = "reject";

          profile.appendChild(img);
          profile.appendChild(name);
          profile.appendChild(div);
          profile.appendChild(button);

          container.appendChild(profile);
        }
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/users/");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

function openUserProfile(_id) {
  window.sessionStorage.setItem("user", _id);
  window.location = "userProfile.html";
}

function loadUserProfile() {
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

        const btn = document.getElementById("btn");
        // btn.setAttribute("onclick", "changeUserStatus();");
        if (!resObj.status) {
          document.getElementById("left-column").classList.add("deactive");
          btn.className = "save-button";
          btn.textContent = "Activate User";
          document.getElementById(
            "updated"
          ).textContent = `Deactivated by ${resObj.updatedBy.nwi}`;
        }
        document.getElementById("dob2").value = resObj.dob;
        document.getElementById("email2").value = resObj.email;
        document.getElementById("mobile").value = resObj.mobile;

        const aObj = resObj.address;
        document.getElementById("line1").value = aObj.line1;
        document.getElementById("line2").value = aObj.line2;
        document.getElementById("line3").value = aObj.line3;
        document.getElementById("zipcode").value = aObj.zipcode;

        loadStatics({
          province: aObj.province.name,
          position: resObj.position.name,
          department: resObj.department.name,
        });

        loadStatus();
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open(
    "GET",
    `http://localhost:3000/api/users/user/${window.sessionStorage.getItem(
      "user"
    )}`
  );
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

function loadStatics(selected) {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState == 4) {
      const res = request.responseText;
      if (request.status == 200) {
        let resObj = JSON.parse(res);

        Object.keys(resObj).forEach((key) => {
          let tag = document.getElementById(
            `${
              key === "provinces"
                ? "province"
                : key === "positions"
                ? "position2"
                : "department2"
            }`
          );
          let value =
            key === "provinces"
              ? selected.province
              : key === "positions"
              ? selected.position
              : selected.department;
          for (var obj of resObj[key]) {
            var option = document.createElement("option");
            option.value = obj._id;
            option.innerText = obj.name;
            if (obj.name === value) option.selected = true;
            tag.append(option);
          }
        });
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/statics/user");
  request.send();
}

function updateUserProfile() {
  const oPassword = document.getElementById("oPassword");
  const password = document.getElementById("password");
  const cPassword = document.getElementById("cPassword");

  const data = {
    email: document.getElementById("email2").value,
    mobile: document.getElementById("mobile").value,
    dob: document.getElementById("dob2").value,
    position: document.getElementById("position2").value,
    department: document.getElementById("department2").value,
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
        window.location.reload();
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open(
    "PUT",
    `http://localhost:3000/api/users/user/${window.sessionStorage.getItem(
      "user"
    )}`
  );
  request.setRequestHeader("content-type", "application/json");
  request.setRequestHeader("x-auth-token", getToken());
  request.send(jsonData);
}

function changeUserStatus() {
  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        window.location.reload();
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open(
    "PUT",
    `http://localhost:3000/api/users/user/${window.sessionStorage.getItem(
      "user"
    )}`
  );
  request.setRequestHeader("content-type", "application/json");
  request.setRequestHeader("x-auth-token", getToken());
  request.send(JSON.stringify({ updateStatus: true }));
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
        document.getElementById("position").textContent = resObj.position.name;
        document.getElementById("email2").value = resObj.email;
        document.getElementById("mobile").value = resObj.mobile;
      } else {
        console.log("Bad Request", request.status, res);
        alert(res);
        if (request.status === 401) {
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/admins/admin");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}

function updateProfile() {
  const oPassword = document.getElementById("oPassword");
  const password = document.getElementById("password");
  const cPassword = document.getElementById("cPassword");

  const data = {
    email: document.getElementById("email2").value,
    mobile: document.getElementById("mobile").value,
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
          window.location = "../adminLogin.html";
        }
      }
    }
  };

  request.open("PUT", "http://localhost:3000/api/admins/");
  request.setRequestHeader("content-type", "application/json");
  request.setRequestHeader("x-auth-token", getToken());
  request.send(jsonData);
}
