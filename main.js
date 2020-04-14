console.log("hello world");

function playedPlayers() {
  var contextPlayers = FBInstant.context.getPlayersAsync()
  .then(function(players) {
    console.log(players.map(function(player) {
    return {
      cid: FBInstant.context.getID(),
      pid: player.getID(),
      name: player.getName(),
    }
    }));
  });
}

function sendMessage() {
  let player = FBInstant.player.getName();
  let playerPhoto = FBInstant.player.getPhoto();
  let payload = {
    action: 'CUSTOM',
    cta: "I'm In ",
    text: {
      default: player + ' has invited you to play ThreeNoughtFour',
    },
    template: 'play_turn',
    data: { myCustomData: '42' },
    strategy: 'IMMEDIATE',
    notification: 'NO_PUSH'
  };

  toDataURL(
    playerPhoto,
    function(dataUrl) {
      payload.image = dataUrl;
      // This will post a custom update.
      // If the game is played in a messenger chat thread,
      // this will post a message into the thread with the specified image and text message.
      // When others launch the game from this message,
      // those game sessions will be able to access the specified blob
      // of data through FBInstant.getEntryPointData()
      FBInstant.updateAsync(payload).then(function() {
        display.success('Message was posted!');
      }).catch(function(error) {
        display.error('Message was not posted: ' + error.message);
      });
    }
  );
}

function chooseContext() {
  FBInstant.context.chooseAsync().then(function() {
    sendMessage();
  });
}

function toDataURL(src, callback) {
  let img = new Image();
  img.crossOrigin = 'Anonymous';
  img.onload = function() {
    let canvas = document.createElement('CANVAS');
    canvas.height = 533;
    canvas.width = 960;
    canvas.getContext('2d').drawImage(this, 0, 0, 960, 533);
    callback(canvas.toDataURL());
  };
  img.src = src;
}

FBInstant.initializeAsync()
  .then(function()
  {
    $('#canvas').hide();
  // Start loading game assets here
    var progress = 0;
    
    var interval = setInterval(function()
    {
        progress+=3;
        FBInstant.setLoadingProgress(progress);

        if (progress > 95)
        {
          clearInterval(interval);
          FBInstant.startGameAsync()
            .then(function () 
            {
              $('#canvas').show();
              console.log("The game has been started");

              var playerId = FBInstant.player.getID();
              var playerName = FBInstant.player.getName();
              var playerPhoto = FBInstant.player.getPhoto(); // return url to the player photo
              document.getElementById("myImage").src = playerPhoto;
              console.log(playerId, playerName, playerPhoto);

              playedPlayers();
            });
        }

    },100);

    console.log("loaded");
  }
);

//https://www.facebook.com/embed/instantgames/2856444467764438/player?game_url=https://localhost:8080
//http-server --ssl -c-1 -p 8080 -a 127.0.0.1 
