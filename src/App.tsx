import Index from './pages/Index';
import NotFound from './pages/NotFound';

/**
 * One page and a 404. A client-side router, a query client, a tooltip provider
 * and two toast systems were all being shipped to every visitor to render
 * exactly nothing — this site has no routes, no queries and no toasts.
 *
 * GitHub Pages serves 404.html (a copy of index.html) for unknown paths with
 * the original URL intact, so reading the pathname here is all the routing a
 * static single-page site needs.
 */
const App = () => {
  const path = window.location.pathname.replace(/\/+$/, '');
  const isHome = path === '' || path === '/index.html';

  return isHome ? <Index /> : <NotFound path={window.location.pathname} />;
};

export default App;
