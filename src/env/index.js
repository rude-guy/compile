const fs = require('fs');

const pathInfo = {};
const configInfo = {};

function saveEnvInfo() {
  savePathInfo();
  saveProjectConfig();
  saveAppConfig();
  saveModuleConfig();
  console.log(configInfo);
}

// 获取应用配置信息
function getAppConfigInfo() {
  return configInfo.appInfo;
}

// 获取所有应用页面的配置信息
function getModuleConfigInfo() {
  return configInfo.moduleInfo;
}

function getTargetPath() {
  return pathInfo.targetPath;
}

function saveModuleConfig() {
  const { pages } = configInfo.appInfo;
  configInfo.moduleInfo = {};
  pages.forEach((path) => {
    const pageConfigFullPath = `${pathInfo.workPath}/${path}.json`;
    const jsonContent = getJsonContentByFullPath(pageConfigFullPath);
    configInfo.moduleInfo[path] = jsonContent;
  });
}

function savePathInfo() {
  // 工作区间
  pathInfo.workPath = process.cwd();
  // 输出路径
  pathInfo.targetPath = `${pathInfo.workPath}/dist`;
}

// 读取project.config.json
function saveProjectConfig() {
  const filePath = `${pathInfo.workPath}/project.config.json`;
  const jsonContent = getJsonContentByFullPath(filePath);
  configInfo.projectInfo = jsonContent;
}

// 读取app.json
function saveAppConfig() {
  const filePath = `${pathInfo.workPath}/app.json`;
  const jsonContent = getJsonContentByFullPath(filePath);
  configInfo.appInfo = jsonContent;
}

function getJsonContentByFullPath(path) {
  const jsonStr = fs.readFileSync(path, 'utf-8');
  return JSON.parse(jsonStr);
}

module.exports = {
  saveEnvInfo,
  getTargetPath,
  getAppConfigInfo,
  getModuleConfigInfo,
};
