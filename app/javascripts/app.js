// Import the page's CSS. Webpack will know what to do with it.
import "../stylesheets/app.css";

// Angular dependencies
import angular from 'angular';
import angularUiRouter from 'angular-ui-router';
// Load config
// import './app.scss';
import {
  appInit
} from './app.config';

// Utilities
import './utilities.js';

// Local Modules
// import endpoints from './modules/endpoints';
// import dashboard from './modules/dashboard';
// import workflow from './modules/workflow';
// import interceptor from './modules/interceptor';

// Load Components
// import { navbar } from './components/navbar';

// Load services
import Battleship from './services/battleship.service';
// Load directives
// import OnErrorDo from './directives/on-error-do.directive';

// Load Views
// import { termsAndConditionsComponent, termsAndConditionsState } from './views/terms-and-conditions';
// import { warrantyComponent, warrantyState } from './views/warranty';
// import { corporateComponent, corporateState } from './views/corporate';
// import { careersComponent, careersState } from './views/careers';
// import { helloComponent, helloState } from './views/hello';
// import { sorryComponent, sorryState } from './views/sorry';
// import { teamComponent, teamState } from './views/team';
import { homeComponent, homeState } from './views/home';

export default angular.module('app', [
    angularUiRouter
  ])

  .run(appInit)

  // .component('navbar',navbar)

  .config(homeState).component('home',homeComponent)

  .service('Battleship',Battleship)

  // .directive('onErrorDo', OnErrorDo)
