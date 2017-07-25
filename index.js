var _ = require('lodash');
var async = require('async');
var localized = require('./lib/localized.js')

module.exports = {
  improve: 'apostrophe-docs',
  alias:'studiowaaz-localization',
  afterConstruct:function(self){
    //self.apos.app.use(self.localizedHelper);
    self.apos.app.use(self.localizedGet);

  },
  construct: function(self, options) {
    self.defaultLocale = options.default || "en";
    self.locales = options.locales;
    self.neverTypes =options.neverTypes || ['apostrophe-images'];
    if (options.prefixes !== undefined) {
      self.prefixes = options.prefixes;
    } else {
      self.prefixes = true;
    }

    f = localized(self);

    self.localizedGet=function(req, res, next) {
      if (req.method !== 'GET') {
        return next();
      }

      function setLocale(req,locale) {
        req.session.locale = locale;
        req.data.activeLocale = locale;
        self.apos.i18n.setLocale(req,locale);
      }

      if (/^\/(modules|uploads)\//.test(req.url)) {
        return next();
      }

      // is locale in url?
      var matches = req.url.match(/^\/(\w{2,3})(\/.*|\?.*|)$/);
      if (!matches) {
        //do not keep the session locale here
        setLocale(req, self.defaultLocale);
        if (self.prefixes) {
          return res.redirect('/'+self.defaultLocale+req.url);
        }
        return next();
      }

      if (!_.includes(options.locales, matches[1])) {
        setLocale(req,self.defaultLocale);
        return next();
      }

      setLocale(req,matches[1]);

      req.url = matches[2];

      if (!req.url.length) {
        req.url = "/"
      }

      return next();

    };
    self.apos.define('apostrophe-cursor', require('./lib/cursor.js')(self));

    self.docBeforeSave = function(req, doc, options,callback) {

      if(req.session && req.session.locale) {
        locale = req.session.locale;
      } else {
        return setImmediate(callback);
      }

      _.each(doc, function(value, key) {
        if (f.isArea(value)) {
          var items = [];
          _.each(doc[key]["items"], function(item) {
            if(!f.isNeverType(item)) {
              items.push(_.clone(item, true));
            }
          });
          if (items.length > 0) {
            f.ensureProperties(doc, locale);
            doc['localized'][locale][key] = items;
          }
        }
      });

      return setImmediate(callback);

    };
  }
};