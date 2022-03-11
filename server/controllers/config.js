'use strict';

module.exports = {
  index(ctx) {
    ctx.body = strapi
      .plugin('gatsby-cloud')
      .service('config')
      .getSettings();
  },
};
