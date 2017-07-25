# studiowaaz-localization

This is a port of the [0.5 Apostrophe Localization](https://github.com/punkave/apostrophe-localization) module, 
for the [Apostrophe 2.0](http://apostrophecms.org/) nodejs/express based CMS. Localized contents are saved on docs 

**This is not a production ready module** so please use carefully, and let us know of any issues and such.

## Installation

We have yet to deploy this as an NPM module, so for now you can just clone it into your ```lib/modules``` directory

## Configuration

You can configure this either at the application level

```
//app.js

modules:{
 ... other modules ...
  'studiowaaz-localized': {
    "default":"en",
    "locales": [],
    "prefixes": true, // By default, forces the url with locale prefix
    "neverTypes": ['apostrophe-images'] // By default, don't translate images
  },
}
```