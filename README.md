# Camguard ATM Reconnaissance Dashboard v1.1

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) and styled with [Tailwind CSS](https://tailwindcss.com).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.\
Open [http://localhost:3001](http://localhost:3001) to view it in the browser.

Fast Refresh is enabled. The page will reload if you make edits.\
You will also see any lint errors in the console.

### Development API Server
A [Miragejs](https://miragejs.com) server has been setup on this application to mirror the actual API server closely. In development, all outgoing requests are intercepted and sample data is returned. Error handling and other HTTP related scenarios can be simulated here. To enable this, uncomment the **devServer** import in `./src/App.js` and also the next line that initializes it.

### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

There are a few configurations to make when building for production.

### Mock API Server
In order to remove all sample data from the minified source code and also reduce the bundle size of the build folder, please comment out the Miragejs API server import in `./src/App.js`, so that webpack doesn't bundle all the sample data imported in the devServer file.

### Backend Server URL
To set the API url to a different domain, change the global **baseURL** variable in `./src/lib/fetch.js`.\
The **apiUrls** variable in the same file is a list of predefined domains which can be modified but must contain at least one entry.

### Static File Paths
When building for the live environment, the `./package.json` file must contain the **'homepage'** entry that points to the root of where the application will be hosted if it is a subfolder. This is required so all generated static files point to the correct path. For example, the current live application is hosted on `https://camguarddashboard.yourdomain.com/app`, and since the root folder is `.../app` the static files need to correctly link to this during build time. 

In the _./package.json_ file add `"homepage": "https://camguarddashboard.yourdomain.com/app"`.\ For local environment builds this should be removed or set to `"homepage": "/"`, except the application will be deployed in a subfolder.


### `yarn test`

Launches the test runner in the interactive watch mode.\
TODO: Port unit tests.\
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

### Code Splitting

This section has moved here: [https://facebook.github.io/create-react-app/docs/code-splitting](https://facebook.github.io/create-react-app/docs/code-splitting)

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `yarn build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
