var connected = false;
var score = 10;
var playerId;
var socket = new io.Socket('localhost', {
    'port': 1337
});
socket.on('connect', function(){ updateConnectButton() });
socket.on('message',
function(msg) {
    switch (msg.type) {
    case 'quit':
        removePlayer(msg.id);
        break;
    case 'score':
        if (!connected) {
            connected = true;
            playerId = msg.id;
            updateCurrentPlayer(playerId, msg.score);
        } else {	
            if ($("#player" + msg.id).size()){
				updateScore(msg.id.toString(), msg.score.toString());}
            else {
            	addPlayer(msg.id, msg.score);
				sendScore(score);
			}
        }
        break;
    default:
        break;
    }
});
socket.on('disconnect', function(){ location.reload() });
function connect() {
    if (!connected)
    	socket.connect();
    else
    	socket.disconnect();
}
function updateConnectButton() {
    $('#connect').val('Disconnect');
}
function updateCurrentPlayer(id, newScore) {
    $('#playerId').text('Connected');
	score = newScore;
	addPlayer(id, score);
	$('#player' + id).addClass('first');
}
function sendScore(newScore) {
	score = newScore;
    socket.send({ "type" : "score", "id" : playerId, "score" : score });
	updateScore(playerId, newScore)
	$('#player' + playerId).addClass('first');
}
function removePlayer(id) {
    $('#player' + id).remove();
}
function addPlayer(id, newScore){
	$(".row").append(scoreDiv(id, newScore));
}
function updateScore(id, newScore){
	$("#player" + id).replaceWith(scoreDiv(id, newScore));	
}
function scoreDiv(id, newScore){
	return '<div class="player" id="player' + id + '"><label class="id" id="score' + id + '">' + id + '</label></p><label class="score">' + newScore+ '</label></div>'
}