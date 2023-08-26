// @flow
export type ContextType = {|
  user: {|
    id: number,
    roleId: number,
    ssGlobalId: ?string,
    token: ?string
  |},
  venue: {|
    id: number
  |}
|};
