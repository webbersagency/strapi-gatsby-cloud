# Strapi plugin for Gatsby Cloud

Syncing content with Gatsby Cloud and add preview button in Strapi.

```sh
npm i @relate-app/strapi-gatsby-cloud
```

Configure and enable the types you want to trigger an update on Gatsby Cloud.

```js
module.exports = {
  ...
  'gatsby-cloud': {
    enabled: true,
    resolve: '@relate-app/strapi-gatsby-cloud',
    config: {
      uploads: true,
      collectionTypes: [
        'Article',
        'Category',
        'Event',
        'Form',
        'Menu',
        'Page',
      ],
      singleTypes: [
        'Organization',
      ],
      buildWebhookUrl: 'https://webhook.gatsbyjs.com/hooks/data_source/publish/[___SITE_ID___]',
      previewWebhookUrl: 'https://webhook.gatsbyjs.com/hooks/data_source/[___SITE_ID___]',
      contentSyncUrl: 'https://gatsbyjs.com/content-sync/[___SITE_ID___]',
      headers: {
        'x-gatsby-cloud-data-source': '@relate-app/gatsby-source-strapi',
      },
    },
  },
  ...
};
```
