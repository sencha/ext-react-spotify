import React, { Component } from 'react';
import { Panel } from '@sencha/ext-modern';

import './App.scss';
import Foo from './Foo/Foo';

class App extends Component {
    constructor(props) {
        super(props);
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

        window.Spotify[this.constructor.name] = this; // For debugging
    }

    render() {
        return (
            <Panel title="My App">
                <Foo />
            </Panel>
        );
    }
}
export default App;
