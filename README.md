# CS Web Proto

This project aims to be able to display control system data on web pages.

It is hosted on [Github](https://github.com/dls-controls/cs-web-proto). It is
licensed with the Apache License: see `LICENSE`.

## Setup

You will need NodeJS. See
[this wiki page](https://github.com/dls-controls/cs-web-proto/wiki/Development-Environment)
for installation instructions.

Move into the directory and install the packages using `npm`:

`npm install`

Now run the server:

`npm start`

To run the tests in watch mode:

`npm test`

## Development Environment

For more details on the development environment see 
[this wiki page](https://github.com/dls-controls/cs-web-proto/wiki/Development-Environment).

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
  framework for starting React apps quickly.
- [Jest](https://github.com/facebook/jest) is a widely-used testing framework
  developed by Facebook
- [Prettier](https://github.com/prettier/prettier) is used for code formatting
