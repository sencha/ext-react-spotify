# Steps

The app should be running
by entering `npm start` from the project directory.


## 1. Read DataView API docs

Read <a href="https://docs.sencha.com/extjs/7.0.0/modern/Ext.dataview.DataView.html#event-childtap" target="_blank">the API docs for DataView#childtap</a>
and note the parameters passed to the callback
function.


## 2. Create the event handler method

Edit `src/components/App.js` and add a new method.

    onChildTap(dataview,location){
        console.log(location.record.data.name);
    }

The method simply logs the name of the release.

## 3. Have the DataView run the event handler

Edit the <Thumbnails> config to set up the
event listener. Recall that `Thumbnails.js`
passes all attributes to the `DataView` within
it via the JavaScript spread operator.


    <Thumbnails
        store={this.newReleases}
        onChildTap={this.onChildTap.bind(this)}
    />

Save your changes, then in your browser, tap
on item in the data view. You should see its
name being logged in the console.


 ![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542654/SpotifyShowAlbumDetailsConsoleLog.png)

 ## 4. Use a Dialog

 Read <a href="https://docs.sencha.com/extreact/7.0.0/modern/Ext.Dialog.html" target="_blank">the API docs on Dialog</a> and copy the
 example, and paste it as the second item in the
 `<Panel>` in `src/components/App.js`.

     render() {
        return (
            <Panel layout="fit">
                <Thumbnails store={this.newReleases} onChildTap={this.onChildTap.bind(this)} />
                <Dialog
                    displayed={showDialog}
                    title="Dialog"
                    closable
                    maximizable
                    closeAction="hide"
                    maskTapHandler={this.onCancel}
                    bodyPadding="20"
                    maxWidth="200"
                    defaultFocus="#ok"
                    onHide={() => this.setState({ showDialog: false })}
                >
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.'
                    <Button text="Cancel" handler={this.onCancel} />
                    <Button itemId="ok" text="OK" handler={this.onOk} />
                </Dialog>
            </Panel>
        );
    }

Import `Dialog`.

    import { Dialog, Panel } from '@sencha/ext-modern';

Then clean up the `<Dialog>` by removing some attributes:
- Change `displayed` to `displayed={true}`
- Delete `maximizable`
- Change `maskTapHandler` to `maskTapHandler={dialog=>dialog.hide()}
- Delete `bodyPadding`
- Delete `maxWidth`
- Add `height={400}`
- Add `width={700}`
- Delete the two `<Button>` configs
- Delete `defaultFocus`
- Delete `onHide`

When you're finished, the render method will look like this.

    render() {
        return (
            <Panel layout="fit">
                <Thumbnails store={this.newReleases} onChildTap={this.onChildTap.bind(this)} />
                <Dialog
                    displayed={true}
                    title="Dialog"
                    closable
                    closeAction="hide"
                    maskTapHandler={dialog => dialog.hide()}
                    height={400}
                    width={700}
                >
                    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                    et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.'
                </Dialog>
            </Panel>
        );
    }

Save your changes, and the app will work. You'll
see the dialog in the middle of the screen, with
its hard-coded *lorem ipsum* content.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542668/SpotifyShowAlbumDetailsInitialDialog.png)

## 5. Add state

Edit the `src/components/App.js` constructor and
initialize state.

    this.state = { album: false };

Then edit the dialog's `displayed` attribute
to use that state.

    displayed={!!this.state.album}

The `!!` idiom simply takes a truthy or
falsey value and makes it a boolean.

Save your changes, and the app no longer shows
the dialog. That's because the state is
setting *album* to false, and nothing is updating
the value.

## 6. Have the tap event handler update state

    onChildTap(dataview, location) {
        this.setState({ album: location.record });
        console.log(location.record.data.name);
    }

Then add an `onHide` back to the dialog, and
have it set the *album* state back to false.

    onHide={() => this.setState({ album: false })}

When you're finished, `App.js` should look like this.

    import React, { Component } from 'react';
    import './App.scss';
    import { Dialog, Panel } from '@sencha/ext-modern';
    import Thumbnails from './thumbnails/Thumbnails';

    class App extends Component {
        constructor(props) {
            super(props);
            this.state = { album: false };
            this.newReleases = Ext.create('Ext.data.Store', {
                fields: [
                    {
                        name: 'image',
                        mapping: 'images[1]'
                    }
                ],
                proxy: {
                    type: 'ajax',
                    url: 'https://api.spotify.com/v1/browse/new-releases',
                    reader: {
                        type: 'json',
                        rootProperty: 'albums.items'
                    }
                },
                autoLoad: true
            });
            window.Spotify[this.constructor.name] = this; // For debugging
        }

        render() {
            return (
                <Panel layout="fit">
                    <Thumbnails store={this.newReleases} onChildTap={this.onChildTap.bind(this)} />
                    <Dialog
                        displayed={!!this.state.album}
                        title="Dialog"
                        closable
                        closeAction="hide"
                        maskTapHandler={dialog => dialog.hide()}
                        onHide={() => this.setState({ album: false })}
                        height={400}
                        width={700}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat.'
                    </Dialog>
                </Panel>
            );
        }
        onChildTap(dataview, location) {
            this.setState({ album: location.record });
            console.log(location.record.data.name);
        }
    }
    export default App;

Save your changes. The app starts out
without the dialog. If you tap on an item,
the dialog appears. If you close the dialog
or tap off the dialog, it should disappear.


## 7. Set the dialog title

Modify the `<Dialog>` to make the title
attribute conditional on `this.state.album`.

    title={this.state.album ? this.state.album.data.name : ''}

Save your change, and in the running app, tap
on a title. You should see the dialog, with its
title set to the release name.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6544099/SpotifyTitle.png)
