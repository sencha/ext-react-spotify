import React from 'react';
import { render } from 'react-dom';
import './index.scss';
import App from './components/App';
import { launch } from '@sencha/ext-react';
import { ExtReact } from '@sencha/ext-react';

launch(
    <ExtReact>
        <App />
    </ExtReact>
);
