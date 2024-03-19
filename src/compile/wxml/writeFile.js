const fs = require('fs');
const { getTargetPath } = require('../../env');

function writeFile(list) {
  // 实现将list代码合并并写入文件
  let codeMere = '';
  list.forEach((compileInfo) => {
    const { code } = compileInfo;
    codeMere += code;
  });
  const distPath = getTargetPath();
  fs.writeFileSync(`${distPath}/view.js`, codeMere);
}

module.exports = {
  writeFile,
};
