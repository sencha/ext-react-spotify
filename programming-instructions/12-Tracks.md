# Steps

The app should be running
by entering `npm start` from the project directory.


## 1. Set up the tracks store

Each recent release has associated tracks. Singles only have one, and albums may have
several. A Spotify datafeed that returns tracks for a release, and its URL is
included with each release.

You need a store to hold tracks in `src/components/albums/Albums.js`.

You could manually create that, copy from the ExtReact API docs, or
use one of your existing stores as an example. You'll do the latter.

Open `src/components/App.js` and copy the *newReleases* store from the
constructor, and paste it in the `src/components/albums/Albums.js` constructor.

Then modify it:

- Rename the instance field to `this.tracks`
- Delete the `fields:[]` config
- Delete the proxy's `url` config
- Delete the autoLoad

Note that you're no longer *auto-loading* the store, because we'll
procedurally load it using the URL passed in via `this.props.album`.

When you're finished, the `Album.js` constructor
should look like this.

    constructor(props) {
        super(props);
        this.state = { album: props.album };
        this.tracks = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json',
                    rootProperty: 'albums.items'
                }
            }
        });
        window.Spotify[this.constructor.name] = this; // For debugging
    }

## 2. Load tracks data

You need to load tracks when the album changes.
The code that detects that is in `componentDidUpdate()`.

In the inner `if` statement (that detects when a
new album was passed in), add a statement to
run `load()` on the store, using the URL from the
album's *href* property. When you're finished,
`componentDidUpdate()` will look like this.

    componentDidUpdate(prevProps) {
        if (this.props.album !== prevProps.album) {
            if (this.props.album) {
                this.setState({ album: this.props.album });
                this.tracks.load({ url: this.props.album.data.href });
            } else {
                this.setState({ album: false });
            }
        }
    }

Save your changes, and in the running app,
choose a release. Look in the browser's debugger
network traffic and you should see tracks being returned for each release you select.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6550201/SpotifyTracksNetworkTraffic.png)

## 3. Set the root property

If you look at the tracks feed you'll see that
the array of values is in the *tracks.items*
propery.

Edit the tracks store configuration, and within
the proxy's reader, set the root property to `rootProperty:'tracks.items'`

Save your changes, then choose an album and in the console of the running app, run `Spoitify.Album.tracks.getCount()`. Since the
root property is set now, you should a count of the number of tracks in the store.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6550695/SpotifyTracksGetCount.png)


## 4. Use a grid

Edit `src/components/album/Album.js` and import `Grid` and `Column`.

    import { Grid, Column, Dialog, Container } from '@sencha/ext-modern';

Then read <a href="https://docs.sencha.com/extreact/7.0.0/modern/Ext.grid.Grid.html" target="_blank">the API documents for &lt;Grid></a> and copy the `<Grid>...</Grid>` snippet from the basic grid example at the top.

You should also read the docs a little. Note that columns have a `dataIndex` property that
specifies the value from the record being shown
in the column. The `text` property is the
column header.

Go back to `src/components/album/Album.js` and
replace the grid's placeholder container with
the snippet from the docs. Configure the grid to
be `flex={1}`.

    <Grid flex={1} store={this.tracks}>
        <Column text="Name" dataIndex="name" flex="1" />
        <Column text="Email" dataIndex="email" flex="1" />
        <Column text="Phone" dataIndex="phone" flex="1" />
    </Grid>


Save your changes and choose a release in the running app. You should see a list of tracks.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6550840/SpotifyTracksInitialGrid.png)

At this point the grid is exactly what you copied from the API docs. Coincidentally, that
example has a column whose `dataIndex` corresponds
to a value from the tracks feed. The other two
values aren't in the feed, so those columns are
empty.

## 5. Clean up the code

Delete the second and third column. Then add `hideHeaders={true}` to the grid.

Save your changes, and choose an album. You
see a single column of track names, without
a column header.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6550943/SpotifyGridHideHeaders.png)

## 6. Add the second column

Edit `src/components/albums/Albums.js` and
add a second column to the grid. Set the
*dataIndex* to the value from the data feed holding the duration &mdash; *duration_ms*.

    <Grid flex={1} store={this.tracks} hideHeaders={true}>
        <Column text="Name" dataIndex="name" flex="1" />
        <Column dataIndex="duration_ms" flex="1" />
    </Grid>

Save your changes and you'll see the duration, in milliseconds, in the second column.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6556496/SpotifyTracksDurationMilliseconds.png)

## 7. Confirm the presence of the renderer code package

You'll be coding the duration column in a moment, and it will use a *renderer* function.

In ExtReact, that feature is in a separate code
package that needs to be set up in `webpack.config.js`. Open that file and look for the configuration for `ExtWebpackPlugin`. Within
it is a `packages` array. The starter code should already have that set up, but confirm that there are two entries: *rendererccell* and *charts*.

    new ExtWebpackPlugin({
        framework: 'react',
        packages: ['renderercell', 'charts'],
        port: port,
        profile: buildprofile,
        environment: buildenvironment,
        verbose: buildverbose
    })

Since the `packages` array is already there,
there's nothing to do, but normally, to use
a cell renderer you'd need to add it.

## 8. Add a renderer

Rather than just showing the milliseconds value,
you'll use a renderer function.

Edit the second column and specify a `renderer`
attribute, set to an arrow function. For now, just have the function return a string.

    <Grid flex={1} store={this.tracks} hideHeaders={true}>
        <Column text="Name" dataIndex="name" flex="1" />
        <Column
            dataIndex="duration_ms"
            renderer={() => {
                return 'Hi there';
            }}
            flex="1"
        />
    </Grid>

(The function is coded as a code block, because
in the next step you'll need to put additional
statements in the function.)

Save your changes and see that the renderer function is being used for the second column's values.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6556526/SpotifyTracksRendererHithere.png)

## 9. Calculate the duration in minutes and seconds

Change the renderer arrow function to have several statements.
- Set up the function to have one parameter, *ms*
- Make the first statement a local variable to hold seconds
- Have the second statement a local variable holding seconds in excess of the number of minutes
- Then return a formatted string of the form 2:10, with the seconds being a 2 character string, optionally padded with a leading 0.

Also change the column width to 80.

It might be fun to figure out the code on
your own. If you'd rather not bother, the
code is in the following step.

## 10. The renderer code

    <Grid flex={1} store={this.tracks} hideHeaders={true}>
        <Column text="Name" dataIndex="name" flex="1" />
        <Column
            dataIndex="duration_ms"
            renderer={(ms) => {
                const minutes = Math.floor(ms / 1000 / 60);
                const seconds = Math.floor(ms / 1000) % 60;
                return `${minutes}:${seconds.toString().padStart(2, '0')}`;
            }}
            width={80}
        />
    </Grid>

Save your changes and you'll see the second
column showing track duration in minutes and seconds.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6556553/SpotifyTracksFinal.png)
