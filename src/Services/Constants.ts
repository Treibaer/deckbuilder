const prod = {
  backendUrl: `https://rt.treibaer.de`,
  playModeEnabled: true,
  beta: false
};

const dev = {
  backendUrl: `https://magic.treibaer.de`,
  playModeEnabled: true,
  beta: true
};

export default process.env.NODE_ENV === `development` ? dev : prod;
