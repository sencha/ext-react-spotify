import React, { Component } from 'react';
import { Panel } from '@sencha/ext-modern';

import './App.scss';
import Foo from './Foo/Foo';

class App extends Component {
    render() {
        return (
            <Panel title="My App">
                <Foo />
            </Panel>
        );
    }
}
export default App;
