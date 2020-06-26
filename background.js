
const API_KEY = 'AIzaSyBHH78gDxV2O5N_F7ZKxz-E1SNOP82citw';
const DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/drive/v3/rest"];
const CLIENT_ID="370393194814-avjjeu46inmjr38cku9312crolphgftt.apps.googleusercontent.com";
//const CLIENT_ID="370393194814-fp37ukaq7e8ugclb4a9focsfrh4i6g3r.apps.googleusercontent.com";

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

  chrome.identity.getAuthToken(
    {interactive: true}, 
    function(token) {
      gapi.auth.setToken(
        {
        'access_token': token,
        }
      );  
      console.log('got auth token1 ')
      chrome.identity.getProfileUserInfo(function(info) { email = info.email; console.log(`email: ${JSON.stringify(info)}`)});

      listFiles2()
    }
  );

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

  //setGapiToken();

  //listFiles();
}

/*//
function onGAPILoad() {
  gapi.client.init({
    // Don't pass client nor scope as these will init auth2, which we don't want
    // clientId: CLIENT_ID,
    // scope: SCOPES,
    apiKey: API_KEY,
    discoveryDocs: DISCOVERY_DOCS,
  }).then(function () {
    console.log(`gapi initialized: ${new Date()}`)
    
    chrome.identity.getAuthToken(
      {interactive: true}, 
      function(token) {
        gapi.auth.setToken(
          {
          'access_token': token,
          }
        );
        console.log('got auth token1 ')
        chrome.identity.getProfileUserInfo(function(info) { email = info.email; console.log(`email: ${JSON.stringify(info)}`)});

        listFiles()
      }

   )  
  }, function(error) {
    console.log('error', error)
  });
}
*/


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
  (request, sender, sendResponse) => {
    console.log("Message received");
    switch(request.message) {
      case ADD_NOTES_BUTTON_CLICKED_MSG: 
        handleAddNotesButtonClicked();
    }
  }
);

const listFiles = async () => {
  console.log("Listing files")
  result = await gapi.client.drive.files.list(
    {
      'pageSize': 10,
      'fields': "nextPageToken, files(id, name)"
    }
  );

  files.forEach(
    (file)  => {
      console.log(`${file.name} (${file.id})`)
    }
  ); 
  
}

/*    function listFiles() {
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
 * 
 * Error 400: redirect_uri_mismatch
The redirect URI in the request, https://pfdpgmombdlemcndjbhmnhnbjdgcnmic.chromiumapp.org/oauth2, does not match the ones authorized for the OAuth client. To update the authorized redirect URIs, visit: https://console.developers.google.com/apis/credentials/oauthclient/370393194814-fp37ukaq7e8ugclb4a9focsfrh4i6g3r.apps.googleusercontent.com?project=370393194814
 */
/*
testAuth1 = () => {
  const client_id = chrome.runtime.getManifest().oauth2.client_id;
  const scope = chrome.runtime.getManifest().oauth2.scopes.join(' ');
  const redirect_url = chrome.identity.getRedirectURL("oauth2");
  var auth_url_base  = 'https://accounts.google.com/o/oauth2/v2/auth';

  const auth_params = {
    client_id: client_id,
    redirect_uri: redirect_url,
    response_type: 'code',
    access_type: 'offline',
    scope: scope
  };
  
  const auth_url = auth_url_base + '?' + $.param(auth_params);
  
  console.log(`client_id: ${client_id}`);
  console.log(`scope: ${scope}`);
  console.log(`redirect_url: ${redirect_url}`);
  console.log(`auth_url: ${auth_url}`)

  chrome.identity.launchWebAuthFlow(
    {url: auth_url, interactive: true}, 
    responseURL => {
      console.log(`responseURL: ${responseURL}`)
    }
  )
}

/**
 * Error 400: redirect_uri_mismatch
 */
/*
testAuth2 = () => {
  var client_id = '370393194814-avjjeu46inmjr38cku9312crolphgftt.apps.googleusercontent.com';
  const scope = ;;
  const redirect_url = chrome.identity.getRedirectURL("oauth2");
  var auth_url_base  = 'https://accounts.google.com/o/oauth2/v2/auth';

  const auth_params = {
    client_id: client_id,
    redirect_uri: redirect_url,
    response_type: 'code',
    access_type: 'offline',
    scope: scope
  };
  
  const auth_url = auth_url_base + '?' + $.param(auth_params);
  
  console.log(`client_id: ${client_id}`);
  console.log(`scope: ${scope}`);
  console.log(`scope: ${scope}`);
  console.log(`auth_url: ${auth_url}`)

  chrome.identity.launchWebAuthFlow(
    {url: auth_url, interactive: true}, 
    responseURL => {
      console.log(`responseURL: ${responseURL}`)
    }
  )
}

/**
 * Get dialog, but no response url returned
 */
/*
testAuth3 = () => {
  var client_id = '370393194814-avjjeu46inmjr38cku9312crolphgftt.apps.googleusercontent.com';
  const scope = chrome.runtime.getManifest().oauth2.scopes.join(' ');
  const redirect_url = "http://localhost";
  var auth_url_base  = 'https://accounts.google.com/o/oauth2/v2/auth';

  const auth_params = {
    client_id: client_id,
    redirect_uri: redirect_url,
    response_type: 'code',
    access_type: 'offline',
    scope: scope
  };
  
  const auth_url = auth_url_base + '?' + $.param(auth_params);
  
  console.log(`client_id: ${client_id}`);
  console.log(`scope: ${scope}`);
  console.log(`scope: ${scope}`);
  console.log(`auth_url: ${auth_url}`)

  chrome.identity.launchWebAuthFlow(
    {url: auth_url, interactive: true}, 
    responseURL => {
      console.log(`responseURL: ${responseURL}`)
    }
  )
}

/**
 * Error 400: redirect_uri_mismatch
The redirect URI in the request, https://pfdpgmombdlemcndjbhmnhnbjdgcnmic.chromiumapp.org/, does not match the ones authorized for the OAuth client. To update the authorized redirect URIs, visit: https://console.developers.google.com/apis/credentials/oauthclient/370393194814-fp37ukaq7e8ugclb4a9focsfrh4i6g3r.apps.googleusercontent.com?project=370393194814
 */
/*
testAuth4 = () => {
  var client_id = '370393194814-fp37ukaq7e8ugclb4a9focsfrh4i6g3r.apps.googleusercontent.com';
  const scope = chrome.runtime.getManifest().oauth2.scopes.join(' ');
  const redirect_url = 'https://pfdpgmombdlemcndjbhmnhnbjdgcnmic.chromiumapp.org/'
  var auth_url_base  = 'https://accounts.google.com/o/oauth2/v2/auth';

  const auth_params = {
    client_id: client_id,
    redirect_uri: redirect_url,
    response_type: 'code',
    access_type: 'offline',
    scope: scope
  };
  
  const auth_url = auth_url_base + '?' + $.param(auth_params);
  
  console.log(`client_id: ${client_id}`);
  console.log(`scope: ${scope}`);
  console.log(`redirect_url: ${redirect_url}`);
  console.log(`auth_url: ${auth_url}`)

  chrome.identity.launchWebAuthFlow(
    {url: auth_url, interactive: true}, 
    responseURL => {
      console.log(`responseURL: ${responseURL}`)
    }
  )
}


testAuth5 = () => {
  var auth_url = 'https://accounts.google.com/o/oauth2/auth';
var client_id = '370393194814-fp37ukaq7e8ugclb4a9focsfrh4i6g3r.apps.googleusercontent.com';
var redirect_url = 'http://localhost'
var auth_params = {
    client_id: client_id,
    redirect_uri: redirect_url,
    response_type: 'token',
    scope: 'profile'
};
auth_url += '?' + $.param(auth_params);
console.log(auth_url);
chrome.identity.launchWebAuthFlow({url: auth_url, interactive: true}, function(responseUrl) { console.log(responseUrl); });
}

const testAuth6 = () =>
{
  let authURL = 'https://accounts.google.com/o/oauth2/v2/auth';
const redirectURL = "http://localhost"
const auth_params = {
  client_id: '370393194814-fp37ukaq7e8ugclb4a9focsfrh4i6g3r.apps.googleusercontent.com',
  redirect_uri: redirectURL,
  response_type: 'code',
  access_type: 'offline',
  scope: 'https://www.googleapis.com/auth/spreadsheets',
};
authURL += '?' + $.param(auth_params);
chrome.identity.launchWebAuthFlow({url: authURL, interactive: true}, responseURL => console.log(responseURL))
}
  // Listen for messages from inject.js
chrome.extension.onMessage.addListener(
  (request, sender, sendResponse) => {
  
    // Get the token
    console.log(`handlingClick: ${JSON.stringify(request)}`)

    testAuth6();
/*
    //var auth_url = 'https://accounts.google.com/o/oauth2/auth';
    //var auth_url =  'https://accounts.google.com/o/oauth2/v2/auth';
    //var client_id = '370393194814-avjjeu46inmjr38cku9312crolphgftt.apps.googleusercontent.com';
    var clientId = chrome.runtime.getManifest().oauth2.client_id;
    //var clientId = 'pfdpgmombdlemcndjbhmnhnbjdgcnmic'
    var scope = chrome.runtime.getManifest().oauth2.scopes.join(' ');

    console.log(`client_id: ${clientId}`)
    console.log(`scope: ${scope}`)



    //const REDIRECT_URL = chrome.identity.getRedirectURL("oauth2");
    //const REDIRECT_URL = "https://localhost"
    const REDIRECT_URL = 'https://pfdpgmombdlemcndjbhmnhnbjdgcnmic.chromiumapp.org/'
    const CLIENT_ID = chrome.runtime.getManifest().oauth2.client_id;
    const SCOPES = ["openid", "email", "profile", "https://www.googleapis.com/auth/drive"];
    const AUTH_URL =
    `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&response_type=token&redirect_uri=${encodeURIComponent(REDIRECT_URL)}&scope=${encodeURIComponent(SCOPES.join(' '))}`;

    console.log(`AUTH_URL: ${AUTH_URL}`)

    chrome.identity.launchWebAuthFlow(
      {url: AUTH_URL, interactive: true}, 
      responseURL => {
        console.log(`responseURL: ${responseURL}`)
        chrome.identity.getProfileUserInfo(
          (info) => { 
            email = info.email; 
            console.log(`email: ${JSON.stringify(info)}`)
            listFiles()
          }
        );
      }
    )

    

    






/*
                   
    let authURL = 'https://accounts.google.com/o/oauth2/auth'
    const redirectURL = chrome.identity.getRedirectURL("oauth2");
    console.log(`redirectURL: ${redirectURL}`)
    //const redirectURL = 'http://localhost'
    const auth_params = {
      client_id: clientId,
      redirect_uri: redirectURL,
      response_type: 'code',
      access_type: 'offline',
      scope: scope
    };
    authURL += '?' + $.param(auth_params);
    console.log(`authUrl: ${authURL}`)

    chrome.identity.launchWebAuthFlow({url: authURL, interactive: true}, responseURL => console.log(`responseURL: ${responseURL}`))

*/
/*



    
    //var redirect_url = chrome.identity.getRedirectURL("oauth2.html");
    var redirect_url = chrome.identity.getRedirectURL("oauth2");
    var auth_params = {
        client_id: client_id,
        redirect_uri: redirect_url,
        //response_type: 'token',
        response_type: 'code',
        access_type: 'offline',
        //scope: 'profile'
        scope:scope
    };
    auth_url += '?' + $.param(auth_params);
    console.log(auth_url);
    chrome.identity.launchWebAuthFlow(
      {
        url: auth_url, 
        interactive: true
      }, 
      function(responseUrl) { 
        console.log(`responseUrl: ${responseUrl}`); 
        chrome.identity.getProfileUserInfo(function(info) { email = info.email; console.log(`email: ${JSON.stringify(info)}`)});
      }
    );


    /*chrome.identity.getAuthToken(
      {interactive: true}, 
      (token) => {
        window.gapi.auth.setToken(
          {
            'access_token': token,
           }
        );
        console.log('got auth token1 ')
        chrome.identity.getProfileUserInfo(function(info) { email = info.email; console.log(`email: ${JSON.stringify(info)}`)});
        sendResponse({success: true});
      }
    )
    */
   /*
    console.log("test")
    return true;
  }
)

}
/*
const getAuthTokenCallback = (token) => {
  window.gapi.auth.setToken(
    {
      'access_token': token,
     }
  );
}

// Listen for messages from inject.js
chrome.extension.onMessage.addListener(
  function(request, sender, sendResponse) {
    // Get the token
    chrome.identity.getAuthToken(
      {interactive: true}, 
      getAuthTokenCallback
    )
    console.log("test")
    return true;
  }
)
*/
/*
chrome.runtime.onInstalled.addListener(function() {
  chrome.storage.sync.set({color: '#3aa757'}, function() {
    console.log("The color is green.");
  });
  chrome.declarativeContent.onPageChanged.removeRules(undefined, function() {
    chrome.declarativeContent.onPageChanged.addRules([{
      conditions: [new chrome.declarativeContent.PageStateMatcher({
        pageUrl: {hostEquals: 'developer.chrome.com'},
      })
      ],
          actions: [new chrome.declarativeContent.ShowPageAction()]
    }]);
  });
});
*/