# Steps

The app should be running
by entering `npm start` from the project directory.


## 1. Review Ext.Ajax API docs

Look at the API docs for the
<a href="https://docs.sencha.com/extreact/7.0.0/modern/Ext.Ajax.html#event-beforerequest" target="_blank">Ext.Ajax#beforerequest</a> and
<a href="https://docs.sencha.com/extreact/7.0.0/modern/Ext.Ajax.html#event-requestexception" target="_blank">Ext.Ajax#requestexception</a> events. Note the parameters passed to
each event callback function.

## 2. Consolidate common AJAX code

Use a code editor and edit `src/Authenticate.js`. In the
default function, add a listener to the `Ext.Ajax#beforerequest`
event. The second parameter &mdash; options &mdash; is the proxy's
configuration. The code overlays it with the header information
you specified in `App.js`.

    export default function() {
        let token = window.location.hash.substr(1);
        if (token) {
            const o = Object.fromEntries(new URLSearchParams(token));
            Ext.Ajax.on('beforerequest', (connection, options) =>
                Object.assign(options, {
                    headers: { Authorization: `Bearer ${o.access_token}` },
                    useDefaultXhrHeader: false
                })
            );
            return o.access_token;
        } else {
            // If there is no token, redirect to Spotify authorization
            redirectToSpotifyAuthentication();
        }
    }

Then edit `src/components/App.js` and remove the header confiration.

    this.newReleases = Ext.create('Ext.data.Store', {
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

Save your changes, and the app should run just like it did before.

## 3. Add error handling

The code has a flaw, because the token issued by Spotify can time out
and become invalid. When that happens, Spotify returns a 4xx or 5xx response. But our code
doesn't handle that yet.

Edit `src/Authenticate.js` and add a `requestexception` event handler to the default
function. When the event runs, have the user
authenticate.

    export default function() {
        let token = window.location.hash.substr(1);
        if (token) {
            const o = Object.fromEntries(new URLSearchParams(token));
            Ext.Ajax.on('beforerequest', (connection, options) =>
                Object.assign(options, {
                    headers: { Authorization: `Bearer ${o.access_token}` },
                    useDefaultXhrHeader: false
                })
            );
            Ext.Ajax.on('requestexception', (connection, options) => redirectToSpotifyAuthentication());
            return o.access_token;
        } else {
            // If there is no token, redirect to Spotify authorization
            redirectToSpotifyAuthentication();
        }
    }

## 4. Use a DataView

Browse <a href="https://docs.sencha.com/extreact/7.0.0/modern/Ext.dataview.DataView.html" target="_blank">the API docs for DataView</a>.

From the docs, copy the
example and in `src/components/App.js` replace `<Foo/>` with the DataView code.

Then remove the `title` attribute from the `<Panel>` and modify the `<DataView>` to only
show `{name}`.
Finally, modify the `store` attribute to reference `this.newReleases`.

    render() {
        return (
            <Panel>
                <DataView itemTpl="{name}" store={this.newReleases} />
            </Panel>
        );
    }

Import `DataView`.

        import { Panel, DataView } from '@sencha/ext-modern';


Save your changes, and you should see the name
of each new release.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542469/SpotifyDataViewNames.png)

## 5. Add image thumbnail

Edit `src/components/App.js` and add a
`fields` config to the store, and map
the image field to its location in the feed.

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

Then edit the DataView template, and reference
the image in an `<img>` element.

    <DataView
        itemTpl="<img src='{image.url}'/><div>{name}</div>"
        store={this.newReleases} />

Save your changes and you should see some
tumbnail images. Note that they do *not* scroll!

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542498/SpotifyDataViewImagesNoScrolling.png)

## 6. Make the images scrollable

The images aren't scrolling for two reasons.
- We didn't set the data view to be `scrollable`
- The parent container doesn't specify a layout manager

First, add `scrollable={true}` to the DataView.

    <DataView
        scrollable={true}
        itemTpl="<img src='{image.url}'/><div>{name}</div>"
        store={this.newReleases} />

Then, modify the parent `<Panel>` to use `layout='fit'`. Layout *fit* simply means that
the one item within the container should take
up all available space and *fit* within the parent.

When you're finished, the App `render()` method should look like this.

    render() {
        return (
            <Panel layout="fit">
                <DataView
                    scrollable={true}
                    itemTpl="<img src='{image.url}'/><div>{name}</div>"
                    store={this.newReleases}
                />
            </Panel>
        );
    }

Save your changes, and in the app, you can
scroll the album art.


## 7. Create a new directory to hold the thumbnails component

Create a directory named *thumbnails* under the
`src/components` directory. Then in that directory, define a
new source file named `Thumbnails.js`.

Set it up as a React component. Then copy the
`<DataView>` from `src/components/App.js` to the the new component's `render()`. Add an import statement for `DataView`.

    import React, { Component } from 'react';
    import { DataView } from '@sencha/ext-modern';

    class Thumbnails extends Component {
        constructor(props) {
            super(props);
            this.state = {};
        }
        render() {
            return (
                <DataView
                    scrollable={true}
                    itemTpl="<img src='{image.url}'/><div>{name}</div>"
                    store={this.newReleases} />
            );
        }
    }

    export default Thumbnails;

Then edit `src/components/App.js` and import
`Thumbnails`.

    import Thumbnails from './thumbnails/Thumbnails';

Then replace the `<DataView>` instance with `<Thumbnails>`.

    render() {
        return (
            <Panel layout="fit">
                <Thumbnails/>
            </Panel>
        );
    }

At this point the code won't run, becuase the
store definition for the `<DataView>` in `Thumbnails.js` is wrong.

## 8. Pass in the store

Edit `src/components/App.js` and modify
the `<Thumbnail>` to pass in the store.

    render() {
        return (
            <Panel layout="fit">
                <Thumbnails store={this.newReleases} />
            </Panel>
        );
    }

Then modify `src/components/thumbnails/Thumbnails.js` and set the store to the
specified prop.

    render() {
        return (
            <DataView
                scrollable={true}
                itemTpl="<img src='{image.url}'/><div>{name}</div>"
                store={this.props.store} />
        );
    }

Save your changes, and you should see the thumbnails
again.


## 9. Use the JavaScript spread operator

The code duplicates the `store` config in both
the app and thumbnails views. What if a lot of properties needed to be set? You could duplicate each one, but there's an
easier way.

The JavaScript spread operator
copies *all* properties from one object to another. Thus, you can pass in any attribute you
need, and all attributes will be copied down to the child component.

Edit `src/components/thumbnails/Thumbnails.js`
and change the `<DataView>` to use the spread operator and *props* rather than explicitly configure the store.

    render() {
        return <DataView
            {...this.props}
            scrollable={true}
            itemTpl="<img src='{image.url}'/><div>{name}</div>"
        />;
    }

Save your changes and the app should run as before. The difference is that you are free to
pass in other `<DataView>` settings from `<App>`
without having to explicitly configure them in
`Thumbnails.js`.

## 8. Copy over the finished version of the source and Sass

There's a lot of additional styling you need to
make the thumbnails look good. You aren't here to
learn Sass, so we'll just give you that code.


Look in the project's `resources` directory: it
contains `Thumbnails.js` and `Thumbnails.scss`
files.

Simply copy and paste both of those files into
your `src/components/thumbnails` directory, overwriting the version of `Thumbnails.js` you've
been coding.

Inspect the new code. It's exactly like the earlier code, except the `itemTpl` is a little
more elaborate, and it also uses styles defined
in `Thumbnails.scss`. The styling uses flex to
show the album art is a more responsive way.
Furthermore, album art is black and white, and slightly blurred, unless the user mouses over.

Save your changes and the app should run, but
the view looks nicer.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6542561/SpotifyDataViewFinalVersion.png)
