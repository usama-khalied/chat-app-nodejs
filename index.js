const express =  require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const mongoose = require('mongoose');


const mongodbUrl =  "mongodb://localhost:27017/chatApp";


async function connectToDatabase() {
    try {
      await mongoose.connect(mongodbUrl);
      console.log('Connected to database!');
    } catch (error) {
      console.error('Error connecting to database:', error);
    }
  }
  
  connectToDatabase();

  const Msg  = {
    name: {
      type: String,
      required: true
  },
    message: {
    type:String,
    required: true
  }
}
  const MsgSchema = mongoose.model("Chatmessage", Msg);
  
  



const PORT = process.env.PORT || 3000

http.listen(PORT,() => {
    console.log(`Server running of port ${PORT}`)
});

app.use(express.static(__dirname+ '/public'))
app.get('/',(req,res) => {
    res.sendFile(__dirname + '/index.html')
});



// io.on('connection',(socket) => {
//     socket.on('message',(msg) => {
//         const message  =  new MsgSchema({msg});
//         message.save().then(() => {
//             socket.broadcast.emit('message',msg);
//         })
//     })
// });

io.on('connection',(socket) => {
  MsgSchema.find().then(result => {
        socket.emit('messages',result)
  })
  socket.on('message',msg => {
    const message  =  new MsgSchema(msg);
    // message.save().then(() => {
        socket.broadcast.emit('message',msg);
    // });
  });
  socket.on("typing", (name) => {
    socket.broadcast.emit("typing", name);
  });
});


 








