export default class PubSub {
  constructor() {
    this.subscribers = [];
    this.registeredActions = [];
  }

  subscribe({ subscriber, listenToAction = undefined }) {
    if (typeof subscriber !== "function") {
      throw new Error(
        `${typeof subscriber} is not a valid argument. Expected a function`
      );
    }

    const unsub = () => {
      this.subscribers = this.subscribers.filter(
        (elem) => elem.subscriber !== subscriber
      );
    };

    // global subscriber
    if (listenToAction === undefined) {
      this.subscribers = [...this.subscribers, { subscriber }];
      return {
        unsub,
      };
    }
    // non-global subscriber
    this.subscribers = [
      ...this.subscribers,
      { subscriber, action: listenToAction },
    ];

    return {
      unsub,
    };
  }

  publish({ payload, action = undefined }) {
    // only accept strings as actions
    if (typeof action !== "string" && action !== undefined)
      throw new Error(
        `${typeof action} is not a valid argument. Expected a string`
      );

    if (action !== undefined) {
      this.registeredActions = [...this.registeredActions, action];

      // Throw if no listeners are active! Messages should be consumed unless global
      if (
        this.subscribers.filter((element) => element.action === action)
          .length === 0
      ) {
        throw new Error(
          `Something is wrong. No listener exists for action ${action}. Current available actions are ${this.registeredActions.join(
            ","
          )} `
        );
      }
    }

    // Throw if no listeners exist at all
    if (this.subscribers.length === 0) {
      throw new Error(
        `No active listeners found! Please make sure that at least one listener exists!`
      );
    }

    this.subscribers
      .filter((element) => element.action === action)
      .forEach((element) => element.subscriber(payload));
  }
}
