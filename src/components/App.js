import React, { Component } from 'react';
import './App.scss';
import { Dialog, Panel } from '@sencha/ext-modern';
import Thumbnails from './thumbnails/Thumbnails';
import Album from './album/Album';

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
                <Album album={this.state.album} onUnselect={() => this.setState({ album: false })}></Album>{' '}
            </Panel>
        );
    }

    onChildTap(dataview, location) {
        this.setState({ album: location.record });
        console.log(location.record.data.name);
    }
}
export default App;
