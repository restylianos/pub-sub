export default class PubSub {
  constructor() {
    this.subscribers = [];
  }

  subscribe({ subscriber, listenToAction = undefined }) {
    if (typeof subscriber !== 'function') {
      throw new Error(`${typeof subscriber} is not a valid argument. Expected a function`);
    }

    const unsub = () => {
      this.subscribers = this.subscribers.filter((elem) => elem.subscriber !== subscriber);
    };

    // global subscriber
    if (listenToAction === undefined) {
      this.subscribers = [...this.subscribers, { subscriber }];
      return {
        unsub,
      };
    }
    // non-global subscriber
    this.subscribers = [...this.subscribers, { subscriber, action: listenToAction }];

    return {
      unsub,
    };
  }

  publish({ payload, action = undefined }) {
    // only accept strings as actions
    if (typeof action !== 'string' && action !== undefined)
      throw new Error(`${typeof action} is not a valid argument. Expected a string`);

    //!TODO: If a message is published and no one listens (messages are not consumed case) throw ?

    this.subscribers
      .filter((element) => element.action === action)
      .forEach((element) => element.subscriber(payload));
  }
}
