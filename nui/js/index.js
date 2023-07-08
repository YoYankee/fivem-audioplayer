setInterval(() => {
    if (player) {
        const progressBar = audioPlayer.querySelector(".progress");
        progressBar.style.width = player.seek() / player.duration() * 100 + "%";
        audioPlayer.querySelector(".time .current").textContent = _getTimeCodeFromNum(
            player.seek()
        );
    }
}, 500);

window.addEventListener('message', function(e)
{
    let data = e.data;
    if (data.type === 'audio_player') {
        if (data.action === 'toggle') {
            _toggleAudioPlayer(data.state);
        }
        if (data.action === 'playPause') {
            _playPause();
        }
    }
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'F7') {
        console.log('F7键按下');
        post('https://audio-player/closeCursor');
    }
});


window.post = (url, data) => {
    var request = new XMLHttpRequest();
    request.open('POST', url, true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(data);
}