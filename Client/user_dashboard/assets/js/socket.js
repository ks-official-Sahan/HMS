/*  Community Forum  */

// // initiate connection
const socket = io("http://localhost:3000", { auth: { token: getToken() } });
// // check connection
// socket.on("connect", () => {
//   console.log(`You connected with id: ${socket.id}`);
// });

// listening on event receive-message
socket.on("receive-message", (message, username) => {
  // console.log(message, username);
  displayMessage(message, username);
});

// log errors to the console if any
socket.on("client_error", (error) => {
  console.log(error);
});
socket.on("server-error", (error) => {
  console.log(error);
});

socket.on("delete-by-admin", (msg, _id) => {
  updateMessage(_id, msg);
});

function updateMessage(_id, msg) {
  const message = document.getElementById(_id);
  message.textContent = msg;
}

// add msg to the display
function displayMessage(obj, user) {
  const list = document.getElementById("comment-list");

  const div = document.createElement("div");

  const name = document.createElement("span");
  name.textContent = user;
  div.append(name);

  const dateTxt = document.createElement("span");
  dateTxt.textContent = formatDateTime(obj.date);
  div.append(dateTxt);

  const p = document.createElement("p");
  p.textContent = obj.message;
  p.id = obj._id;

  let classes = `comment ${user === "Me" ? " right" : " left"} `;
  if (obj.isAdmin) classes = "comment admin";

  const li = document.createElement("li");
  li.className = classes;
  li.appendChild(p);
  li.appendChild(div);

  list.append(li);
  li.scrollIntoView({ smooth: true });
}

document.getElementById("send-btn").addEventListener("click", (e) => {
  e.preventDefault();
  sendMessage();
});

function sendMessage() {
  let message = document.getElementById("message");

  if (message.value.trim() !== "") {
    // displayMessage(
    //   {
    //     date: new Date(),
    //     message: message.value,
    //     user: { isAdmin: false },
    //   },
    //   "Me"
    // );
    socket.emit("send-message", message.value, displayMessage);
    message.value = "";
  }
}

// get old massages when a user will log in to the community
function loadMessages() {
  const list = document.getElementById("comment-list");
  list.innerHTML = "";

  const request = new XMLHttpRequest();

  request.onreadystatechange = function () {
    if (request.readyState === 4) {
      const res = request.responseText;
      if (request.status === 200) {
        let resObj = JSON.parse(res);

        for (var obj of resObj) {
          // display Messages
          displayMessage(obj, obj.isAdmin ? obj.admin.nwi : obj.user.nwi);
        }
      } else {
        console.log("Bad Request", request.status, res);
        // alert(res);
        if (request.status === 401) {
          window.location = "../login.html";
        }
      }
    }
  };

  request.open("GET", "http://localhost:3000/api/community");
  request.setRequestHeader("x-auth-token", getToken());
  request.send();
}
