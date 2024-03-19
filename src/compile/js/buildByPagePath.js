const fs = require('fs');
const path = require('path');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const { getWorkPath } = require('../../env');

function buildByPagePath(pagePath, compileResult) {
  const workPath = getWorkPath();
  const pageFullPath = `${workPath}/${pagePath}.js`;
  buildByFullPath(pageFullPath, compileResult);
}

function buildByFullPath(filePath, compileResult) {
  if (hasCompileInfo(filePath, compileResult)) {
    return;
  }
  const jsContent = fs.readFileSync(filePath, 'utf-8');
  // ast 遍历生成新的ast => js代码
  const ast = babel.parseSync(jsContent);
  const moduleId = getModuleId(filePath);

  const compileInfo = {
    filePath,
    code: '',
    moduleId,
  };
  traverse(ast, {
    CallExpression(path) {
      const { node } = path;
      // 判断callee的name是否为page
      if (node.callee.name === 'Page') {
        const obj = t.objectExpression([
          t.objectProperty(t.identifier('path'), t.stringLiteral(moduleId)),
        ]);
        node.arguments.push(obj);
        return;
      }
    },
    ImportDeclaration({ node }) {
      const importPath = node.source.value;
      // 获取文件后缀
      const ext = path.extname(filePath, `../${importPath}`);
      const importFullPath = path.resolve(filePath, `../${importPath}${ext}`);
      const moduleId = getModuleId(importFullPath);
      node.source.value = moduleId;
      buildByFullPath(importFullPath, compileResult);
    },
  });
  const { code } = babel.transformFromAstSync(ast, '', {});
  compileInfo.code = code;
  compileResult.push(compileInfo);
}

function hasCompileInfo(filePath, list) {
  return list.some((item) => item.filePath === filePath);
}

function getModuleId(fullPath) {
  const workPath = getWorkPath();
  const after = fullPath.split(`${workPath}/`)[1];
  return after.replace(/\.js$/, '');
}

module.exports = {
  buildByPagePath,
  buildByFullPath,
};
