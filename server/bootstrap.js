'use strict';
const fetch = require('cross-fetch');
const throttle = require('throttle-debounce').throttle;

const triggerBuild = throttle(1000, strapi => {
  const { config } = strapi.plugin('gatsby-cloud');
  const headers = config('headers');
  const url = config('buildWebhookUrl');
  fetch(url, {
    method: 'POST',
    ...headers && { headers },
  });
});

const triggerPreview = throttle(1000, strapi => {
  const { config } = strapi.plugin('gatsby-cloud');
  const headers = config('headers');
  const url = config('previewWebhookUrl');
  fetch(url, {
    method: 'POST',
    ...headers && { headers },
  });
});

module.exports = ({ strapi }) => {
  const { config } = strapi.plugin('gatsby-cloud');
  const enabledTypes = [...config('collectionTypes'), ...config('singleTypes'), ...config('uploads') ? ['plugin::upload.file'] : []];
  
  const uids = Object.values(strapi?.contentTypes)
    .filter(type => enabledTypes.includes(type.uid))
    .map(type => type.uid);

  // bootstrap phase
  // generic subscribe for generic handling
  strapi.db.lifecycles.subscribe((event) => {
    switch (event.action) {
      case 'afterCreate':
      case 'afterCreateMany':
      case 'afterUpdate':
      case 'afterUpdateMany':
      case 'afterDelete':
      case 'afterDeleteMany':
        if (uids.includes(event.model.uid)) {
          triggerPreview(strapi);
          if (typeof event?.result?.publishedAt === 'string') {
            triggerBuild(strapi);
          }
        }
        break;
      default:
        break;
    }
  });
};
