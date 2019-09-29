# Steps

The app should be running
by entering `npm start` from the project directory.


## 1. Read about the &lt;Audio> component

Go to the ExtReact API docs for the Audio component, and
note that it has a *url* property, as well as `play()`, and
`stop()`, and `setUrl()` methods.

You'll be adding code that detects when the user selects
a track from the grid, then use the *preview_url* propery
provided by Spotify to update the `<Audio>` component
and play the preview.

## 2. Copy the &lt;Audio> component

Copy the `<Audio>` example from the top of the API docs.

    <Audio
        ref="audio"
        loop
        url="resources/audio/crash.mp3"
        posterUrl="resources/images/cover.jpg"
        enableControls={!Ext.os.is.Android}
    />

Then edit `src/components/album/Album.js` and
import the new component.

    import { Grid, Column, Dialog, Container, Audio } from '@sencha/ext-modern';

Then replace the
audio placeholder container with the `<Audio>` component.

## 3. Clean up the &lt;Audio> config

Clean up the code by removing all the properties
other than `ref`, and set the ref to `{this.audio}`, and make the component initially
disabled.

    <Audio ref={this.audio} disabled={true}/>

Then go up to the constructor and create the ref
via `this.audio = React.createRef();`

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
        window.Spotify[this.constructor.name] = this; // For debugging
    }

## 4. Detect when the user selects a track

If you look at <a href="https://docs.sencha.com/extreact/7.0.0/modern/Ext.grid.Grid.html#event-onSelect" target="_blank">the API docs for the Grid#onSelect event</a>, you'll see that the
handler function is passed a reference to the
grid, and the array of records currently selected. In our case, the grid is set up with
the default single-select behavior, so we'll always only want to look at the first record from the array. In other words, when the user taps on
a row, the first item in the array will be the
record for that track.

Edit `src/components/albums/Album.js` and add
a method named `onSelect` that takes two parameters: grid and records. Have the method
log the track name.

    onSelect(grid, records) {
        const record = records[0];
        console.log(record.data.name);
    }

Then edit the `<Grid>` and run that method
on the `onSelect` event.

    <Grid
        onSelect={this.onSelect.bind(this)}
        flex={1}
        store={this.tracks}
        hideHeaders={true} >

Save your changes, then select an album and
some tracks, and you should see them logged
in the browser's debugger console.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6561534/SpotifyTracksLogTrackName.png)


## 5. Update the player as the user chooses tracks

Recall from the `Audio` API docs that it has
methods `enable()`, `disable()`, setUrl()`, `play()` and `stop()`.

Edit `src/components/albums/Albums.js#onSelect`
and get a reference to the `Audio` component.

    const audio = this.audio.current.cmp;

Then code an `if` statement. If there is a *preview_url*, then enable the player,
set the URL, and run `play()`. If there is not
a *preview_url*, then disable it, run `stop()`,
and clear the URl.

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
    }


Save your changes and try it out! You should hear audio tracks as you choose them in the grid.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6561590/SpotifyAudioPlaying.png)

## 6. Turn off the player when the dialog is closed

Unfortunately, once the preview launches, it keeps playing even
though the dialog becomes hidden. You can try
that by starting a track preview, then immediately closing the dialog.

Therefore, we need the dialog's `onHide` event to re-initialize the player.


    onHide={() => {
        this.setState({ album: false });
        // If there is an onUnselect callback, run it.
        this.props.onUnselect && this.props.onUnselect();

        // Reinitialize the audio player.
        const audio = this.audio.current.cmp;
        audio.stop();
        audio.setUrl(null);
        audio.disable();
    }}

Save your changes, start a track playing, then
immediately close the dialog &mdash; the audio
should stop.
