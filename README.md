[![Build Status](https://travis-ci.com/DiamondLightSource/cs-web-proto.svg?branch=master)](https://travis-ci.com/DiamondLightSource/cs-web-proto)
[![Coverage Status](https://coveralls.io/repos/github/DiamondLightSource/cs-web-proto/badge.svg?branch=master)](https://coveralls.io/github/DiamondLightSource/cs-web-proto?branch=master)

# CS Web Proto

This project aims to be able to display control system data on web pages.

It is hosted on [Github](https://github.com/DiamondLightSource/cs-web-proto). It is
licensed with the Apache License: see `LICENSE`.

## Setup

See [the development environment wiki page](https://github.com/DiamondLightSource/cs-web-proto/wiki/Development-Environment)
for how to get started and notes on development.

## Libraries

### Runtime

- [React](https://github.com/facebook/react) is fundamental to the design.
  Its use of components maps well to the widgets used in control system user
  interfaces
- [Redux](https://github.com/reduxjs/redux) also fits well with the design.
  All control system data may be cached in the global store and widgets will
  update according to changes to that store

### Development

- [TypeScript](https://www.typescriptlang.org/) adds some type safety to JavaScript code.
- [Create React App](https://github.com/facebook/create-react-app) - a
  framework for starting React apps quickly
- [Jest](https://github.com/facebook/jest) is a widely-used testing framework
  developed by Facebook
- [Prettier](https://github.com/prettier/prettier) is used for code formatting

## Connection information

This application can use data that come from external sources. These settings will vary from machine to machine, so must, if used, be configured when one checks out the source code.

You needn't set connection information if you don't need any external sources of data; you could just use simulated and local process variables. However, if you want to connect to an external source of data:

- Edit the file `.env` to contain the correct connection information.
- Restart the process for the settings to take effect.

### Coniql

The primary server that you will use is called [Coniql](https://github.com/DiamondLightSource/coniql). It connects to the EPICS control system and provides data over GraphQL.

For more on how to set up Coniql see [this wiki page](https://github.com/DiamondLightSource/cs-web-proto/wiki/Running-cs-web-proto-against-Coniql).

### Simulator

There is a built-in simulator that can provide demo data. See [this wiki page](https://github.com/DiamondLightSource/cs-web-proto/wiki/Simulating-a-control-system).

## Debugging

The [loglevel](https://github.com/pimterry/loglevel) library is used for logging. To enable this, change the argument to `log.setLevel` in `App.tsx` and open the javascript console.

The following log levels are meaningful:

- `error`: Show errors
- `warn`: Unexpected but not unrecoverable faults
- `info`: Log whenever a component changes state (e.g. new subscriptions, new connections.)
- `debug`: Log every message to the react reducer
- `trace`: Display data related to network connections.

The `debug` loglevel is particularly useful since a lot of actions are initiated by a message sent to the reducer.
For example, a message is sent to create new subscriptions to process variables, as well as every time a process variable changes value or conneciton status.
