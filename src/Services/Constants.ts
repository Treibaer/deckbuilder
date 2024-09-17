const prod = {
  backendUrl: `https://rt.treibaer.de`,
  playModeEnabled: true,
  beta: false
};

const dev = {
  backendUrl: `http://192.168.2.47:3820`,
  playModeEnabled: true,
  beta: true
};

export default process.env.NODE_ENV === `development` ? dev : prod;
