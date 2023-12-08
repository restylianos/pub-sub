import PubSub from './src/index';

const Gstate = (function () {
  return new PubSub();
})();

export default Gstate;
