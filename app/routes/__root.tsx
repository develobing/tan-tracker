// app/routes/__root.tsx
import type { ReactNode } from 'react';
import {
  Outlet,
  createRootRoute,
  HeadContent,
  Scripts,
  Link,
} from '@tanstack/react-router';
import appCss from '../app.css?url';
import popins100 from '@fontsource/poppins/100.css?url';
import popins200 from '@fontsource/poppins/200.css?url';
import popins300 from '@fontsource/poppins/300.css?url';
import popins400 from '@fontsource/poppins/400.css?url';
import popins500 from '@fontsource/poppins/500.css?url';
import popins600 from '@fontsource/poppins/600.css?url';
import popins700 from '@fontsource/poppins/700.css?url';
import popins800 from '@fontsource/poppins/800.css?url';
import popins900 from '@fontsource/poppins/900.css?url';
import { ChartColumnBigIcon } from 'lucide-react';

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'TanStack Start Starter',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      {
        rel: 'stylesheet',
        href: popins100,
      },
      {
        rel: 'stylesheet',
        href: popins200,
      },
      {
        rel: 'stylesheet',
        href: popins300,
      },
      {
        rel: 'stylesheet',
        href: popins400,
      },
      {
        rel: 'stylesheet',
        href: popins500,
      },
      {
        rel: 'stylesheet',
        href: popins600,
      },
      {
        rel: 'stylesheet',
        href: popins700,
      },
      {
        rel: 'stylesheet',
        href: popins800,
      },
      {
        rel: 'stylesheet',
        href: popins900,
      },
    ],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>

      <body>
        <nav className="bg-primary p-4 h2-20 text-white flex items-center justify-between">
          <Link to="/" className="flex gap-1 items-center font-bold text-2xl">
            <ChartColumnBigIcon className="text-lime-500" /> TanTracker
          </Link>
        </nav>

        {children}
        <Scripts />
      </body>
    </html>
  );
}
