/* eslint-disable @typescript-eslint/no-unused-vars */
const noop = (..._args: unknown[]) => {};

export const router = {
  push: noop,
  replace: noop,
  back: noop,
  navigate: noop,
  setParams: noop,
  canGoBack: () => false,
  dismiss: noop,
  dismissAll: noop,
};

export const useRouter = () => router;
export const useLocalSearchParams = () => ({} as Record<string, string>);
export const usePathname = () => '/';
export const useSegments = () => [] as string[];

export const Link = (props: { children?: unknown }) => props.children as never;
export const Stack = Object.assign(({ children }: { children?: unknown }) => children as never, {
  Screen: (() => null) as unknown as React.FC<unknown>,
});
export const Tabs = Object.assign(({ children }: { children?: unknown }) => children as never, {
  Screen: (() => null) as unknown as React.FC<unknown>,
});
export const Redirect = () => null;
export const Slot = ({ children }: { children?: unknown }) => children as never;
