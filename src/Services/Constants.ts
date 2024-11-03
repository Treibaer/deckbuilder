const prod = {
  backendUrl: `http://192.168.2.47:3055`,
  playModeEnabled: true,
  beta: false,
  deckLiveUpdatesEnabled: true,
};

const dev = {
  backendUrl: `http://192.168.2.47:3055`,
  playModeEnabled: true,
  beta: true,
  deckLiveUpdatesEnabled: true,
};

export default process.env.NODE_ENV === `development` ? dev : prod;
