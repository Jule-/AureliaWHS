export class App {
  constructor() {

  }

  configureRouter(config, router) {
    config.map([
      {
        route: '',
        redirect: 'home'
      }, {
        route: ['home'],
        name: 'home',
        moduleId: 'app/home',
        nav: true,
        title: 'AureliaWHS - Home',
        isVisible: true
      }, {
        route: ['whs-view'],
        name: 'whs-view',
        moduleId: 'app/whs-view',
        nav: true,
        title: 'AureliaWHS - 3D',
        isVisible: true
      }
    ]);

    this.router = router;
  }
}
