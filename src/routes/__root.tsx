import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Outlet, Link, createRootRouteWithContext, useRouter, HeadContent, Scripts } from "@tanstack/react-router";
import appCss from "../styles.css?url";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { AiAssistant } from "@/components/dashboard/AiAssistant";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold">404</h1>
        <p className="mt-2 text-sm text-muted-foreground">This page doesn't exist.</p>
        <Link to="/" className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Go to Command Center</Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  console.error(error);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Something went wrong</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 inline-flex rounded-md bg-primary px-4 py-2 text-sm text-primary-foreground">Retry</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "BharatEV — Operations Intelligence" },
      { name: "description", content: "Operational Intelligence for EV Expansion. Executive dashboard for franchise ROI, financials, AI workflows, and expansion." },
      { property: "og:title", content: "BharatEV — Operations Intelligence" },
      { name: "twitter:title", content: "BharatEV — Operations Intelligence" },
      { property: "og:description", content: "Operational Intelligence for EV Expansion. Executive dashboard for franchise ROI, financials, AI workflows, and expansion." },
      { name: "twitter:description", content: "Operational Intelligence for EV Expansion. Executive dashboard for franchise ROI, financials, AI workflows, and expansion." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9263ef53-7506-44d9-aabe-cc1370f03f97/id-preview-657405fb--a6da6229-b43d-48af-8beb-e10b8ef6ee33.lovable.app-1778755239409.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/9263ef53-7506-44d9-aabe-cc1370f03f97/id-preview-657405fb--a6da6229-b43d-48af-8beb-e10b8ef6ee33.lovable.app-1778755239409.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen flex bg-background text-foreground">
        <Sidebar />
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
        <AiAssistant />
      </div>
    </QueryClientProvider>
  );
}
