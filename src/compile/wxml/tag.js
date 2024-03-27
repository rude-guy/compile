const tagWhiteList = ['view', 'text', 'image', 'swiper', 'swiper-item', 'video'];

function markTagEnd(tag) {
  return `</ui-${tag}>`;
}

function markTagStart(opts) {
  const { tag, attrs } = opts;
  if (!tagWhiteList.includes(tag)) {
    throw new Error(`Unsupported tag: ${tag}`);
  }

  const tansTag = `ui-${tag}`;
  const propsStr = getPropsStr(attrs);
  if (propsStr.length) {
    return `<${tansTag} ${propsStr}>`;
  }
  return `<${tansTag}>`;
}

function getPropsStr(attrs) {
  const attrsList = [];
  attrs.forEach((attrInfo) => {
    const { name, value } = attrInfo;

    if (/^bind/.test(name)) {
      attrsList.push({
        name: `v-bind:${name}`,
        value: `'${value}'`,
      });
      return;
    }
    if (name === 'wx:if') {
      attrsList.push({
        name: 'v-if',
        value: getExpression(value),
      });
      return;
    }
    if (name === 'wx:for') {
      attrsList.push({
        name: 'v-for',
        value: getForExpression(value),
      });
      return;
    }
    if (name === 'wx:key') {
      attrsList.push({
        name: 'v-bind:key',
        value: `item.${value}`,
      });
      return;
    }
    if (name === 'style') {
      attrsList.push({
        name: 'v-bind:style',
        value: getStyleExpression(value.trim()),
      });
      return;
    }
    if (/\{\{(.*)\}\}/.test(value)) {
      attrsList.push({
        name: `v-bind:${name}`,
        value: getExpression(value),
      });
      return;
    }
    attrsList.push({
      name,
      value,
    });
  });

  return linkAttrs(attrsList);
}

function getStyleExpression(str) {
  const reg = /([^:]+):([^;]+);?/g;
  const cssRules = [];
  for (const matchs of str.matchAll(reg)) {
    cssRules.push(`'${matchs[1]}':${getExpression(matchs[2])}`);
  }
  return `{${cssRules.join(',')}}`;
}

function getForExpression(str) {
  const list = getExpression(str);
  return `(item, index) in ${list}`;
}

function getExpression(str) {
  const reg = /\{\{(.*)\}\}/;
  return str.replace(reg, '$1');
}

function linkAttrs(attrsList) {
  const result = [];
  attrsList.forEach((attrInfo) => {
    const { name, value } = attrInfo;
    result.push(`${name}="${value}"`);
  });
  return result.join(' ');
}

module.exports = {
  markTagStart,
  markTagEnd,
};
