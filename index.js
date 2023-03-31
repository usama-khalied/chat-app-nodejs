const express = require("express");
const app = express();
const http = require("http").createServer(app);
const server = require('http').Server(app);
const io = require("socket.io")(http);
const ios = require("socket.io")(server);

const mongoose = require("mongoose");
const { v4: uuidV4 } = require('uuid')
const { ExpressPeerServer } = require("peer");

const peer = ExpressPeerServer(server , {
  debug:true
});
const mongodbUrl = "mongodb://localhost:27017/chatApp";

async function connectToDatabase() {
  try {
    await mongoose.connect(mongodbUrl);
    console.log("Connected to database!");
  } catch (error) {
    console.error("Error connecting to database:", error);
  }
}

connectToDatabase();

const Msg = {
  name: {
    type: String,
    required: true,
  },
  message: {
    type: String,
    required: true,
  },
};
const MsgSchema = mongoose.model("Chatmessage", Msg);

const PORT = process.env.PORT || 3000;

http.listen(PORT, () => {
  console.log(`Server running of port ${PORT}`);
});

// app.use(express.static(__dirname + "/public"));
app.use(express.static('public'))
// app.use('/peerjs', peer);
// app.get('/' , (req,res)=>{
//   res.send(uuidv4());
// });
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.get('/video', (req, res) => {
  res.redirect(`/${uuidV4()}`)
})
app.set('view engine', 'ejs')


// io.on('connection',(socket) => {
//     socket.on('message',(msg) => {
//         const message  =  new MsgSchema({msg});
//         message.save().then(() => {
//             socket.broadcast.emit('message',msg);
//         })
//     })
// });

io.on("connection", (socket) => {
  MsgSchema.find().then((result) => {
    socket.emit("messages", result);
  });
  socket.on("message", (msg) => {
    const message = new MsgSchema(msg);
    // message.save().then(() => {
    socket.broadcast.emit("message", msg);
    // });
  });
  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", name);
  });
 
});


// Video calling source code 

app.get('/:room',(req,res) => {
  res.render('room',{roomId:req.params.room})
})
