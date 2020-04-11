console.log("hello world");

FBInstant.initializeAsync()
  .then(function()
  {
      
  // Start loading game assets here
    var progress = 0;

    setInterval(function()
    {
        progress+=3;
        FBInstant.setLoadingProgress(progress);
    },100);

    console.log("loaded");
  }
);

//https://www.facebook.com/embed/instantgames/2856444467764438/player?game_url=https://localhost:8080
