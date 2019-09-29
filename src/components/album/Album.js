import React, { Component } from 'react';
import { Grid, Column, Dialog, Container, Audio } from '@sencha/ext-modern';
import { Polar } from '@sencha/ext-charts';

import './Album.scss';

class Album extends Component {
    constructor(props) {
        super(props);
        this.audio = React.createRef();
        this.state = { album: props.album };
        this.tracks = Ext.create('Ext.data.Store', {
            proxy: {
                type: 'ajax',
                reader: {
                    type: 'json',
                    rootProperty: 'tracks.items'
                }
            }
        });
        this.emptyAudioFeatures = this.categories.map(category => ({ category, value: 0 }));
        this.audioFeaturesStore = new Ext.data.Store({
            data: this.emptyAudioFeatures
        });
        window.Spotify[this.constructor.name] = this; // For debugging
    }

    categories = ['acousticness', 'instrumentalness', 'valence', 'danceability', 'energy', 'liveness'];
    componentDidUpdate(prevProps) {
        if (this.props.album !== prevProps.album) {
            if (this.props.album) {
                this.setState({ album: this.props.album });
                this.tracks.load({ url: this.props.album.data.href });
            } else {
                this.setState({ album: false });
            }
        }
    }
    onSelect(grid, records) {
        const record = records[0];
        console.log(record.data.name);
        const audio = this.audio.current.cmp;
        if (record.data.preview_url) {
            audio.setUrl(record.data.preview_url);
            audio.enable();
            audio.play();
        } else {
            audio.stop();
            audio.setUrl(null);
            audio.disable();
        }
        this.fetchAudioFeatures(record.data.id);
    }
    fetchAudioFeatures(trackId) {}
    fetchAudioFeatures(trackId) {
        Ext.Ajax.request({
            url: `https://api.spotify.com/v1/audio-features/${trackId}`,
            success: (response, opts) => {
                const resp = Ext.decode(response.responseText);
                const data = this.categories.map(category => ({ category, value: resp[category] }));
                this.audioFeaturesStore.setData(data);
            }
        });
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
                    const audio = this.audio.current.cmp;
                    audio.stop();
                    audio.setUrl(null);
                    audio.disable();
                    this.audioFeaturesStore.setData(this.emptyAudioFeatures);
                }}
                height={400}
                width={700}
                cls="foo"
                layout={{ type: 'hbox' }}
            >
                <Grid onSelect={this.onSelect.bind(this)} flex={1} store={this.tracks} hideHeaders={true}>
                    {' '}
                    <Column text="Name" dataIndex="name" flex="1" />
                    <Column
                        dataIndex="duration_ms"
                        renderer={ms => {
                            const minutes = Math.floor(ms / 1000 / 60);
                            const seconds = Math.floor(ms / 1000) % 60;
                            return `${minutes}:${seconds.toString().padStart(2, '0')}`;
                        }}
                        width={80}
                    />
                </Grid>

                <Container flex={1} layout={{ type: 'vbox' }}>
                    <Audio ref={this.audio} disabled={true} />
                    <Polar
                        innerPadding={20}
                        flex={1}
                        store={this.audioFeaturesStore}
                        theme="green"
                        interactions={['rotate']}
                        series={[
                            {
                                type: 'radar',
                                angleField: 'category',
                                radiusField: 'value',
                                style: {
                                    fillStyle: 'lightblue',
                                    fillOpacity: 0.8,
                                    strokeStyle: '#388FAD',
                                    strokeOpacity: 0.8,
                                    lineWidth: 1
                                }
                            }
                        ]}
                        axes={[
                            {
                                type: 'numeric',
                                position: 'radial',
                                fields: 'value',
                                minimum: 0,
                                maximum: 1,
                                style: {
                                    estStepSize: 10
                                },
                                grid: true
                            },
                            {
                                type: 'category',
                                position: 'angular',
                                fields: 'category',
                                style: {
                                    estStepSize: 1
                                },
                                grid: true
                            }
                        ]}
                    />
                </Container>
            </Dialog>
        );
    }
}

export default Album;
