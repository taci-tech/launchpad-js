import readConfig from 'rc';

const defConfig = {
    "server": '',
};

const rawConfig = readConfig('launchpad', defConfig);

const LPConfiguration: { [key: string]: string } = {
    "server": rawConfig.server,
};

export { LPConfiguration, defConfig };
