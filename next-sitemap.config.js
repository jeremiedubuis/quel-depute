/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.NEXT_PUBLIC_HOST || 'https://quel-depute.fr',
    generateRobotsTxt: true
};

module.exports = config;
