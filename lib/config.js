var config = {};

config.createTemplate = {
  AttachStdin: false,
  CpuShares: null,
  Env: [],
  Cmd: [],
  ExposedPorts: {},
  HostConfig: {
    Binds: [],
    Links: [],
    PortBindings: {},
    Privileged: false,
    PublishAllPorts: false,
    RestartPolicy: {
      Name: 'no',
    },
  },
  Image: '',
  Links: [],
  Memory: null,
  Tty: true,
  Volumes: {},
};

module.exports = config;
