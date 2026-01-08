
import React from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ArrowRight } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '../constants';
import Breadcrumbs from '../components/Breadcrumbs';

const Editorial: React.FC = () => {
  return (
    <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24">
      <Breadcrumbs />
      <div className="px-8 py-12 max-w-5xl mx-auto">
        <header className="mb-12">
          <h1 className="font-serif text-5xl text-brand-gray-50 italic animate-reveal">
            The Editorial
          </h1>
          <p className="text-brand-gray-500 animate-reveal" style={{ animationDelay: '0.2s' }}>
            A journal of interventions, craft, and inspiration.
          </p>
        </header>

        <div className="space-y-12">
          {MOCK_BLOG_POSTS.map((post, index) => (
            <Link to="#" key={post.id} className="block group animate-reveal" style={{ animationDelay: `${0.4 + index * 0.2}s` }}>
              <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-brand-espresso mb-6">
                <img
                  src={post.image_url}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                />
              </div>
              <div>
                <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.4em] mb-3 block">
                  {post.category} &mdash; {post.date}
                </span>
                <h2 className="font-serif text-2xl text-brand-gray-50 italic mb-2 group-hover:text-brand-sand transition-colors">
                  {post.title}
                </h2>
                <p className="text-brand-gray-400 text-sm leading-relaxed mb-4">
                  {post.excerpt}
                </p>
                <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gray-500 group-hover:text-brand-gray-50 transition-colors">
                  Read More
                  <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Editorial;