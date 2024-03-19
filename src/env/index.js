const fs = require('fs');
const path = require('path');

const pathInfo = {};
const configInfo = {};

function saveEnvInfo(publicPath) {
  saveWorkPath();
  saveProjectConfig();
  saveAppConfig();
  saveTargetPath(publicPath);
  saveModuleConfig();
}

// 获取应用配置信息
function getAppConfigInfo() {
  return configInfo.appInfo;
}

// 获取所有应用页面的配置信息
function getModuleConfigInfo() {
  return configInfo.moduleInfo;
}

// 获取项目配置信息
function getProjectConfigInfo() {
  return configInfo.projectInfo;
}

// 获取工作目录的路径
function getWorkPath() {
  return pathInfo.workPath;
}

// 获取输出路径
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

function saveTargetPath(publicPath) {
  const { appid } = getProjectConfigInfo();
  // 输出路径
  if (publicPath) {
    pathInfo.targetPath = path.resolve(pathInfo.workPath, `${publicPath}/${appid}`);
  } else {
    pathInfo.targetPath = `${pathInfo.workPath}/dist`;
  }
}

function saveWorkPath() {
  // 工作区间
  pathInfo.workPath = process.cwd();
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
  getWorkPath,
  getTargetPath,
  getAppConfigInfo,
  getModuleConfigInfo,
};
