import routes from '~react-pages';
import { Header } from './header';
import { Footer } from './footer';
import { Fallback } from './fallback';
import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import {
  useReadyStateEffect,
} from 'react-ready-state-effect';
import { useState } from 'react';

const Pages = () => {
  return useRoutes(routes);
};

export const App = () => {
  const [loading, setLoading] = useState(true);

  useReadyStateEffect(() => setLoading(false), [], 'complete');

  if (loading) {
    return <Fallback />;
  }

  return (
    <Router>
      <Header />

      <Pages />

      <Footer />
    </Router>
  );
};
