const { saveEnvInfo } = require('../env');
const { createDist } = require('../toolkit/createDist');
const { compileJson } = require('../compile/json');
const { getModuleDeps } = require('../toolkit/getModuleDeps');
const { compileWxml } = require('../compile/wxml');
const { compileJS } = require('../compile/js');

function build(publicPath) {
  // 保存编译相关信息
  saveEnvInfo();
  // 创建dist文件夹
  createDist();
  // 编译配置文件
  compileJson();

  const moduleDeps = getModuleDeps();
  // wxml编译
  compileWxml(moduleDeps);

  // js编译
  compileJS();
}

module.exports = {
  build,
};
