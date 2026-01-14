
import React, { useEffect } from 'react';
// Fix: Use namespace import and cast to 'any' to work around broken type definitions for react-router-dom
import * as ReactRouterDOM from 'react-router-dom';
const { Link } = ReactRouterDOM as any;
import { ArrowRight } from 'lucide-react';
import { MOCK_BLOG_POSTS } from '../constants';
import Breadcrumbs from '../components/Breadcrumbs';

const Articles: React.FC = () => {
    
  useEffect(() => {
    const pageTitle = 'The Journal | BAZZARO';
    const pageDescription = 'A journal of interventions, craft, and inspiration from the BAZZARO studio. Explore our stories.';
    
    document.title = pageTitle;
    document.querySelector('meta[name="description"]')?.setAttribute('content', pageDescription);
    const canonicalLink = document.querySelector('link[rel="canonical"]');
    if (canonicalLink) {
      canonicalLink.setAttribute('href', window.location.href);
    }
  }, []);

  const featuredPost = MOCK_BLOG_POSTS[0];
  const otherPosts = MOCK_BLOG_POSTS.slice(1);

  return (
    <div className="min-h-screen bg-brand-gray-950 text-brand-gray-50 pt-24">
      <Breadcrumbs />
      <div className="px-8 py-12 max-w-6xl mx-auto">
        <header className="mb-16 text-center">
          <h1 className="font-serif text-5xl text-brand-gray-50 italic animate-reveal">
            The Journal
          </h1>
          <p className="text-brand-gray-500 mt-2 animate-reveal" style={{ animationDelay: '0.2s' }}>
            A space for interventions, craft, and inspiration.
          </p>
        </header>

        {/* Featured Post */}
        {featuredPost && (
            <section className="mb-20 animate-reveal" style={{ animationDelay: '0.4s' }}>
                <Link to="#" className="block group md:grid md:grid-cols-2 md:gap-12 items-center">
                    <div className="aspect-video md:aspect-[4/3] rounded-[2.5rem] overflow-hidden bg-brand-espresso mb-6 md:mb-0 shadow-2xl border border-brand-gray-800">
                        <img
                        src={featuredPost.image_url}
                        alt={featuredPost.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-in-out"
                        />
                    </div>
                    <div className="md:pl-6">
                        <span className="text-[9px] font-black text-brand-tan uppercase tracking-[0.4em] mb-4 block">
                            Featured Article &mdash; {featuredPost.date}
                        </span>
                        <h2 className="font-serif text-3xl lg:text-4xl text-brand-gray-50 italic mb-4 group-hover:text-brand-sand transition-colors">
                            {featuredPost.title}
                        </h2>
                        <p className="text-brand-gray-400 text-sm leading-relaxed mb-6 line-clamp-3">
                            {featuredPost.excerpt}
                        </p>
                        <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-brand-gray-500 group-hover:text-brand-gray-50 transition-colors">
                            Read Full Story
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </div>
                </Link>
            </section>
        )}
        
        {/* Other Posts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
          {otherPosts.map((post, index) => (
            <Link to="#" key={post.id} className="block group animate-reveal" style={{ animationDelay: `${0.6 + index * 0.15}s` }}>
              <div className="aspect-[4/3] rounded-[2rem] overflow-hidden bg-brand-espresso mb-6 shadow-xl border border-brand-gray-800">
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
                <h3 className="font-serif text-2xl text-brand-gray-50 italic mb-2 group-hover:text-brand-sand transition-colors">
                  {post.title}
                </h3>
                <p className="text-brand-gray-400 text-xs leading-relaxed line-clamp-2">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Articles;
