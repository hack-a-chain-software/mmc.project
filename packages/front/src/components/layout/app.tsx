import routes from "~react-pages";
import { Header } from "./header";
import { Footer } from "./footer";
import { Loader } from '@/components';
import { BrowserRouter as Router, useRoutes } from "react-router-dom";
import {
  useReadyStateEffect,
  isReadyStateMatch,
} from "react-ready-state-effect";
import { useState } from "react";

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
  const [loading, setLoading] = useState(true);

  useReadyStateEffect(() => setLoading(false), [], "complete");

  if (loading) {
    return <Loader />;
  }

  return (
    <Router>
      {notInGame && <Header />}

      <Pages />

      {notInGame && <Footer />}
    </Router>
  );
};
