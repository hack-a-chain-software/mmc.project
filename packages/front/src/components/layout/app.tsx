import routes from "~react-pages";
import { Header } from "./header";
import { Footer } from "./footer";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

const getSubdomainRoutes = (routes, subdomain) => {
  const { children = [] } = routes.find(({ path }) => path === subdomain) || {};

  return children.map((subroute) => ({
    ...subroute,
    path: subroute.path || "/",
  }));
};

const Pages = () => {
  const { host } = window.location;
  const subdomain = host.split(".")[0];

  const _routes =
    subdomain.length === 4 ? getSubdomainRoutes(routes, subdomain) : routes;

  return useRoutes(_routes);
};

export const App = () => (
  <Router>
    <Header />
    <Pages />
    <Footer />
  </Router>
);
