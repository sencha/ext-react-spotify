# Steps

The app should be running
by entering `npm start` from the project directory.


## 1. Get a Spotify user account

Sign up for Spotify at <a href="https://www.spotify.com/us/signup/" target="_blank">https://www.spotify.com/us/signup/</a>.


## 2. Create an app in Spotify

Once you've completed the signup process,
visit the <a href="https://developer.spotify.com/dashboard/applications" target="_blank">
Spotify developer dashboard</a>, and click on **My New App / Create an App**,
and follow the steps. When you're done, copy the client ID.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540668/SpotifySetUpSpotifyCliendID.png)


## 3. Use the clent ID in your app

Use a code editor and edit `src/Authenticate.js` and
replace _your-client-id_ with the client ID from Spotify.

    const clientId = 'your-client-id';

## 4. Run the authenticate() function

Use a code editor to edit `app/index.js` and
import the `authenticate()` function.

    import authenticate from './Authenticate';

Then run it immediately before the call to `launch()`.

    authenticate();
    launch(
        <ExtReact>
            <App />
        </ExtReact>
    );

Save your changes and the app should refresh,
and immediately redirect to Spotify.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540672/SpotifySetUpSpotifyRedirectToSpotify.png)

## 5. Authenticate in Spotify

Login and agree in Spotify, and the app should
redirect back to your app. Note that the Spotify
token and other Spotify information is in the app URL.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540676/SpotifySetUpSpotifyRedirectBackToApp.png)
