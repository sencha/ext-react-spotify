import React, { Component } from 'react';
import { Panel, DataView } from '@sencha/ext-modern';

import './App.scss';
import Foo from './Foo/Foo';
import Thumbnails from './thumbnails/Thumbnails';

class App extends Component {
    constructor(props) {
        super(props);
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
                <Thumbnails store={this.newReleases} />
            </Panel>
        );
    }
}
export default App;
