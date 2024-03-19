const { parseHTML } = require('../../toolkit/parseHTML');
const { markTagStart, markTagEnd } = require('./tag');

function toVueTemplate(wxmlContent) {
  const list = [];
  parseHTML(wxmlContent, {
    start(tag, attrs) {
      const tagStart = markTagStart({
        tag,
        attrs,
      });
      list.push(tagStart);
    },
    chars(str) {
      list.push(str.trim());
    },
    end(tag) {
      const tagEnd = markTagEnd(tag);
      list.push(tagEnd);
    },
  });
  return list.join('');
}

module.exports = {
  toVueTemplate,
};
