# Steps

## 1. Clone the starter app

Use a terminal window and navigate to the
folder where you want to do your work.
Then enter this command:

`git clone --branch getting-started https://github.com/sencha/ext-react-spotify.git`

As a result, the directory should look like this:

<img src="https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540469/StarterAppFiles.png" width="30%"/>


## 2. Install dependent packages

Use a terminal window and navigate to your
project folder, and run this command:

`npm install`

## 3. Run the app

Use a terminal window and navigate to your
project folder, and run this command.

`npm start`

The `npm start` command builds and runs the app in a new browser window.

![](https://s3.amazonaws.com/media-p.slid.es/uploads/811981/images/6540502/StarterApp.png)

## 4. Inspect the source code

Using a source code editor, open `index.html` and note the `<div id="root"></div>`.

Open `index.js` and note the `render(<App />, document.getElementById('root'));
` &mdash; this tells React to render the App component to the element specified
in `index.html`.

Open `src/components/App.js`. It renders a single component `<Foo>`.

Open `src/components/Foo/Foo.js`. It renders a div whose contents reference
a constant defined in `src/utils/Constants.js`.
