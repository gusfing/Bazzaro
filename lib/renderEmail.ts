
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

/**
 * Renders a React component to a static HTML string, ready for email sending.
 * @param component The React component to render (e.g., <WelcomeEmail />).
 * @returns A full HTML document string.
 */
export const renderEmail = (component: React.ReactElement): string => {
  // The doctype is important for ensuring the best possible rendering in various email clients.
  return `<!DOCTYPE html>${renderToStaticMarkup(component)}`;
};
