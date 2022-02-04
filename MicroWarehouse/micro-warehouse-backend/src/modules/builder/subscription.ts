export default class Subscription {
  subscriberUrl: string;
  lastEventTime: string;
  // Used to check if it is a outgoing or returning.
  isReturnSubscription: boolean;
}
