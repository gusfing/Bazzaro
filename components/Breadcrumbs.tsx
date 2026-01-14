
import React, { useMemo } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link, useLocation, useParams } = ReactRouterDOM as any;
import { ChevronRight } from 'lucide-react';
import { MOCK_PRODUCTS } from '../constants';

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  // FIX: Because `useParams` is cast to `any`, we cannot use generics. Cast the result instead.
  const params = useParams() as { slug?: string };

  const crumbs = useMemo(() => {
    const pathnames = location.pathname.split('/').filter((x) => x);
    let breadcrumbs = [{ label: 'Archive', path: '/' }];

    if (location.pathname.startsWith('/products/')) {
      const product = MOCK_PRODUCTS.find(p => p.slug === params.slug);
      breadcrumbs.push({ label: 'Shop', path: '/shop' });
      if (product) {
        breadcrumbs.push({ label: product.title, path: location.pathname });
      }
    } else {
      pathnames.forEach((value, index) => {
        const to = `/${pathnames.slice(0, index + 1).join('/')}`;
        breadcrumbs.push({ label: value.replace(/-/g, ' '), path: to });
      });
    }
    return breadcrumbs;
  }, [location.pathname, params.slug]);

  if (crumbs.length <= 1) return null;

  return (
    <nav aria-label="Breadcrumb" className="px-8 py-4 opacity-0 animate-reveal">
      <ol className="flex items-center gap-2 list-none overflow-x-auto scrollbar-hide">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <React.Fragment key={crumb.path}>
              {index > 0 && <ChevronRight size={8} className="text-brand-sepia shrink-0" />}
              <li className="flex items-center">
                {isLast ? (
                  <span className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-sand truncate max-w-[150px] whitespace-nowrap capitalize">
                    {crumb.label}
                  </span>
                ) : (
                  <Link 
                    to={crumb.path} 
                    className="text-[9px] font-black uppercase tracking-[0.4em] text-brand-tan hover:text-brand-sand transition-colors whitespace-nowrap capitalize"
                  >
                    {crumb.label}
                  </Link>
                )}
              </li>
            </React.Fragment>
          );
        })}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
