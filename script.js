const socket = io();
let player=0,room=null;
let cells=Array(9).fill(null);
const board=document.getElementById("board"),status=document.getElementById("status");

socket.emit("join");
socket.on("playerNumber",n=>{player=n; status.innerText=`شما بازیکن ${player} هستید`});
socket.on("start",()=>{status.innerText="شروع بازی!"; render();});
socket.on("move",({index,symbol})=>{cells[index]=symbol; render();});

function render(){board.innerHTML="";cells.forEach((c,i)=>{const d=document.createElement("div");d.className="cell";d.innerText=c||"";d.onclick=()=>makeMove(i);board.appendChild(d);})}
function makeMove(i){if(cells[i])return;const s=player===1?"❌":"⭕";cells[i]=s;socket.emit("move",{index:i,symbol:s,room:room}); render();}
