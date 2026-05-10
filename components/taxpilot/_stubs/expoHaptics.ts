/* eslint-disable @typescript-eslint/no-unused-vars */
const noop = async (..._args: unknown[]) => {};

export const ImpactFeedbackStyle = {
  Light: 'Light',
  Medium: 'Medium',
  Heavy: 'Heavy',
  Soft: 'Soft',
  Rigid: 'Rigid',
} as const;

export const NotificationFeedbackType = {
  Success: 'Success',
  Warning: 'Warning',
  Error: 'Error',
} as const;

export const impactAsync = noop;
export const notificationAsync = noop;
export const selectionAsync = noop;

export default { ImpactFeedbackStyle, NotificationFeedbackType, impactAsync, notificationAsync, selectionAsync };
