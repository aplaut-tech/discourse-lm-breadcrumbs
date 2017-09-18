import { createWidget } from 'discourse/widgets/widget';
import { h } from 'virtual-dom';

export default createWidget('lm-breadcrumbs', {
  tagName: 'div.lm-breadcrumbs',

  defaultState () {
    this.appEvents.one('dom:clean', () => {
      Ember.run.scheduleOnce('afterRender', () => {
        this.scheduleRerender();
      });
    });

    return {};
  },

  html () {
    const bcs = [];
    const addBc = (name, url) => { bcs.push({name, url}); }

    const app = this.register.lookup('controller:application');
    const route_name = app.currentRouteName;

    if (route_name.match(/^discovery\./)) {
      if (route_name != 'discovery.categories') {
        var discovery_controller = this.register.lookup('controller:discovery');
        var category = discovery_controller.get('category');
        if (category) {
          addBc('Форум', '/');
        }
      }
    } else if (route_name.match(/^topic\./)) {
      var topic_controller = this.register.lookup('controller:topic');
      var category = topic_controller.get('model.category');
      addBc('Форум', '/');
      if (category) {
        addBc(category.get('name'), category.get('url'));
      }
    } else {
      addBc('Форум', '/');
    }

    return h('div.breadcrumbs', bcs.map(({name, url}) => {
      if (url) {
        return h('a.breadcrumb', {href: url}, [
          name,
          h('i.fa.fa-caret-right')
        ]);
      } else {
        return h('span.breadcrumb', name);
      }
    }));
  }

});
