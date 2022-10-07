import routes from "~react-pages";
import { Header } from "./header";
import { Footer } from "./footer";
import { BrowserRouter as Router, useRoutes } from "react-router-dom";

const { host, href } = window.location;

const subdomain = host.split(".")[0];

const getSubdomainRoutes = () => {
  const { children = [] } = routes.find(({ path }) => path === subdomain) || {};

  return children.map((subroute) => ({
    ...subroute,
    path: subroute.path || "/",
  }));
};

const Pages = () => {
  return useRoutes(subdomain.length === 4 ? getSubdomainRoutes() : routes);
};

export const App = () => {
  const notInGame = !href.includes("play");

  return (
    <Router>
      {notInGame && <Header />}

      <Pages />

      {notInGame && <Footer />}
    </Router>
  );
};
