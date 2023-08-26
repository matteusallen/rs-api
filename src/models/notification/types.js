// @flow
export type WebPushSubscriptionType = {|
  endpoint: string,
  expirationTime: number | null,
  keys: {|
    auth: string,
    p256dh: string
  |}
|};

export type NotificationType = {|
  id: string,
  ssUserId: number | null,
  subscription: WebPushSubscriptionType
|};
