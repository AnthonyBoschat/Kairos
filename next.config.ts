import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  turbopack: {
    rules: {
      '*.svg': {
        loaders: ['@svgr/webpack'],
        as: '*.js',
      },
    },
  },
  sassOptions: {
    additionalData: `
      @use "${path.join(__dirname, 'styles/abstracts/variables').replace(/\\/g, '/')}" as v;
      @use "${path.join(__dirname, 'styles/abstracts/mixins').replace(/\\/g, '/')}" as m;
      @use "${path.join(__dirname, 'styles/abstracts/functions').replace(/\\/g, '/')}" as f;
      @use "${path.join(__dirname, 'styles/abstracts/animations').replace(/\\/g, '/')}" as a;
    `,
  },
  reactStrictMode: false,
};

export default nextConfig;