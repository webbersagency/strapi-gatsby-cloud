'use strict';
const fetch = require('node-fetch');
const debounce = require('debounce');

const trigger = debounce((url, strapi) => {
  const { config } = strapi.plugin('gatsby-cloud');
  const headers = config('headers');
  fetch(url, {
    method: 'POST',
    ...headers && { headers },
  });
}, 1000);

module.exports = ({ strapi }) => {
  const { config } = strapi.plugin('gatsby-cloud');
  const enabledTypes = [...config('collectionTypes'), ...config('singleTypes'), ...config('uploads') ? ['File'] : []];
  
  const types = Object.values(strapi?.contentTypes)
    .filter(type => enabledTypes.includes(type.info.displayName))
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
        const uid = event.model.uid;
        if (types.includes(uid)) {
          trigger(config('previewWebhookUrl'), strapi);
          if (typeof event?.result?.publishedAt === 'string') {
            trigger(config('buildWebhookUrl'), strapi);
          }
        }
        break;
      default:
        break;
    }
  });
};
