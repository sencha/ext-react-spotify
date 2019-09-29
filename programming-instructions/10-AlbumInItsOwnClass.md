# Steps

The app should be running
by entering `npm start` from the project directory.


## 1. Create the source files

Create the directory `src/components/album`, and within it
create `Album.js` and `Album.scss`.

Leave `Album.scss` empty.

Here's the starter code for `Album.js`.

    import React, { Component } from 'react';
    import { Dialog } from '@sencha/ext-modern';
    import './Album.scss';

    class Album extends Component {
        constructor(props) {
            super(props);
            window.Spotify[this.constructor.name] = this; // For debugging
        }
        render() {
            return (  );
        }
    }

    export default Album;

## 2. Cut and paste the dialog

Edit `src/components/App.js` and cut-and-paste the entire `<Dialog ...></Dialog>`
to the `render()` method of `Album.js` and replace it with `<Album/>`.

Here's the result in `Album.js`.

    render() {
        return (
            <Dialog
                displayed={!!this.state.album}
                title={this.state.album ? this.state.album.data.name : ''}
                closable
                closeAction="hide"
                maskTapHandler={dialog => dialog.hide()}
                onHide={() => this.setState({ album: false })}
                height={400}
                width={700}
            >
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat.'
            </Dialog>
        );
    }


## 3. Use Album in App

Edit `App.js` and import `Album`.

    import Album from './album/Album';

Then code the `<Album></Album>` where the dialog used to be.

    render() {
        return (
            <Panel layout="fit">
                <Thumbnails
                    store={this.newReleases}
                    onChildTap={this.onChildTap.bind(this)}
                />
                <Album></Album>
            </Panel>
        );
    }

## 4. Pass in album

Edit `src/components/App.js` and modify the
`<Album>` to pass in the current album.

    <Album album={this.state.album}></Album>

## 5. Set up state in Album

Edit `src/components/album/Album.js` and modify
the constructor to use state.

        constructor(props) {
            super(props);
            this.state = { album: props.album };
            window.Spotify[this.constructor.name] = this; // For debugging
        }


## 6. Have Album detect when the App state changes

Edit `src/components/album/Album.js` and add a
`componentDidUpdate` to detect when App passes in different props. In other words, when the user taps on a release, the App state will change and
therefore, the `album` attribute passed to `Album` will change.

Code the method to detect when the album changes,
and to update its state accordingly.

    componentDidUpdate(prevProps) {
        if (this.props.album !== prevProps.album) {
            if (this.props.album) {
                this.setState({ album: this.props.album });
            } else {
                this.setState({ album: false });
            }
        }
    }


Save your changes and the app should work as before.
