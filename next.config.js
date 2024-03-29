/** @type {import('next').NextConfig} */
const path = require('path')

const nextConfig = {
  images: {
    domains: ["dummyimage.com", "localhost"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  transpilePackages: ['three', 'react-audio-analyser'],
}
 
module.exports = nextConfig