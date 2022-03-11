import pluginPkg from '../../package.json';
import Component from './Preview';

const name = pluginPkg.strapi.name;

export default {
  register(app) {},
  bootstrap(app) {
    app.injectContentManagerComponent('editView', 'right-links', {
      name,
      Component,
    });
  },
};
