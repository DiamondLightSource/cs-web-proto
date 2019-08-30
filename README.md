# CS Web Proto

This project aims to be able to display control system data on web pages.

It is hosted on [Github](https://github.com/dls-controls/cs-web-proto). It is
licensed with the Apache License: see `LICENSE`.

## Setup

Move into the directory and install the packages using `npm`:

`npm install`

Now run the server:

`npm start`

### Development Environment

We have collected some tips, helpful pages and links on the [wiki for this project](https://github.com/dls-controls/cs-web-proto/wiki/Development-Environment).
Please go there to find help on installing node.js (required for the above npm command) as well as other tools which will help you contribute to the project.

## Libraries

### Runtime

- [React](https://github.com/facebook/react) is fundamental to the design.
  Its use of components maps well to the widgets used in control system user
  interfaces
- [Redux](https://github.com/reduxjs/redux) also fits well with the design.
  All control system data may be cached in the global store and widgets will
  update according to changes to that store

### Development

- [Create React App](https://github.com/facebook/create-react-app) - a
  framework for starting React apps quickly. See below for more
- [Jest](https://github.com/facebook/jest) is a widely-used testing framework
  developed by Facebook
- [Prettier](https://github.com/prettier/prettier) is used for code formatting

## Create React App

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

### Available Scripts

In the project directory, you can run:

#### `npm start`

Runs the app in the development mode.<br>
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br>
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.<br>
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

#### `npm run build`

Builds the app for production to the `build` folder.<br>
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br>
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

#### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (Webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

### Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
