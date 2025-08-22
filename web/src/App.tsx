import Providers from "@/context/providers";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Wrapper from "@/components/Wrapper";
import Sidebar from "@/components/navigation/Sidebar";
import { StackHandler, StackProvider, StackTheme } from "@stackframe/react";
import { stackClientApp } from "@/api/stack";

import { isDesktop, isMobile } from "react-device-detect";
import Statusbar from "./components/Statusbar";
import Bottombar from "./components/navigation/Bottombar";
import { Suspense, lazy } from "react";
import { Redirect } from "./components/navigation/Redirect";
import { cn } from "./lib/utils";
import { isPWA } from "./utils/isPWA";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { AuthProvider } from "@/context/auth-context";
import useSWR from "swr";
import { FrigateConfig } from "./types/frigateConfig";
import LandingPage from "./pages/LandingPage";

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

function HandlerRoutes() {
  const location = useLocation();

  return (
    <StackHandler app={stackClientApp} location={location.pathname} fullPage />
  );
}

function App() {
  const { data: config } = useSWR<FrigateConfig>("config", {
    revalidateOnFocus: false,
  });

  return (
    <Providers>
      <AuthProvider>
        <BrowserRouter basename={window.baseUrl}>
          <StackProvider app={stackClientApp}>
            <StackTheme>
              <Wrapper>
                {config?.safe_mode ? <SafeAppView /> : <DefaultAppView />}
              </Wrapper>
            </StackTheme>
          </StackProvider>
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
            <Route path="/handler/*" element={<HandlerRoutes />} />
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
              <Route path="/landing" element={<LandingPage />} />
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
          <Routes>
            <Route path="/handler/*" element={<HandlerRoutes />} />
            <Route path="*" element={<ConfigEditor />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  );
}

export default App;
