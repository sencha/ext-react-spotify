import React, { Component } from 'react';
import { Dialog } from '@sencha/ext-modern';
import './Album.scss';

class Album extends Component {
    constructor(props) {
        super(props);
        this.state = { album: props.album };
        window.Spotify[this.constructor.name] = this; // For debugging
    }
    componentDidUpdate(prevProps) {
        if (this.props.album !== prevProps.album) {
            if (this.props.album) {
                this.setState({ album: this.props.album });
            } else {
                this.setState({ album: false });
            }
        }
    }
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
}

export default Album;
