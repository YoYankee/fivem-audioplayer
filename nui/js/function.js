let playlist = [];
let currentSongIndex = 0;
let player = null;
let muted = false;

const audioPlayer = document.querySelector(".audio-player");
const volumeSlider = audioPlayer.querySelector(".controls .volume-slider");
const timeline = audioPlayer.querySelector(".timeline");
const volumeEl = audioPlayer.querySelector(".volume-container .volume");
const playBtn = audioPlayer.querySelector(".controls .toggle-play");

function _loadPlaylist() {
    let xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
            playlist = JSON.parse(xhr.responseText);
            document.getElementById('play-name').textContent = playlist[0].name;
        }
    };
    xhr.open("GET", "http://localhost/songlist.php?action=getPlaylist", true);
    xhr.send();
}

function _playSong(index) {
    currentSongIndex = index;
    let song = playlist[currentSongIndex];
    if (player) {
        player.stop();
        player.unload();
    }
    player = new Howl({
        src: song.url,
        onend: _playNext,
        onloaderror: _onerror
    });
    player.play();
    player.once('load', function(){
        audioPlayer.querySelector(".time .length").textContent = _getTimeCodeFromNum(player.duration());
    });
    player.once('play', function() {
        document.getElementById('play-name').textContent = playlist[currentSongIndex].name;
        player.fade(0.2, 0.75, 5000);
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");
    });
}

function _onerror(_, error) {
    console.log('[AUDIO PLAYER] Unexpected error: ' + error);
    currentSongIndex = 0;
    _playSong(currentSongIndex);
}

function _clickPlay() {
    if (player) {
        _playPause();
        return;
    }
    _playSong(currentSongIndex);
}

function _playPause() {
    if (!player) return;
    if (player.playing()) {
        player.pause();
        playBtn.classList.remove("pause");
        playBtn.classList.add("play");
    } else {
        player.play();
        playBtn.classList.remove("play");
        playBtn.classList.add("pause");
    }

}

function _playNext() {
    let newIndex = currentSongIndex + 1;
    if (newIndex >= playlist.length) {
        newIndex = 0;
    }
    _playSong(newIndex);
}

function _playPrevious() {
    let newIndex = currentSongIndex - 1;
    if (newIndex < 0) {
        newIndex = playlist.length - 1;
    }
    _playSong(newIndex);
}

function _updateTimeLine(e) {
    if (player.playing()) {
        const timelineWidth = window.getComputedStyle(timeline).width;
        const timeToSeek = e.offsetX / parseInt(timelineWidth) * player.duration();
        player.seek(timeToSeek);
    }
}

function _updateVolumeSlider(e) {
    const sliderWidth = window.getComputedStyle(volumeSlider).width;
    const newVolume = e.offsetX / parseInt(sliderWidth);
    player.volume(newVolume);
    audioPlayer.querySelector(".controls .volume-percentage").style.width = newVolume * 100 + '%';
}

function _toggleVolume() {
    muted = !muted;
    if (muted) {
        player.mute(true);
        volumeEl.classList.remove("icono-volumeMedium");
        volumeEl.classList.add("icono-volumeMute");
    } else {
        player.mute(false);
        volumeEl.classList.add("icono-volumeMedium");
        volumeEl.classList.remove("icono-volumeMute");
    }
}

function _getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;
    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
    ).padStart(2, 0)}`;
}

function _toggleAudioPlayer(state) {
    state ? audioPlayer.style.visibility = '' : audioPlayer.style.visibility = 'hidden';
}
