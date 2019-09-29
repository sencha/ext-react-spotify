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
                    title={this.state.album ? this.state.album.data.name : ''}
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
