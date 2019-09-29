# Steps

The app should be running
by entering `npm start` from the project directory.


## 1. Create a Ext.data.Store

Use a code editor and open `src/components/App.js`. Then
open <a href="https://docs.sencha.com/extjs/7.0.0/modern/Ext.data.Store.html" target="_blank">
the API docs for Ext.data.Store</a> and copy the example to the `App`
constructor. Then delete the `model` specification.

    constructor(props) {
        super(props);
        var myStore = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: '/users.json',
                reader: {
                    type: 'json',
                    rootProperty: 'users'
                }
            },
            autoLoad: true
        });
    }

Save your changes. The app will run, but you'll
have a run-time error because the proxy URL uses
what was in the API example &mdash; you need to use the
URL for the Spotify feed instead.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540827/SpotifyNewReleasesStoreWithBadURL.png)

## 2. Clean up the store definition

First, change the variable you're assigning the
store to from `var myStore` to `this.newReleases`.
By making it an instance property, we can reference
the store anywhere within the class.

Then go to <a href="https://developer.spotify.com/documentation/web-api/reference/browse/get-list-new-releases/" target="_blank">the Spotify API docs for new
releases</a> and copy the endpoint URL. Paste it into the proxy configuation
in `src/components/App.js`.

    this.newReleases = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'https://api.spotify.com/v1/browse/new-releases',
            reader: {
                type: 'json',
                rootProperty: 'users'
            }
        },
        autoLoad: true
    });

Save your changes, and the app still runs, but
now you get a different error, telling you that
CORS is blocking the request because it
contains the wrong header.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542000/SpotifyNewReleasesCORS.png)

## 3. Remove the x-requested-with header from the request

Edit the proxy configuration and add a configuation
`useDefaultXhrHeader:false`.


    this.newReleases = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'https://api.spotify.com/v1/browse/new-releases',
            reader: {
                type: 'json',
                rootProperty: 'users'
            },
            useDefaultXhrHeader: false
        },
        autoLoad: true
    });

Save your changes, and the app runs, but now you'll get an error telling you you need the Spotify access
token.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542005/SpotifyNewReleasesAccessToken.png)

## 4. Add the access token

The access token is returned from the `authenticate()`
function, which is being called from `src/index.js`.

Edit `src/index.js` and save the
token to a local variable, then pass it to `<App>`.

    import React from 'react';
    import { launch } from '@sencha/ext-react';
    import { ExtReact } from '@sencha/ext-react';
    import './index.scss';
    import App from './components/App';
    import authenticate from './Authenticate';

    const token = authenticate();

    launch(
        <ExtReact>
            <App token={token} />
        </ExtReact>
    );

Now edit `src/components/App.js` and modify the
store definition to include the header
and token.

    this.newReleases = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'https://api.spotify.com/v1/browse/new-releases',
            reader: {
                type: 'json',
                rootProperty: 'users'
            },
            headers: { Authorization: `Bearer ${this.props.token}` },
            useDefaultXhrHeader: false
        },
        autoLoad: true
    });

Save your changes and the app runs without error.
If you look at network traffic, you'll see the
data in the response.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542201/SpotifyNewReleasesNetworkTraffic.png)


## 5. Add debug code

Use a code editor and add a global property to
`src/index.js`.

    import React from 'react';
    import { launch } from '@sencha/ext-react';
    import { ExtReact } from '@sencha/ext-react';
    import './index.scss';
    import App from './components/App';
    import authenticate from './Authenticate';

    const token = authenticate();

    launch(
        <ExtReact>
            <App token={token} />
        </ExtReact>
    );

    window.Spotify = {}; // For debugging


Then edit `src/components/App.js` and add
a reference to the `<App>` instance to the
global property.

The code adds an entry to
`window.Spotify` corresponding to the class
name, and assigns the instance to it. In other
words, there will be property named `window.Spotify.App`,
set to the instance of the `App` component.

    constructor(props) {
        super(props);
        this.newReleases = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                url: 'https://api.spotify.com/v1/browse/new-releases',
                reader: {
                    type: 'json',
                    rootProperty: 'users'
                },
                headers: { Authorization: `Bearer ${this.props.token}` },
                useDefaultXhrHeader: false
            },
            autoLoad: true
        });
        window.Spotify[this.constructor.name] = this; // For debugging
    }


## 6. Try out the new property

In your running app, use the Chrome debugger console and
enter.

    Spotify.App.newReleases.getCount();

In that statement, `Spotify.App` is instance, `newReleases`
is the instance field that holds the store, and `getCount()`
is a method of `Ext.data.Store`.

Unfortunately, `getCount()` returns zero, even
though you can see in network traffic that
25 releases are in the data feed. That means
the store isn't being populated. 

## 7. Fix the root property

If you look at the response in the debugger's Network
traffic, you'll see that the array of values is actually
in a property named `albums.items`. Edit `src/components/App`
and add that property to the store's `rootProperty` config.

    this.newReleases = Ext.create('Ext.data.Store', {
        proxy: {
            type: 'ajax',
            url: 'https://api.spotify.com/v1/browse/new-releases',
            reader: {
                type: 'json',
                rootProperty: 'albums.items'
            },
            headers: { Authorization: `Bearer ${this.props.token}` },
            useDefaultXhrHeader: false
        },
        autoLoad: true
    });


Save your work, then in the browser debugger, enter
`Spotify.App.newReleases.getCount();` and you'll see
25, which is the correct value. This shows that the store
now has 25 records corresponding to the 25 recent releases
returned from Spotify.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542259/SpotifyNewReleases25RecentReleases.png)
