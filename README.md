# Coder Coded Fullstack
---

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://github.com/feross/standard)

WebApp boilerplate with following technologies:

- [Riot](http://riotjs.com/) for client-side views
- [Webpack](http://webpack.github.io/) for client-side bundles
- [Redux](https://github.com/rackt/redux) for client-side state
- [Pure.css](http://purecss.io/) for client-side styles
- [PostCSS](https://twitter.com/postcss) with [PreCSS](https://jonathantneal.github.io/precss/) for style transforms
- [Nunjucks](http://mozilla.github.io/nunjucks/) for server-side rendering
- [Express](http://expressjs.com/) for server-side app and API
- [Babel](http://babeljs.io/) for ES2015 and beyond

We have decided not to use isomorphic rendering since it just makes the app a
bit too complex.

**NOTE:** This is still a work in progress. The `crcd-web` module can already be
used though.

## The three parts of the stack

### crcd-api

This module is for building a node express based API for the application.

#### Folder structure

- `src/` : Source for api module
- `build/` : Build output

**NOTE:** This module is in early development stage, not ready to be used yet.

### crcd-db

This module is for building a database layer to be used by the API server and
also by the web server. We have decided to build it on top of
[PostgreSQL](http://www.postgresql.org/) and [Redis](http://redis.io/). Redis
is used for caching and sessions. This module is supposed to handle
authentication and authorization, `crcd-web` and `crcd-api` import this and
thus this module doesn't include a standalone server. This module must be
built before starting the web or API server.

#### Building

```
npm install
npm run build
```

#### Folder structure

- `src/` : Source for db module
- `lib/` : Build output

**NOTE:** This module is in early development stage, not ready to be used yet.


### crcd-web

This module is for building a the client-side web app but also for creating
authentication views and static sites. It is possible to build this module
into a static site with webpack bundled assets. Initially based on
[react-redux-universal-hot-example](https://github.com/erikras/react-redux-universal-hot-example).

#### Installation

```
npm install
```

#### Running Dev Server

```
npm run dev
```

Builds static views in dev mode and starts the express server and a webpack
server which handles the hot reload. Note: make sure the static views don't
overlap with the ones served by express, e.g. `static-views/login/index.html`
matches in express before a route defined as `/login`.

#### Building and Running Production Server

```
npm run build
npm run start
```

Does the same as dev build but instead of the webpack dev server, it creates a
webpack bundle. Static views are built in production mode and the express
server is started.

#### Folder structure

- `src/` : Source for server (built using Babel)
  - `config/` : YAML or JSON configs for the web-server
  - `routes/` : Routes for the web-server
  - `static/` : Static files and webpack build output
  - `static-views/` : Nunjucks templates to be rendered as static html files into `static/`
  - `views/` : Nunjucks templates to be server with web-server
  - `client/` : Source for client (built using Webpack)
    - `components/` : Re-usable Riot components
    - `containers/` : "Smart" Riot components that are used as wrappers etc.
    - `entries/` : Entry files for webpack bundles
    - `redux/` : Everything related to redux (store, middlewares and modules)
    - `routes/` : Client-side routes
    - `styles/` : Shared styles etc.
    - `utils/` : Helpers etc.
- `build/` : Build output
  - `static/dist` : Webpack output
- `.tmp/` : Temp builds in dev mode

[![js-standard-style](https://cdn.rawgit.com/feross/standard/master/badge.svg)](https://github.com/feross/standard)