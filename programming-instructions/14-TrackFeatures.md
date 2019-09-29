# Steps

The app should be running
by entering `npm start` from the project directory.


## 1. Review the Kitchen Sink examples

Look at some of <a href="https://examples.sencha.com/ExtReact/7.0.0/kitchensink/#/charts/radar" target="_blank">the radar chart examples in
Kitchen Sink</a>. (Remember that you can see
source code by clicking on the source button
at the top right.)

## 2. Review the Spotify API docs

Review <a href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/" target="_blank">the Spotify Track Features API docs</a>. Note the
endpoint URL, the request parameters, and
the response format.

You'll use a radar chart to show track features.

## 4. Create a categories array

You'll be creating a store to hold the
track features. Initially the store should
hold 0 for each feature shown on the radar chart.
Therefore, you need an array of which features
to populate in the store.

Edit `src/components/albums/Albums.js` and
add a new instance field.

    categories = ['acousticness', 'instrumentalness', 'valence', 'danceability', 'energy', 'liveness'];

## 5. Create emptyAudioFeatures array

You need an array of zero values, used to
initialize the store.

In the constructor, initialize a new instance
field *emptyAudioFeatures*, ad set it to
an array of objects. Each object should have two
properties: *category* and *value*, where
*category* is the value from the categories array, and value is 0. The calculated result should look like this.

    [
        {"category": "acousticness", "value": 0},
        {"category": "instrumentalness", "value": 0},
        {"category": "valence", "value": 0},
        {"category": "danceability", "value": 0},
        {"category": "energy", "value": 0},
        {"category": "liveness", "value": 0}
    ]

One way to code that is to use the array `map()` method on `this.categories`, and for each iteration return the object.

Try to code it on your own, or if you'd rather
not bother, the code is in the next step.

## 6. Here's the code

Did you get `this.emptyAudioFeatures` initialized? Great! If you'd rather not bother
figuring out the code, here's one way to do it.

    this.emptyAudioFeatures = this.categories.map(category => ({ category, value: 0 }));



## 7. Create an audioFeaturesStore

In the constructor, create an instance
field `this.audioFeaturesStore`, initialized
to a new store, whose *data* property is set
to `this.emptyAudioFeatures`.

After you're done, the constructor will look like this.

    constructor(props) {
        super(props);
        this.audio = React.createRef();
        this.state = { album: props.album };
        this.tracks = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json',
                    rootProperty: 'tracks.items'
                }
            }
        });
        this.emptyAudioFeatures = this.categories.map(category => ({ category, value: 0 }));
        this.audioFeaturesStore = new Ext.data.Store({
            data: this.emptyAudioFeatures
        });
        window.Spotify[this.constructor.name] = this; // For debugging
    }


## 8. Read the ExtReact API docs

In ExtReact, charts are a container that hold
one or more *series* and one or more *axes*.
For example, a cartesian chart may have multiple
line series, and *x* and *y* axes.

Read <a href="https://docs.sencha.com/extreact/7.0.0/modern/Ext.chart.series.Radar.html" target="_blank">the API docs on the radar series</a>. A radar series has two axes:
- the *radial* axis, which is the distance from the center, and
- the *angular* axis is the circle around the outside

For the Spotify app, you'll use *value* for the radial axis, and *category* for the angular axis.

Copy radar example from the docs &mdash; you
need the entire `<Polar>...</Polar>` snippet.

    <Polar
        store={this.store}
        theme="green"
        interactions={['rotate']}
        series={[{
           type: 'radar',
           angleField: 'name',
           radiusField: 'data1',
           style: {
               fillStyle: '#388FAD',
               fillOpacity: .1,
               strokeStyle: '#388FAD',
               strokeOpacity: .8,
               lineWidth: 1
           }
        }]}
        axes={[{
           type: 'numeric',
           position: 'radial',
           fields: 'data1',
           style: {
               estStepSize: 10
           },
           grid: true
        }, {
           type: 'category',
           position: 'angular',
           fields: 'name',
           style: {
               estStepSize: 1
           },
           grid: true
       }]}
    />

Use that code, and replace the chart placeholder
container in `src/components/albums/Albums`.
Make the `<Polar>` component `flex={1}`.

Then import `Polar`. Important: Chart components are in a different location than normal ExtReact
components.

    import { Polar } from '@sencha/ext-charts';

## 10. Note the charts entry in webpack.config.js

Open the project's `webpack.config.js` file and
look at the entry for *ExtWebpackPlugin*. For
charts to work, the *packages* array needs to
specify *charts*. Your starter code already
included that, but normally you'd have to
add that yourself.

    new ExtWebpackPlugin({
        framework: 'react',
        packages: ['renderercell', 'charts'],
        port: port,
        profile: buildprofile,
        environment: buildenvironment,
        verbose: buildverbose
    })

Also note that the starter's `package.json` already specifies a dependency for `@sencha/ext-charts`, but normally you'd have to `npm install` that yourself.

## 9. Clean up the Polar config

- Set the store to `store={this.audioFeaturesStore}`
- In the series, set `angleField={category}`
- In the series, set `radiusField={value}`
- In the series style, set `fillStyle='lightblue'`
- In the series style, set `fillOpacity={0.8}`
- In the *category* axis, set `fields: 'category',`
- In the *numeric* axis, set `fields: 'value',`
- In the *numeric* axis, set `minimum:0,`
- In the *numeric* axis, set `maximum:1,`


    <Polar
        flex={1}
        store={this.audioFeaturesStore}
        theme="green"
        interactions={['rotate']}
        series={[
            {
                type: 'radar',
                angleField: 'category',
                radiusField: 'value',
                style: {
                    fillStyle: 'lightblue',
                    fillOpacity: 0.8,
                    strokeStyle: '#388FAD',
                    strokeOpacity: 0.8,
                    lineWidth: 1
                }
            }
        ]}
        axes={[
            {
                type: 'numeric',
                position: 'radial',
                fields: 'value',
                minimum: 0,
                maximum: 1,
                style: {
                    estStepSize: 10
                },
                grid: true
            },
            {
                type: 'category',
                position: 'angular',
                fields: 'category',
                style: {
                    estStepSize: 1
                },
                grid: true
            }
        ]}
    />

Save your changes, and in the running app,
choose an album. You should see the chart.
We aren't fetching track features yet, so
for now the chart shows radial categorioes,
but no values.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6566345/SpotifyTrackFearturesZeros.png)

## 10. Add a method that fetches audio features

In `src/components/album/Album.js` add a new
method *fetchAudioFeatures*, with one parameter ,
*trackId*.

Call the new method from the last statement in
`onSelect`, passing *record.data.id*.


    onSelect(grid, records) {
        const record = records[0];
        console.log(record.data.name);
        const audio = this.audio.current.cmp;
        if (record.data.preview_url) {
            audio.setUrl(record.data.preview_url);
            audio.enable();
            audio.play();
        } else {
            audio.stop();
            audio.setUrl(null);
            audio.disable();
        }
        this.fetchAudioFeatures(record.data.id);
    }
    fetchAudioFeatures(trackId) {}

## 11. Update fetchAudioFeatures to call Spotify

You'll use an AJAX to fetch the track data.

Read <a href="https://docs.sencha.com/extreact/7.0.0/modern/Ext.Ajax.html" target="_blank">the ExtReact API docs for Ext.Ajax</a>.

Copy the example, and paste it in the `fetchAudioFeatures` method.

    fetchAudioFeatures(trackId) {
        Ext.Ajax.request({
            url: 'ajax_demo/sample.json',

            success: function(response, opts) {
                var obj = Ext.decode(response.responseText);
                console.dir(obj);
            },

            failure: function(response, opts) {
                console.log('server-side failure with status code ' + response.status);
            }
        });
    }

Change the URL to the endpoint value specified
in <a href="https://developer.spotify.com/documentation/web-api/reference/tracks/get-several-audio-features/" target="_blank">the Spotify URL docs</a>, but modify it to use
the track ID passed to the method.

    url: `https://api.spotify.com/v1/audio-features/${trackId}`,

You can also remove the `failure` callback.
Normally you'd code that, but for simplicity
you'll omit that for now.

Save your changes, then choose an album and
track. You should see network traffic with the
album features being returned.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6566406/SpotifyNetworkTrackFeatures.png)

## 12. Update the store with the data

In the success callback, create an array
of objects by iterating over
`this.categories` and for each item, return
the category and corresponding value. Then pass
that array to the store via `this.audioFeaturesStore.setData(data)`

    fetchAudioFeatures(trackId) {
        Ext.Ajax.request({
            url: `https://api.spotify.com/v1/audio-features/${trackId}`,
            success: (response, opts) => {
                const resp = Ext.decode(response.responseText);
                const data = this.categories.map(category => ({ category, value: resp[category] }));
                this.audioFeaturesStore.setData(data);
            }
        });
    }

Save your changes, chose an album and choose some tracks. You'll see the radar chart update
for each track.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6566613/SpotifyTrackFeatures.png)

## 13. Reinitialize the store when the dialog is closed

There's a small bug. If you open an album
and choose a track, then close the album
and open a new one &dash; you'll see that
the chart still reflects the data from
the previously selected track. You need
to add code to clear that out as the dialog
is closed.

Edit the `onHide` event handler to set the store's data to `this.emptyAudioFeatures`.

    onHide={() => {
        this.setState({ album: false });
        // If there is an onUnselect callback, run it.
        this.props.onUnselect && this.props.onUnselect();
        const audio = this.audio.current.cmp;
        audio.stop();
        audio.setUrl(null);
        audio.disable();
        this.audioFeaturesStore.setData(this.emptyAudioFeatures);
    }}

Save your changes, and everything should work.
Choose an album and track, close the album then
open a new one &mdash; the radar chart should be
empty until you choose a new track.

## 14. Make one last tweak

The chart needs a little inner padding.
If you were to look in the API docs, you'd
see that there's a `Polar` attribute named
 *innerPadding*. Add to the `<Polar>`, setting
 it to 20.

     <Polar
        innerPadding={20}
        ...
