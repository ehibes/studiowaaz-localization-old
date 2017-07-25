var _ = require('lodash');
var localized = require('./localized.js');
module.exports = function (module) {

  f = localized(module);
  return {

    construct: function (self, options) {
      function merge(target, source) {
        _.each(source, function(area) {
          for (var i=0; i < target.length; i++) {
              if (target[i]._id === area._id) {
                  target[i].type = area.type;
                  target[i].content = area.content;
                  return;
              }
          }
        });
      };

      self.addFilter('localize', {
          after: function (results) {

            var req = self.get('req');
            if(!(req.data && req.data.activeLocale)) {
              return;
            }

            var locale = req.data.activeLocale;

            _.each(results, function(doc, id) {
              _.each(doc, function(property, key) {
                if(f.isArea(property)) {
                  if (!(doc.localized && doc.localized[locale])) {
                    return;
                  }
                  merge(property.items, doc.localized[locale][key]);
                }
              });
            });
            
            return results;
          }
        }
      );
    }
  }

};
