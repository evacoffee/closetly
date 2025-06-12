declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

declare module 'react' {
  import * as React from 'react';
  export = React;
  export as namespace React;
}

declare module 'react-dom' {
  import * as ReactDOM from 'react-dom';
  export = ReactDOM;
  export as namespace ReactDOM;
}

declare module 'next/link' {
  import { ComponentType } from 'react';
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  const Link: ComponentType<NextLinkProps>;
  export default Link;
}

declare module 'next/navigation' {
  export function usePathname(): string;
}
