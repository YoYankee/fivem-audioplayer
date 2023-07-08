local audioPlayerState = true
local cursor = false

RegisterNetEvent('audio-player:client:toggle')
AddEventHandler('audio-player:client:toggle', function (state)
    SendNUIMessage({
        type = 'audio_player',
        action = 'toggle',
        state = state
    })
    if not state then
        SetNuiFocus(false, false)
    end
end)

RegisterNetEvent('audio-player:client:playPause')
AddEventHandler('audio-player:client:playPause', function (state)
    SendNUIMessage({
        type = 'audio_player',
        action = 'playPause',
        state = true
    })
end)

RegisterNUICallback('closeCursor', function(data, cb)
    cursor = not cursor
    SetNuiFocus(false, cursor)
    cb('ok')
end)

RegisterCommand('+audio_player', function()
    audioPlayerState = not audioPlayerState
    TriggerEvent('audio-player:client:toggle', audioPlayerState)
end)

RegisterCommand('+playorpause', function()
    TriggerEvent('audio-player:client:playPause')
end)

RegisterCommand('+showcursor', function()
    cursor = not cursor
    SetNuiFocus(true, cursor)
end)

RegisterKeyMapping('+audio_player', '音乐播放器', 'keyboard', 'f2')
RegisterKeyMapping('+playorpause', '播放停止音乐', 'keyboard', 'f3')
RegisterKeyMapping('+showcursor', '显示光标', 'keyboard', 'f4')