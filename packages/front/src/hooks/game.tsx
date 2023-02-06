import { gameRoute } from '@/constants';
import { useState, useEffect, useMemo } from 'react';

export const useAppPath = () => {
  const [path, setPath] = useState(window.location.pathname);

  const listenToPopstate = () => {
    const winPath = window.location.pathname;

    setPath(winPath);
  };

  useEffect(() => {
    window.onpopstate = () => setTimeout(listenToPopstate, 0);

    window.addEventListener('history.pushState', listenToPopstate);
  });

  return path;
};

export const useIsGame = () => {
  const path = useAppPath();

  return useMemo(() => {
    console.log('');
    console.log('hooks/app.tsx: new route:', window.location.pathname);

    return path === gameRoute;
  }, [path]);
};
