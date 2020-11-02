A universal media file opener / player desktop app developed in `React.js` and `Electron`.  
Uses `craco` for accessing local file system on client side.  
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).  
Go to [Slasher blog](https://www.slashers.blog) for more development details! 

## TODO

- Check issues

## Functions

**Installation:**  
Install the `.dmg` file in `dist` folder.  
Double click open `backslash.app`, there should be 3 preloaded files for testing purpose.  
  
**Loading files:**  
Drag and drop any file from the computer into the drag-drop zone would load that file.  
Multiple files can be drag-drop-loaded in one operation.  
Click "hide / show" to toggle the visibility of the dropzone.  
  
**Playlist operations:**  
Click on a black bar to show the image / audio video file.  
Shift click multiple black bars together will show multiple files.  
If there are multiple files selected and you want to deselect one of them, **shift click** that white bar (only click will clear the preview, aka. deselect all selected files).  
When there's only one file selected, you could just click or shift click to deselect it.  
Click the cross right to the file name to **delete** the file from playlist (it's not turn it unseen, it's removing it from the software).  
Click "clear playlist" to delete all loaded files.  
The app would "remember" what files are added. Feel free to quit, same status will be loaded upon re-opening the app.  
Drag the black bars to reorder the files in the playlist as you wish.
Click "hide / show" to toggle the visibility of the list.  
  
**Preview operations:**  
The shown files could be dragged and placed anywhere within the window as you like.
Click "prev / next" to show prev / next file. (Disabled when selecting multiple files.)  
To deselect a file, just click on a different file.  
Click "clear preview" to reset the file area.  
The number on the top-left corner indicates the order of the layer (useful when there are multiple files shown; smaller number = near bottom). The color of the border is a visual aid for the same purpose (red = bottom, blue = top).  
Click "+ / -" to resize the preview.
  
**Canvas operations:**  
Click "show canvas" on the top-left corner of one previewed file to show its own local canvas.  
Default pencil stroke is "S" (small), click "L" on the bottom of the canvas to change pencil stroke to large.  
Click "show colors" to use the colorpicker.  
Changes to the pencil will be applied on your next move.  
Click "clear canvas" to remove all drawing history.  
Clicking "hide canvas" will result in removing all drawing history local to the file.  
When canvas is shown, dragging preview on the screen is disabled.  
Click "global canvas" to show the top-most layer and draw the relationships between different shown files.  

**Recorder:**  
Click play button to start recording.  
Click stop button to stop recording.  
Click download button to download the file (named 'Blah.webm').  

**Misc**:  
To hide any of the functions that don't appear on starting the app, just click again on whatever button that made it appear.  

## Folder Structure
```
.
├── build                               Assets for test will be built into this folder 
│   └── ...
├── dist    
│   ├── backslash-0.1.0-mac.zip
│   ├── backslash-0.1.0.dmg             The installer
│   ├── ...
│   └── mac
│       └── backslash.app               The exebutable
├── node_modules
│   └── {depedencies}
├── public
│   ├── asset
│   │   └── {img / av files}            The assets for test
│   ├── electron.js                     Entry point for electron-builder
│   ├── index.html
│   └── ...
├── src
│   ├── App.css
│   ├── App.js                          Main logic
│   ├── index.js                        Entry point for React app
│   ├── ...
│   └── components
│       ├── DragAndDrop.js              Drag and drop area for "uploading" files from local machine
│       ├── IAVMedia.js                 Holder component for an img / av media
│       ├── Playlist.js                 Drag-sortable list to show "uploaded" files
│       └── Preview.js                  Player area w/ ctrls
├── craco.config.js                     Enables Node.js file system on client side
├── electron-dev.js                     Entry point for electron app in dev mode
├── package.json
├── .env.electron                       Environment configuration for desktop app
├── .env.web                            Environment configuration for web app
└── ...

```

## Available Scripts

### `Installation`

To install dependencies, run: 
```
yarn
```

### `Web dev mode`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.  
The page will reload if you make edits.<br />
You will also see any lint errors in the console.

```
yarn start:web
```

### `Electron dev mode`

Runs the app on desktop. Launch an electron window and reload electron automatically while developing:
```
yarn watch:electron
```
and in another console tab:
```
yarn start:electron-dev
```

### `Export`

The `build` and `dist` folders will be generated after running:

```
yarn build:electron
yarn dist
```

### `On Windows`

Please consult the `scripts` in `package.json` files in the two references.

## Other scripts

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

### `yarn eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).

### Code Splitting

This section has moved here: https://facebook.github.io/create-react-app/docs/code-splitting

### Analyzing the Bundle Size

This section has moved here: https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size

### Making a Progressive Web App

This section has moved here: https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app

### Advanced Configuration

This section has moved here: https://facebook.github.io/create-react-app/docs/advanced-configuration

### Deployment

This section has moved here: https://facebook.github.io/create-react-app/docs/deployment

### `yarn build` fails to minify

This section has moved here: https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify

## Slashers

- Devin Kenny
- William Leon
- Kelly Sun

## References
- [Building a production electron/create-react-app application with shared code using electron-builder](https://github.com/johndyer24/electron-cra-example/)
- [Using Create-React-App + Craco + Typescript to build apps for both the Web and Electron2](https://github.com/wwlib/cra-craco-electron-example)