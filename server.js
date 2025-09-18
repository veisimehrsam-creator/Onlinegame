const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

app.use(express.static("public"));

let rooms={};

io.on("connection",socket=>{
    socket.on("joinRoom",(room)=>{
        socket.join(room);
        if(!rooms[room]) rooms[room]=[];
        rooms[room].push(socket.id);
        socket.emit("playerNumber", rooms[room].length);
        if(rooms[room].length===2) io.to(room).emit("start");
    });

    socket.on("move",({index,symbol,room})=>{
        socket.to(room).emit("move",{index,symbol});
    });

    socket.on("disconnect",()=>{
        for(let r in rooms){
            rooms[r]=rooms[r].filter(id=>id!==socket.id);
            if(rooms[r].length===0) delete rooms[r];
        }
    });
});

const PORT=process.env.PORT||3000;
http.listen(PORT,()=>console.log("Server running on port",PORT));
