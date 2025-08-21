import Providers from "@/context/providers";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Wrapper from "@/components/Wrapper";
import Sidebar from "@/components/navigation/Sidebar";

import { isDesktop, isMobile } from "react-device-detect";
import Statusbar from "./components/Statusbar";
import Bottombar from "./components/navigation/Bottombar";
import { Suspense, lazy, useState, useEffect } from "react";
import { Redirect } from "./components/navigation/Redirect";
import { cn } from "./lib/utils";
import { isPWA } from "./utils/isPWA";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/context/auth-context";
import useSWR from "swr";
import { FrigateConfig } from "./types/frigateConfig";

// Removed StackFrame React components to avoid React.use() issues
import { stackClientApp } from "./stack/client";

const Live = lazy(() => import("@/pages/Live"));
const Events = lazy(() => import("@/pages/Events"));
const Explore = lazy(() => import("@/pages/Explore"));
const Exports = lazy(() => import("@/pages/Exports"));
const ConfigEditor = lazy(() => import("@/pages/ConfigEditor"));
const System = lazy(() => import("@/pages/System"));
const Settings = lazy(() => import("@/pages/Settings"));
const UIPlayground = lazy(() => import("@/pages/UIPlayground"));
const FaceLibrary = lazy(() => import("@/pages/FaceLibrary"));
const Classification = lazy(() => import("@/pages/ClassificationModel"));
const Logs = lazy(() => import("@/pages/Logs"));
const AccessDenied = lazy(() => import("@/pages/AccessDenied"));
const AuthLanding = lazy(() => import("@/pages/AuthLanding"));

// Check if user wants to bypass auth or is authenticated
function useAuthState() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user bypassed auth
        const authBypass = localStorage.getItem("auth-bypass");
        if (authBypass === "true") {
          setIsAuthenticated(true);
          setIsLoading(false);
          return;
        }

        // Check if user is authenticated with Stack
        const user = await stackClientApp.getUser();
        setIsAuthenticated(!!user);
      } catch (error) {
        console.log("Auth check failed:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  return { isAuthenticated, isLoading };
}

function App() {
  const { data: config } = useSWR<FrigateConfig>("config", {
    revalidateOnFocus: false,
  });

  return (
    <Providers>
      <AuthProvider>
        <BrowserRouter basename={window.baseUrl}>
          <Wrapper>
            <AuthWrapper>
              {config?.safe_mode ? <SafeAppView /> : <DefaultAppView />}
            </AuthWrapper>
          </Wrapper>
        </BrowserRouter>
      </AuthProvider>
    </Providers>
  );
}

function DefaultAppView() {
  return (
    <div className="size-full overflow-hidden">
      {isDesktop && <Sidebar />}
      {isDesktop && <Statusbar />}
      {isMobile && <Bottombar />}
      <div
        id="pageRoot"
        className={cn(
          "absolute right-0 top-0 overflow-hidden",
          isMobile
            ? `bottom-${isPWA ? 16 : 12} left-0 md:bottom-16 landscape:bottom-14 landscape:md:bottom-16`
            : "bottom-8 left-[52px]",
        )}
      >
        <Suspense>
          <Routes>
            <Route
              element={<ProtectedRoute requiredRoles={["viewer", "admin"]} />}
            >
              <Route index element={<Live />} />
              <Route path="/review" element={<Events />} />
              <Route path="/explore" element={<Explore />} />
              <Route path="/export" element={<Exports />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route element={<ProtectedRoute requiredRoles={["admin"]} />}>
              <Route path="/system" element={<System />} />
              <Route path="/config" element={<ConfigEditor />} />
              <Route path="/logs" element={<Logs />} />
              <Route path="/faces" element={<FaceLibrary />} />
              <Route path="/classification" element={<Classification />} />
              <Route path="/playground" element={<UIPlayground />} />
            </Route>
            <Route path="/unauthorized" element={<AccessDenied />} />
            <Route path="*" element={<Redirect to="/" />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

function SafeAppView() {
  return (
    <div className="size-full overflow-hidden">
      <div
        id="pageRoot"
        className={cn("absolute bottom-0 left-0 right-0 top-0 overflow-hidden")}
      >
        <Suspense>
          <ConfigEditor />
        </Suspense>
      </div>
    </div>
  );
}

function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuthState();

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-900">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <AuthLanding />;
  }

  return <>{children}</>;
}

export default App;
