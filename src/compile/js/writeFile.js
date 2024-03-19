const fs = require('fs');
const { getTargetPath } = require('../../env');

function writeFile(compileResult) {
  // 实现编译结果合并并写入逻辑
  let mergeCode = '';
  const distPath = getTargetPath();
  compileResult.forEach((compileInfo) => {
    const { code, moduleId } = compileInfo;
    const amdCode = `
       modDefine('${moduleId}', function(require, exports, module) {
          ${code}
       })
    `;
    mergeCode += amdCode;
  });
  fs.writeFileSync(`${distPath}/logic.js`, mergeCode);
}

module.exports = {
  writeFile,
};
