const TasksContraks = artifacts.require("TasksContract");

module.exports = function (deployer) {
    deployer.deploy(TasksContraks);
  };
  