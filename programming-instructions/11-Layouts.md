# Steps

The app should be running
by entering `npm start` from the project directory.



## 1. Fix the bug

There's a small bug where if you select the
same album twice in a row, it won't show the
dialog on the second attempt. That's because
on the second selection, state doesn't change
(the album is the same), so the `componentDidUpdate` doesn't do anything.

You need to modify the code to reset App state
when the dialog is hidden.

Edit `src/components/album/Album.js` and have it
run a `onUnselect` method as the dialog is
hidden. You'll do that by modifying the `onHide`
attribute.

    onHide={() => {
        this.setState({ album: false });
        // If there is an onUnselect callback, run it.
        this.props.onUnselect && this.props.onUnselect();
    }}

Note the short circuit AND, which results in only running `onUnselect()` if it is defined. It's a coding idiom that's equivalent to

    if (this.props.onUnselect){
        this.props.onUnselect();
    }


Then edit `src/components/App.js` and pass in
an event handler as an `<Album>` attribute. The
function should update the app state and set
`album:false`.

    <Album
        album={this.state.album}
        onUnselect={() => this.setState({ album: false })}
        >
    </Album>

## 2. Review layout managers

Visit <a href="https://examples.sencha.com/ExtReact/7.0.0/kitchensink/#/components/layouts" target="_blank">the ExtReact Kitchen Sink layout examples</a>. Pay particular attention to *hbox* and *vbox*. Remember that you can look at the
code by tapping the code icon at the upper right.

<video loop src="https://s3.amazonaws.com/media-p.slid.es/videos/811981/KcASmGt-/sep-16-2019_14-27-27.mp4"></video>

## 3. Use hbox to arrange two child containers

Edit `src/component/albums/Albums.js` and
remove the *lorem ipsum" content. Then configure
the dialog to use `layout:{type: 'hbox'}`. Note
that there are two ways of setting up a layout
manager. To create one with all defaults, simply
name the layout manager: `layout:'hbox'`, but
to create one in a way that allows you to specify
other properties, use a config object: `layout:{{type:'hbox'}}`.

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
                layout={{ type: 'hbox' }}
            ></Dialog>
        );
    }

## 4. Add two child containers

Continue to edit `src/components/album/Album.js`.

Import `Container`.

    import { Dialog, Container } from '@sencha/ext-modern';

Then in the `<Dialog>` body add two containers
with text content.

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
                layout={{ type: 'hbox' }}
            >
                <Container>This will be the grid</Container>
                <Container>This will be the audio player and chart</Container>
            </Dialog>
        );
    }

If you save your changes, the app runs, but
it's hard to tell how much space the containers
occupy.

## 5. Style the containers

One way to see how much space the containers
occupy is to give them a background color. To do
that, we'll create some temporary CSS styles.

First, give the `<Dialog>` a *cls* property.
That's the property ExtReact uses to specify a
CSS class on a component. Use *foo* for the
class name, just to make it more obvious that
it's a temporary setting.

Then set the *cls* of
the two child containers to *left* and *right.

    render() {
        return (
            <Dialog
                cls="foo"
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
                layout={{ type: 'hbox' }}
            >
                <Container cls="left">This will be the grid</Container>
                <Container cls="right">This will be the audio player and chart</Container>
            </Dialog>
        );
    }

## 6. Create the CSS styles

Now edit `src/component/album/Album.scss` and
add background colors for the two named used
in the dialog.

    .foo {
        .left {
            background-color: red;
        }
        .right {
            background-color: blue;
        }
    }

Save your changes, and select an album. You should see the red and blue boxes, which
show how large the containers are.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6546164/SpotifyLayoutsRecBlueNatural.png)

## 7. Have the components take up equal widths

ExtReact components can be given a *flex*, which
specifies proportional spacing.

Edit `src/components/album/Album.js` and give
each container `flex={1}`.

    <Container flex={1} cls="left">
        This will be the grid
    </Container>
    <Container flex={1} cls="right">
        This will be the audio player and chart
    </Container>

Save your changes and both containers should
be sized equally, and together take up all the
available space.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6546314/SpotifyLayoutsFlex1.png)

## 8. Make the right container hold two containers

To simulate where the audio preview and chart will eventually go, put two containers within
right container, and make the right container
`layout={type:'vbox'}`.

    <Container flex={1} cls="left">
        This will be the grid
    </Container>
    <Container layout={{type:'vbox'}}>
        <Container flex={1} cls="righttop">
            This will be the audio player
        </Container>
        <Container flex={1} cls="rightbottom">
            This will be the chart
        </Container>
    </Container>

Then modify the `Album.scss` to define the
*righttop* and *rightbottom* classes. Set their background color
to blue and green.

Save and you'll see the red grid placeholder container on the left, the blue audio player
placeholder on the top-right, and the green
chart placeholder on the bottom-right.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6546498/SpotifyLayoutsRedBlueGreen.png)

## 9. Make the audio player placehold use its natural height

When we replace the three containers with the grid, audio player, and
chart, the grid and chart will be `flex={1}`,
but the audio player will use its natural
height. Therefore, remove the `flex` from the
top-right container, so the layout is more
accurate.

Save your changes, and the top-right container
should use its natural height.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6546530/SpotifyLayoutsFinished.png)
