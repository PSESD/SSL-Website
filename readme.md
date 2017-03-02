# sslv2

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.15.1.

## Devlopment Dependencies
* Ruby
* NodeJS + NPM

## Development Setup

NB: All dev work is being done in the *development* branch, not in master.

Create a file in the root directory (where Gruntfile.js lives) called local.json for your local environment variables:

```{
   "API_URL": "http://url-of-srx-services-ssl",\n
   "AUTH_URL": "http://url-of-srx-services-ssl-auth/api/",\n
   "BASE_URL": "/",\n
   "CALLBACK_URL": "http://url-of-srx-apps-ssl",\n
   "CLIENT_ID": "client-id",\n
   "CLIENT_SECRET": "client-secret",\n
   "ENABLE_DEBUG" : true,\n
   "ENV": "local",\n
   "LOCAL": "url-of-srex-apps-ssl-dev.com" //see note below\n
   "GRANT_TYPE": "password",\n
   "REDIRECT_URL" : "http://url-of-srx-apps-ssl,//ie, http://localhost:9000\n
   "HOSTNAME" : "localhost",\n
   "PORT" : "9000"\n
}```

* run `npm install`
* run `bower install`
* run `grunt build`
* make sure the api and auth services that you're pointing to are running
* run `grunt serve`

`Grunt build` will generate a file named env.js with the relevant sensitive environment variables. Don't check in this file. (It should be part of .gitignore already.)

A note on the LOCAL variable: the auth server checks this value against the url registered to the organization attempting to sign in (Organization.url in the API's MongoDB). Set this environment variable to match whatever's in the database for your test user, but don't use "localhost", as the url parser doesn't really know how to handle that.

## License

MIT License

Copyright (c) 2016 Puget Sound Educational Service District

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
