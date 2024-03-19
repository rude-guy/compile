const { getAppConfigInfo, getWorkPath } = require('../../env');
const { buildByPagePath, buildByFullPath } = require('./buildByPagePath');
const { writeFile } = require('./writeFile');

function compileJS() {
  const { pages } = getAppConfigInfo();
  const workPath = getWorkPath();
  const appJsPath = `${workPath}/app.js`;
  const compileResult = [];

  pages.forEach((pagePath) => {
    buildByPagePath(pagePath, compileResult);
  });
  buildByFullPath(appJsPath, compileResult);
  // 输出编译结果
  writeFile(compileResult);
}

module.exports = {
  compileJS,
};
