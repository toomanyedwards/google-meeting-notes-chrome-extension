
const API_KEY = 'AIzaSyBHH78gDxV2O5N_F7ZKxz-E1SNOP82citw';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const CLIENT_ID="370393194814-avjjeu46inmjr38cku9312crolphgftt.apps.googleusercontent.com";

const SCOPE=chrome.runtime.getManifest().oauth2.scopes.join(' ');
const ADD_NOTES_BUTTON_CLICKED_MSG = "ADD_NOTES_BUTTON_CLICKED_MSG";

/**
 * Initialize google api client
 */

onGAPILoad = async () => {
  console.log("Initializing gapi");
  
  await gapi.client.init(
    {
      apiKey: API_KEY,
      discoveryDocs: DISCOVERY_DOCS
    }
  );
  console.log("gapi initialized");

  await setGapiToken();
  
  listFiles();
/*
  console.log("gapi initialized 1");


  const token = await getChromeUserToken();
  console.log("gapi initialized 2");

  gapi.auth.setToken(
    {
    'access_token': token,
    }
  );

  console.log("gapi initialized 3");

  listFiles2();*/
  
}


  function listFiles2() {
    console.log("Listing files")
    gapi.client.drive.files.list({
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }).then(function(response) {
      console.log('Files:');
      var files = response.result.files;
      if (files && files.length > 0) {
        for (var i = 0; i < files.length; i++) {
          var file = files[i];
          console.log(file.name + ' (' + file.id + ')');
        }
        return "listFiles"
      } else {

        console.log('No files found.');
        return "damn"
      }
    });
  }

/**
 * Gets the token for the current chrome user
 * NOTE: Not guaranteed to google user logged into calendar
 */
const getChromeUserToken = () => 
  new Promise(
    (resolve) => {
      chrome.identity.getAuthToken(
        {interactive: true},
        (token) => {
          console.log(`Chrome user token is: ${token}`)
          resolve(token)
        }
      )
    }
  );



/**
 * Gets the user oauth token
 */
const getUserToken = async () => {
  const token = await getChromeUserToken();
  console.log(`User token: ${token}`)
  return token;
}

/**
 * Sets the google api client token
 */
const setGapiToken = async () => {
  const token = await getUserToken();
  console.log(`Setting gapi token to: ${token}`);

  // Set the gapi token
  gapi.auth.setToken({
    'access_token': token,
  });
}



/**
 * Handle the add notes button clicked
 */
const handleAddNotesButtonClicked = async () => {
  console.log("handleAddNotesButtonClicked");

  setGapiToken();
}


/**
 * Listen for messages from content script
 */
chrome.extension.onMessage.addListener(
  async (request, sender, sendResponse) => {
    console.log("Message received 1");
     setGapiToken();
  
    console.log("Message received 2");
    listFiles2();
    console.log("Message received 3");

    
    switch(request.message) {
      case ADD_NOTES_BUTTON_CLICKED_MSG: 
        handleAddNotesButtonClicked();
    }
    
  }
);

const listFiles = async () => {
  console.log("Listing files")
  response = await gapi.client.drive.files.list(
    {
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }
  );

  response.result.files.forEach(
    (file)  => {
      console.log(`${file.name} (${file.id})`)
    }
  ); 
}