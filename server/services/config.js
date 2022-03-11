'use strict';

module.exports = ({ strapi }) => ({
  getSettings() {
    const { config } = strapi.plugin('gatsby-cloud');
    return {
      contentSyncUrl: config('contentSyncUrl'),
    };
  },
});
