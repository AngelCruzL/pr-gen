const ejs = require('ejs');

module.exports = {
  render: function (template, data) {
    return ejs.render(template, data);
  }
};