const client = AgoraRTC.createClient({mode:'rtc', codec:'vp8'})

const getServerUrl = () => {
    // Use same origin - Vite proxy will forward /rtc/* to backend
    return window.location.origin;
};

let options =
{
    // Pass your App ID here.
    appId: '559b352c195f4ac2bd1940c9607119a2',
    // Set the channel name.
    channel: localStorage.getItem("curID"),
    // Pass your temp token here.
    token: '',
    // Set the user ID.
    uid: 0,
    // Set the user role.
    role: '',
    // Set token expire time.
    ExpireTime: 3600,
    // Dynamically determine the backend server URL
    serverUrl: getServerUrl()
};

async function FetchToken()
{
   var role;
   if(options.role=='Broadcaster')
   {
       role=1;
   }
   else
   {
       role=2;
   }
   
   try {
       const response = await fetch(
           options.serverUrl+'/rtc/'+options.channel+'/'+role+'/uid/'+options.uid+'/?expiry='+ options.ExpireTime
       );
       
       if (!response.ok) {
           throw new Error(`HTTP error! status: ${response.status}`);
       }
       
       const data = await response.json();
       console.log(data.rtcToken);
       return data.rtcToken;
   } catch (error) {
       console.log(error);
       throw error;
   }
}

let localTracks = []
let remoteUsers = {}

let joinAndDisplayLocalStream = async () => {

    client.on('user-published', handleUserJoined)
    
    client.on('user-left', handleUserLeft)
    
    options.token=await FetchToken();

    options.uid = await client.join(options.appId, options.channel, options.token, null)

    localTracks = await AgoraRTC.createMicrophoneAndCameraTracks() 

    let player = `<div class="video-container" id="user-container-${options.uid}">
                        <div class="video-player" id="user-${options.uid}"></div>
                  </div>`
    document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

    localTracks[1].play(`user-${options.uid}`)
    
    await client.publish([localTracks[0], localTracks[1]])
}

let joinStream = async () => {
    await joinAndDisplayLocalStream()
    document.getElementById('join-btn').style.display = 'none'
    document.getElementById('stream-controls').style.display = 'flex'
}

let handleUserJoined = async (user, mediaType) => {
    remoteUsers[user.uid] = user 
    await client.subscribe(user, mediaType)

    if (mediaType === 'video'){
        let player = document.getElementById(`user-container-${user.uid}`)
        if (player != null){
            player.remove()
        }

        player = `<div class="video-container" id="user-container-${user.uid}">
                        <div class="video-player" id="user-${user.uid}"></div> 
                 </div>`
        document.getElementById('video-streams').insertAdjacentHTML('beforeend', player)

        user.videoTrack.play(`user-${user.uid}`)
    }

    if (mediaType === 'audio'){
        user.audioTrack.play()
    }
}

let handleUserLeft = async (user) => {
    delete remoteUsers[user.uid]
    document.getElementById(`user-container-${user.uid}`).remove()
}

let leaveAndRemoveLocalStream = async () => {
    for(let i = 0; localTracks.length > i; i++){
        localTracks[i].stop()
        localTracks[i].close()
    }

    await client.leave()
    document.getElementById('join-btn').style.display = 'block'
    document.getElementById('stream-controls').style.display = 'none'
    document.getElementById('video-streams').innerHTML = ''
}

let toggleMic = async (e) => {
    if (localTracks[0].muted){
        await localTracks[0].setMuted(false)
        e.target.innerText = 'Mic on'
        e.target.style.backgroundColor = 'cadetblue'
    }else{
        await localTracks[0].setMuted(true)
        e.target.innerText = 'Mic off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

let toggleCamera = async (e) => {
    if(localTracks[1].muted){
        await localTracks[1].setMuted(false)
        e.target.innerText = 'Camera on'
        e.target.style.backgroundColor = 'cadetblue'
    }else{
        await localTracks[1].setMuted(true)
        e.target.innerText = 'Camera off'
        e.target.style.backgroundColor = '#EE4B2B'
    }
}

document.getElementById('join-btn').addEventListener('click', joinStream)
document.getElementById('leave-btn').addEventListener('click', leaveAndRemoveLocalStream)
document.getElementById('mic-btn').addEventListener('click', toggleMic)
document.getElementById('camera-btn').addEventListener('click', toggleCamera)