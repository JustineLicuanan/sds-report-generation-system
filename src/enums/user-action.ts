// TODO: Add or update action types & its descriptions here
// FIXME: Don't forget commas!
export enum UserActionDescription {
  ADD_PREAMBLE = 'Added Preamble',
  EDIT_PREAMBLE = 'Edited Preamble',

  ADD_ORG_CHART = 'Added organization chart',
  EDIT_ORG_CHART = 'Edited organization chart',
  REMOVE_ORG_CHART = 'Removed organization chart',

  ADD_CBL = 'Added CBL',
  EDIT_CBL = 'Edited CBL',
  REMOVE_CBL = 'Removed CBL',

  // TODO: Do not remove for now, this is for copy pasting
  // ADD_ = '',
  // EDIT_ = '',
  // REMOVE_ = '',
}

export type UserActionType = keyof typeof UserActionDescription;

export const UserActionEnum = Object.keys(UserActionDescription).reduce(
  (acc, key) => {
    acc[key] = key;
    return acc;
  },
  {} as Record<string, string>
) as { [k in UserActionType]: k };
