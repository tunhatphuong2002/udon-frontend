'use client';

import React from 'react';
import Script from 'next/script';
import { SITE_URL } from '@/types/utils/env';

interface MetaTagsProps {
  title?: string;
  description?: string;
  canonicalPath?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  structuredData?: object;
  noIndex?: boolean;
}

/**
 * This component is used for pages that need dynamic meta tags
 * or special situations where layout metadata is not sufficient
 */
export const MetaTags: React.FC<MetaTagsProps> = ({
  canonicalPath,
  ogImage = '/images/og-image.jpg',
  structuredData,
  noIndex = false,
  // These props are defined for future use but currently not used in the component
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  description,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  ogType,
}) => {
  const baseUrl = SITE_URL;
  const canonicalUrl = canonicalPath ? `${baseUrl}${canonicalPath}` : undefined;
  // Save for future implementation
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const fullOgImage = ogImage.startsWith('http') ? ogImage : `${baseUrl}${ogImage}`;

  return (
    <>
      {/* Only use necessary meta tags that layout metadata doesn't support */}
      {canonicalUrl && <link rel="canonical" href={canonicalUrl} />}

      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Schema.org markup if provided */}
      {structuredData && (
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      )}
    </>
  );
};
