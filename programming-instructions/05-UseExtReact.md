# Steps

The app should be running
by entering `npm start` from the project directory.

## 1. Remove the root element from index.html

Use a code editor and edit `src/index/html`. Remove the contents of the `<body>` element.

    <body>
    </body>


Save your changes and the app should fail with the error
`Uncaught Invariant Violation: Target container is not a DOM element.
 `. That's because `index.js` is still referencing
`root`, and it no longer exists.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540523/SpotifyUseExtReactFailureAfterRemovingRoot.png)


## 2. Use the ExtReact render() function

Edit `index.js`. Remove the
import for `render`. Then add these imports:

    import { launch } from '@sencha/ext-react';
    import { ExtReact } from '@sencha/ext-react';

Then replace the `render()` call with this statement:

    launch(
        <ExtReact>
            <App />
        </ExtReact>
    );

Save your changes, and the app should run.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540502/StarterApp.png)

## 3. Use an ExtReact component

Edit `src/components/App.js`.

Import the ExtReact `<Panel>` component.

    import { Panel } from '@sencha/ext-modern';


Then modify the `render()` method so `<Foo>`
is contained within an ExtReact `<Panel>`.
Set the panel's `title` attribute to _My App_.

    render() {
        return (
            <Panel title="My App">
                <Foo />
            </Panel>
        );
    }

Save your changes and the app should run, but
now you'll see the the panel's titlebar, showing
the title.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540543/SpotityUseExtReactFinal.png)
