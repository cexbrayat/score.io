var http = require('http'),
io = require('./socket.io'),
fs = require('fs'),
url = require('url');
var server = http.createServer(function(req, res) {
    var path = url.parse(req.url).pathname;
    switch (path) {
    case '/score_client.js':
        res.writeHead(200, {'Content-Type' : 'text/javascript'});
		send(res, path);
		break;
    case '/score_client.html':
        res.writeHead(200, {'Content-Type' : 'text/html'});
		send(res, path);
		break;
    }
});

function send(res, path){
	fs.readFile('.' + path,
    function(err, data) {
        if (err) {
            res.writeHead(404);
            res.write('404');
        } else {
            res.write(data, 'utf8');
        }
        res.end();
    });
}

server.listen(1337, "127.0.0.1");
var socket = io.listen(server);
socket.on('connection',
function(client) {
    console.log('New player ' + client.sessionId);
    //send his id and score
    socket.broadcast({
        "type": "score",
        "id": client.sessionId,
        "score": 10
    })
    //on message
    client.on('message',
    function(msg) {
        //broadcast message to all players except sender
        socket.broadcast(msg, [msg.id]);
    })
    //on disconnect send id of the quitting player to other players
    client.on('disconnect',
    function() {
        socket.broadcast({
            "type": "quit",
            "id": client.sessionId
        })
    })
});
console.log('Server running at http://127.0.0.1:1337/');
