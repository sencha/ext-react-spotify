import React, { Component } from 'react';
import { Dialog, Container } from '@sencha/ext-modern';
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
                onHide={() => {
                    this.setState({ album: false });
                    // If there is an onUnselect callback, run it.
                    this.props.onUnselect && this.props.onUnselect();
                }}
                height={400}
                width={700}
                cls="foo"
                layout={{ type: 'hbox' }}
            >
                <Container flex={1} cls="left">
                    This will be the grid
                </Container>
                <Container layout={{ type: 'vbox' }}>
                    <Container cls="righttop">This will be the audio player</Container>
                    <Container flex={1} cls="rightbottom">
                        This will be the chart
                    </Container>
                </Container>
            </Dialog>
        );
    }
}

export default Album;
