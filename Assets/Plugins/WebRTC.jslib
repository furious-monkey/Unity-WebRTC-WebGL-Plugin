var LibraryUnityWebRTC = {

  $token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJiaW5nZXdhdmUtd2VicnRjIiwiaXNzIjoiYmluZ2V3YXZlLXdlYnJ0YyIsInN1YiI6Im1lZXQuYmluZ2V3YXZlLmNvbSIsInJvb20iOiIqIn0.NUvbPsKW9ahAyeTVMVEIGWrhLoPH8UJfRCvUbWhi5u0',
  $options:  {
    hosts: {
        domain: 'meet.bingewave.com',
        muc: `conference.meet.bingewave.com`,
    },
    serviceUrl: `https://meet.bingewave.com/http-bind`,
    clientNode: 'http://jitsi.org/jitsimeet',
    openBridgeChannel: true,
    resolution: 180,
  },

  $conferenceName: 'unity-demo',

  $connection: null,
  $isJoined: false,
  $room: null,

  $videoElements: {},
  $localTracks: [],
  $remoteTracks: {},

  onLocalTracks: function(tracks) {
    localTracks = tracks;
    if (isJoined) {
      for (let i = 0; i < localTracks.length; i++) {
        room.addTrack(localTracks[i]);
      }
    }
  },

  onRemoteTrack: function(track) {
    if (track.isLocal()) {
      return;
    }

    const participantId = track.getParticipantId();

    if (!remoteTracks[participantId]) {
      remoteTracks[participantId] = [];
    }
    remoteTracks[participantId].push(track);

    if (track.getType() == 'video') {
      // Video elements just get stored, they're accessed from Unity.
      const key = "participant-" + participantId;
      window.videoElements[key] = document.createElement('video');
      window.videoElements[key].autoplay = true;
      track.attach(window.videoElements[key]);
    }
    else {
      // Audio elements get added to the DOM (can be made invisible with CSS) so that the audio plays back.
      const audioElement = document.createElement('audio');
      audioElement.autoplay = true;
      audioElement.id = "audio-" + participantId;
      document.body.appendChild(audioElement);
      track.attach(audioElement);
    }
  },

  onConferenceJoined: function() {
    isJoined = true;
    for (let i = 0; i < localTracks.length; i++) {
      room.addTrack(localTracks[i]);
    }
  },

  onUserLeft: function(id) {
    if (!remoteTracks[id]) {
      return;
    }
    const tracks = remoteTracks[id];
    for (let i = 0; i < tracks.length; i++) {
      if (tracks[i].getType() == 'video') {
        const key = "participant-" + id;
        const videoElement = window.videoElements[key];
        if (videoElement) {
          tracks[i].detach(videoElement);
          delete window.videoElements[key];
        }
      }
      else {
        const audioElement = document.getElementById('audio-' + id);
        if (audioElement) {
          tracks[i].detach(audioElement);
          audioElement.parentNode.removeChild(audioElement);
        }
      }
    }
  },

  onConnectionSuccess: function() {
    room = connection.initJitsiConference(conferenceName, options);
    room.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrack);
    room.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
    room.on(JitsiMeetJS.events.conference.USER_JOINED, id => { remoteTracks[id] = []; });
    room.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
    room.join();
  },

  unload: function() {
    for (let i = 0; i < localTracks.length; i++) {
      localTracks[i].dispose();
    }
    room.leave();
    connection.disconnect();
  },

  connect: function() {
    JitsiMeetJS.init(options);
    connection = new JitsiMeetJS.JitsiConnection(null, token, options);
    connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
    connection.connect();
    JitsiMeetJS.createLocalTracks({devices: ["audio", "video"]})
      .then(onLocalTracks);
  }
};

mergeInto(LibraryManager.library, LibraryUnityWebRTC);