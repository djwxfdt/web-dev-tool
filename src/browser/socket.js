let WebSocketServer = null;
var ws = null;

module.exports.open = (data,mainWindow) => {
    if (!WebSocketServer) {
        WebSocketServer = require('ws').Server;
        ws = new WebSocketServer({port: data.port,host:'0.0.0.0'})
    }

    ws.on('connection', function(socket) {
        mainWindow.webContents.send('socket',{type:"clear",data:""});

        socket.onmessage = (e)=>{
            console.info(e.data)
            mainWindow.webContents.send('socket',{type:"data",data:e.data});
        };
        socket.onclose = ()=>{
            console.log("ws closed!")
        };
        socket.onerror = (error)=>{
            console.error(error);
        };
        socket.onopen = ()=>{
            mainWindow.webContents.send('socket',{type:"ready"});
            console.log("ws established!")
        };
    });

    console.log("Server is listening:", data.port);
};
