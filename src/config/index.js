'use strict';

// Here we define where our server is listening. It is best to store this in
// a configuration file because we are able to easily change the server URL
// based on the current environment. I.e if we are in development, we want to
// use a local API, but if the app is running publicly on the internet we want to
// use a publicly accessible version of this API. Storing the address in the config
// file allows us to easily create different settings for various environments.
export default {
  api: 'http://localhost:4008'
}
