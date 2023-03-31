let socket = io();
var na;
// const peer = new Peer();
let textarea = document.querySelector("#textarea");
let messageArea = document.querySelector(".message_area");
let name = "Usama";

let bodcastmessage  =  document.querySelector('#bodcast');

const startButton = document.getElementById('start-button');


var typing=false
do {
  name = prompt("Please enter your name..");
} while (!name);

textarea.addEventListener("keyup", (e) => {
  typing=true
  if (e.key === "Enter") {
    let value = e.target.value;
    sendMessage(value);
    textarea.value = "";
  }
});

function sendMessage(msg1) {
  let msg = {
    name: name,
    message: msg1.trim(),
    // message:msg1
  };
  appenedMessage(msg, 'outgoing');
  scrollToBottom();
  socket.emit("message", msg);
}
function appenedMessage(msgs, type) {
  let maindiv = document.createElement("div");
  let className = type;
  maindiv.classList.add(className, "message");
  let markup = `<h4>${msgs.name}</h4>
<p>${msgs.message}</p>
`;
  maindiv.innerHTML = markup;
  messageArea.appendChild(maindiv);
}

socket.on("message", (msg) => {
  appenedMessage(msg,'incoming');
});
socket.on("messages", (msg) => {
  console.log(msg)
  if(msg.length) {
    msg.forEach(element => {
      if(element.name!==name) {
        appenedMessage(element, 'incoming');
      }
      else {
        appenedMessage(element,'outgoing');
      }
    });
  }
});

function scrollToBottom() {
  messageArea.scrollTop = messageArea.scrollHeight;
}

textarea.addEventListener("keypress", logKey);

function logKey(e) {
  socket.emit("typing", name);
}
socket.on("typing", (name) => {
  bodcast.innerHTML = `<p>${name}</em> is typing...</p>`;
  setTimeout(() => {
    bodcast.innerHTML = "";
  }, 3000);
});



