const prod = {
  backendUrl: `https://rt.treibaer.de`,
};

const dev = {
  backendUrl: `https://magic.treibaer.de`,
};

export default process.env.NODE_ENV === `development` ? dev : prod;
