/*
 * Copyright (c) 2015-2018 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
'use strict';

import {FactoryDetailsController} from '../factory-details/factory-details.controller';
import {InformationTabConfig} from './information-tab/information-tab-config';

const htmlLink=require('./factory-details.html');

export class FactoryDetailsConfig {

  constructor(register: che.IRegisterService) {
    register.controller('FactoryDetailsController', FactoryDetailsController);

    // config routes
    register.app.config(['$routeProvider', ($routeProvider: che.route.IRouteProvider) => {
      let locationProvider = {
        title: 'Factory',
        templateUrl: htmlLink,
        controller: 'FactoryDetailsController',
        controllerAs: 'factoryDetailsController'
      };

      $routeProvider.accessWhen('/factory/:id', locationProvider)
        .accessWhen('/factory/:id/:tabName', locationProvider);

    }]);

    // config files
    /* tslint:disable */
    new InformationTabConfig(register);
    /* tslint:enable */
  }
}
