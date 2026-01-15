import "./App.css";
import { Suspense, lazy } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Layout, Login } from "./pages/index";
import { adminRoutes } from "./data/data";
import ProtectedRoute from "./pages/Layout/ProtectedRoute";
import NotFound from "./pages/NotFound/NotFound";
import { Spinner } from "./components";

const Home = lazy(() => import("./pages/Home/Home"));
function App() {
  const route = useLocation();
  return (
    <>
      {route.pathname == "/" ? (
        <>
          <Routes>
            <Route
              path="/"
              element={
                <Layout>
                  <Suspense fallback={<Spinner position="full" />}>
                    <Home />
                  </Suspense>
                </Layout>
              }
            />
          </Routes>
        </>
      ) : route.pathname.startsWith("/admin") ? (
        <Routes>
          <Route element={<ProtectedRoute />}>
            {adminRoutes.map((route) => {
              return (
                <Route
                  key={route.id}
                  path={route.path}
                  element={
                    <Layout>
                      {" "}
                      <Suspense fallback={<Spinner position="relative" />}>
                        {route.element}
                      </Suspense>
                    </Layout>
                  }
                />
              );
            })}
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      ) : route.pathname.startsWith("/login") ? (
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
      ) : (
        <Routes>
          <Route path="*" element={<NotFound />} />
        </Routes>
      )}
    </>
  );
}

export default App;
