const prod = {
  url: {
    backendUrl: `https://m2.treibaer.de`,
    playTesterUrl: `http://localhost:5502`,
    loginApiHost: `https://n2.treibaer.de`,
  },
};

const dev = {
  backendUrl: `https://magic.treibaer.de`,
  playTesterUrl: `http://localhost:5502`,
  loginApiHost: `https://magic.treibaer.de`,
  url: {
    API_URL: ``,
  },
};

export default process.env.NODE_ENV === `development` ? dev : prod;
