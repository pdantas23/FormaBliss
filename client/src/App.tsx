import { AuthProvider } from "@/features/auth/AuthProvider";
import ProtectedRoute from "@/features/auth/ProtectedRoute";
import { Route, Switch } from "wouter";

import Corporativo from "@/pages/Corporativo";
import EventosExclusivos from "@/pages/EventosExclusivos";
import Formatura from "@/pages/Formatura";
import Home from "@/pages/Home";
import LinkBio from "@/pages/LinkBio";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";

import Comercial from "@/features/comercial/pages/Comercial";
import Marketing from "@/features/marketing/pages/Marketing";

import SplashScreen from "@/components/SplashScreen";

export default function App() {
  return (
    <>
      {/* Global Splash Screen */}
      <SplashScreen />

      {/* Routes */}
      <Switch>
        {/* ── Públicas — sem AuthProvider, nenhuma chamada a /auth/me ───── */}
        <Route path="/"                   component={Home}             />
        <Route path="/links"              component={LinkBio}          />
        <Route path="/corporativo"        component={Corporativo}      />
        <Route path="/formatura"          component={Formatura}        />
        <Route path="/eventos-exclusivos" component={EventosExclusivos}/>

        {/* ── Rotas autenticadas — AuthProvider carregado apenas aqui ───── */}
        <Route path="/login">
          <AuthProvider>
            <Login />
          </AuthProvider>
        </Route>

        <Route path="/comercial">
          <AuthProvider>
            <ProtectedRoute allowedRoles={["comercial"]}>
              <Comercial />
            </ProtectedRoute>
          </AuthProvider>
        </Route>

        <Route path="/marketing">
          <AuthProvider>
            <ProtectedRoute allowedRoles={["marketing"]}>
              <Marketing />
            </ProtectedRoute>
          </AuthProvider>
        </Route>

        {/* ── 404 ───────────────────────────────────────────────────────── */}
        <Route component={NotFound} />
      </Switch>
    </>
  );
}
