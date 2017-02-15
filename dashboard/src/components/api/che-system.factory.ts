/*
 * Copyright (c) 2015-2017 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 */
'use strict';


interface ICheResourceState<T> extends ng.resource.IResourceClass<T> {
  getState: any;
}

/**
 * This class is handling the system retrieval
 * @author Florent Benoit
 */
export class CheSystem {
  $resource: ng.resource.IResourceService;
  $q: ng.IQService;
  lodash: any;

  remoteSystemAPI : ICheResourceState<any>;
  state: any;
  websocketUrl : string;


  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor($resource: ng.resource.IResourceService, $q: ng.IQService, lodash: any) {
    // keep resource
    this.$q = $q;
    this.$resource = $resource;
    this.lodash = lodash;

    // remote call
    this.remoteSystemAPI = <ICheResourceState<any>>this.$resource('/api/system', {}, {
      getState: {method: 'GET', url: '/api/system/state'},
      }
    );

    this.fetchState();
  }

  /**
   * Gets state
   * @returns state
   */
  getState() {
    return this.state;
  }

  /**
   * Gets websocket link
   * @returns url to connect
   */
  getWebsocketUrl() {
    return this.websocketUrl;
  }

  /**
   * Ask for loading the state in asynchronous way
   * If there are no changes, it's not updated
   * @returns {ng.IPromise<any>}
   */
  fetchState(): ng.IPromise<any> {
    let promise = this.remoteSystemAPI.getState().$promise;
    let updatedPromise = promise.then((data: any) => {
      this.state = data;
      let websocketLink : any = this.lodash.find(data.links, (link: any) => {
        return link.rel === 'system.state.channel';
      });
      this.websocketUrl = websocketLink.href;
      return this.state;
    }, (error: any) => {
      if (error.status === 304) {
        return this.state;
      }
      return this.$q.reject(error);
    });

    return updatedPromise;
  }

}
