// app/routes/__root.tsx
import { Button } from '@/components/ui/button';
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from '@clerk/tanstack-react-start';
import popins100 from '@fontsource/poppins/100.css?url';
import popins200 from '@fontsource/poppins/200.css?url';
import popins300 from '@fontsource/poppins/300.css?url';
import popins400 from '@fontsource/poppins/400.css?url';
import popins500 from '@fontsource/poppins/500.css?url';
import popins600 from '@fontsource/poppins/600.css?url';
import popins700 from '@fontsource/poppins/700.css?url';
import popins800 from '@fontsource/poppins/800.css?url';
import popins900 from '@fontsource/poppins/900.css?url';
import {
  createRootRoute,
  HeadContent,
  Link,
  Outlet,
  Scripts,
  useNavigate,
} from '@tanstack/react-router';
import { ChartColumnBigIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import appCss from '../app.css?url';
import { getSignedInUserId } from '../data/getSignedInUserId';
import { Toaster } from 'sonner';

export const Route = createRootRoute({
  pendingMs: 0,
  pendingComponent: () => (
    <div className="absolute top-0 left-0 size-full flex items-center justify-center z-1">
      <div className="absolute top-0 left-0 size-full bg-white dark:bg-slate-900 opacity-50"></div>
      <div className="text-3xl text-center z-10">Loading...</div>
    </div>
  ),
  notFoundComponent: () => (
    <div className="text-3xl text-center py-10 text-muted-foreground">
      Opp! Page not found
    </div>
  ),
  beforeLoad: async () => {
    const userId = await getSignedInUserId();
    return {
      userId,
    };
  },
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
  const navigate = useNavigate();

  return (
    <ClerkProvider>
      <html>
        <head>
          <HeadContent />
        </head>

        <body>
          <nav className="bg-primary p-4 h2-20 text-white flex items-center justify-between">
            <Link to="/" className="flex gap-1 items-center font-bold text-2xl">
              <ChartColumnBigIcon className="text-lime-500" /> TanTracker
            </Link>

            <div>
              <SignedOut>
                <div className="text-white flex items-center">
                  <Button asChild variant="link" className="text-white">
                    <SignInButton />
                  </Button>
                  <div className="w-[1px] h-8 bg-zinc-700"></div>
                  <Button asChild variant="link" className="text-white">
                    <SignUpButton />
                  </Button>
                </div>
              </SignedOut>

              <SignedIn>
                <UserButton
                  showName
                  appearance={{
                    elements: {
                      userButtonAvatarBox: {
                        border: '1px solid white',
                      },
                      userButtonOuterIdentifier: {
                        color: 'white',
                      },
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Action
                      label="Dashboard"
                      labelIcon={<ChartColumnBigIcon size={16} />}
                      onClick={() => {
                        navigate({ to: '/dashboard' });
                      }}
                    />
                  </UserButton.MenuItems>
                </UserButton>
              </SignedIn>
            </div>
          </nav>

          {children}
          <Toaster />
          <Scripts />
        </body>
      </html>
    </ClerkProvider>
  );
}
