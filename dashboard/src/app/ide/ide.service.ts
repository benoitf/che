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
import {CheAPI} from '../../components/api/che-api.factory';
import {CheWorkspace} from '../../components/api/workspace/che-workspace.factory';
import {RouteHistory} from '../../components/routing/route-history.service';
import {CheUIElementsInjectorService} from '../../components/service/injector/che-ui-elements-injector.service';
import {CheJsonRpcMasterApi} from '../../components/api/json-rpc/che-json-rpc-master-api';
import {CheJsonRpcApi} from '../../components/api/json-rpc/che-json-rpc-api.factory';

/**
 * This class is handling the service for viewing the IDE
 * @author Florent Benoit
 */
class IdeSvc {
  $location: ng.ILocationService;
  $log: ng.ILogService;
  $mdDialog: ng.material.IDialogService;
  $q: ng.IQService;
  $rootScope: ng.IRootScopeService;
  $sce: ng.ISCEService;
  $timeout: ng.ITimeoutService;
  $http : ng.IHttpService;
  cheAPI: CheAPI;
  cheWorkspace: CheWorkspace;
  lodash: any;
  proxySettings: any;
  routeHistory: RouteHistory;
  userDashboardConfig: any;
  cheUIElementsInjectorService: CheUIElementsInjectorService;

  ideParams: Map<string, string>;
  lastWorkspace: any;
  openedWorkspace: any;

  ideAction: string;

  pingIDEURL: number;

  private jsonRpcMasterApi: CheJsonRpcMasterApi;
  private cheJsonRpcApi: CheJsonRpcApi;
  private outputByMachine: any;
  private statusByMachine: Map<string, string>;
  private workspaceStatus : string;
  private subscribers : Map<string, boolean>;
  private hasMachineLog: boolean;

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor($location: ng.ILocationService, $log: ng.ILogService, $mdDialog: ng.material.IDialogService,
              $http: ng.IHttpService, $q: ng.IQService, $rootScope: ng.IRootScopeService, $sce: ng.ISCEService, $timeout: ng.ITimeoutService,
              cheAPI: CheAPI, cheWorkspace: CheWorkspace, lodash: any, proxySettings: any, routeHistory: RouteHistory,
              cheJsonRpcApi: CheJsonRpcApi, userDashboardConfig: any, cheUIElementsInjectorService: CheUIElementsInjectorService) {
    this.$location = $location;
    this.$log = $log;
    this.$mdDialog = $mdDialog;
    this.$http = $http;
    this.$q = $q;
    this.$rootScope = $rootScope;
    this.$sce = $sce;
    this.$timeout = $timeout;
    this.cheAPI = cheAPI;
    this.cheWorkspace = cheWorkspace;
    this.lodash = lodash;
    this.proxySettings = proxySettings;
    this.routeHistory = routeHistory;
    this.userDashboardConfig = userDashboardConfig;
    this.cheUIElementsInjectorService = cheUIElementsInjectorService;
    this.cheJsonRpcApi = cheJsonRpcApi;
    this.ideParams = new Map();

    this.lastWorkspace = null;
    this.openedWorkspace = null;
    this.outputByMachine = {};
    this.statusByMachine = new Map();
    this.workspaceStatus = '';
    this.subscribers = new Map();
  }

  displayIDE(): void {
    (this.$rootScope as any).showIDE = true;
  }

  restoreIDE(): void {
    (this.$rootScope as any).restoringIDE = true;
    this.displayIDE();
  }

  hasIdeLink(): boolean {
    return (this.$rootScope as any).ideIframeLink && ((this.$rootScope as any).ideIframeLink !== null);
  }

  handleError(error: any): void {
    this.$log.error(error);
  }

  startIde(workspace: any): ng.IPromise<any> {
    this.lastWorkspace = workspace;

    if (this.openedWorkspace && this.openedWorkspace.id === workspace.id) {
      this.openedWorkspace = null;
    }

    this.updateRecentWorkspace(workspace.id);

    let startWorkspaceDefer = this.$q.defer();
    this.startWorkspace(workspace).then(() => {
      // update list of workspaces
      // for new workspace to show in recent workspaces
      this.cheWorkspace.fetchWorkspaces();

      this.cheWorkspace.fetchStatusChange(workspace.id, 'RUNNING').then(() => {
        return this.cheWorkspace.fetchWorkspaceDetails(workspace.id);
      }).then(() => {
        startWorkspaceDefer.resolve();
      }, (error: any) => {
        this.handleError(error);
        startWorkspaceDefer.reject(error);
      });
      this.cheWorkspace.fetchStatusChange(workspace.id, 'ERROR').then((data: any) => {
        startWorkspaceDefer.reject(data);
      });
    }, (error: any) => {
      startWorkspaceDefer.reject(error);
    });

    return startWorkspaceDefer.promise;
  }

  startWorkspace(data: any): ng.IPromise<any> {
    let startWorkspacePromise = this.cheAPI.getWorkspace().startWorkspace(data.id, data.config.defaultEnv);
    return startWorkspacePromise;
  }

  setLoadingParameter(paramName: string, paramValue: string): void {
    this.ideParams.set(paramName, paramValue);
  }

  setIDEAction(ideAction: string): void {
    this.ideAction = ideAction;
  }

  openIde(workspaceId: string): void {
    (this.$rootScope as any).hideNavbar = false;

    this.updateRecentWorkspace(workspaceId);
    let workspace = this.cheWorkspace.getWorkspaceById(workspaceId);

    this.statusByMachine.clear();
    this.outputByMachine = {};
    let machineStatusHandler = (message: any) => {
      console.log('machine status', message);
      this.statusByMachine.set(message.machineName, message.eventType);

    };

    this.hasMachineLog = false;

    let machineOutputHandler = (message: any) => {
      console.log('machine output', message);
      this.hasMachineLog = true;


      if (message.text.contains("Theia app listening on")) {
        this.openIdeAfterRunning(workspaceId);
      }


      if (!this.outputByMachine[message.machineName]) {
        this.outputByMachine[message.machineName] =  [];

      }
      this.outputByMachine[message.machineName].push(message.text);

      console.log('output machine = ', this.outputByMachine);

    };
    let workspaceStatusHandler = (message: any) => {
      console.log('workspace status', message);
      this.workspaceStatus = message.status;

      // Open IDE if workspace is in running state and no machine log has been retrieved
      if (this.workspaceStatus === 'RUNNING' && !this.hasMachineLog) {
        this.openIdeAfterRunning(workspaceId);
      };

    };

    this.jsonRpcMasterApi = this.cheJsonRpcApi.getJsonRpcMasterApi(this.cheAPI.getWorkspace().getJsonRpcApiLocation());

    // register subscribers only if not present
    if (!this.subscribers.has(workspaceId)) {
      this.subscribers.set(workspaceId, true);
      console.log('subscribe on workspace id', workspaceId);
      this.jsonRpcMasterApi.subscribeEnvironmentStatus(workspaceId, machineStatusHandler);
      this.jsonRpcMasterApi.subscribeEnvironmentOutput(workspaceId, machineOutputHandler);
      this.jsonRpcMasterApi.subscribeWorkspaceStatus(workspaceId, workspaceStatusHandler);
    }


    if (workspace.status === 'STARTING') {
        this.cheWorkspace.fetchStatusChange(workspace.id, 'RUNNING').then(() => {
          this.openIdeAfterRunning(workspaceId);
        });
    } else if (workspace.status === 'RUNNING') {
    this.cheWorkspace.fetchWorkspaceDetails(workspaceId).then(() => {
      this.openIdeAfterRunning(workspaceId);
    });

    } else {

        // start it before
      this.startIde(workspace);
    }


    if (this.ideAction != null) {
      // reset action
      this.ideAction = null;
    }

    if (this.ideParams) {
      this.ideParams.clear();
    }
  }

  openIdeAfterRunning(workspaceId: string): void {
    // ok it's started
    let workspaceRuntime: any = this.cheWorkspace.getWorkspaceById(workspaceId);


    let machines: any = workspaceRuntime.runtime.machines;
    let theiaUrl : string;

    console.log('iterating overs keys of machines', machines, 'from runtime', workspaceRuntime);

    Object.keys(machines).forEach((key,index) => {
      let servers : any = machines[key].servers;

      console.log('iterate: key is', key, 'and servers are', servers);

      if (servers['theia']) {
        theiaUrl = servers['theia'].url;
      }
    });

    if (!theiaUrl) {
     this.$timeout(() => {this.openIdeAfterRunning(workspaceId)}, 300);
    }

    console.log('end of iterating, url is', theiaUrl);
    this.openIFrame(workspaceRuntime, theiaUrl);
  }




  openIFrame(workspace: che.IWorkspace, ideUrl: string) : void {


    // perform remove of iframes in parent node. It's needed to avoid any script execution (canceled requests) on iframe source changes.
    let iframeParent = angular.element('#ide-application-frame');
    iframeParent.find('iframe').remove();
    let inDevMode = this.userDashboardConfig.developmentMode;

    if (inDevMode) {
      (this.$rootScope as any).ideIframeLink = this.$sce.trustAsResourceUrl(ideUrl);
    } else {
      (this.$rootScope as any).ideIframeLink = ideUrl;
    }

    // iframe element for IDE application:
    let iframeElement = '<iframe class=\"ide-page-frame\" id=\"ide-application-iframe\" ng-src=\"{{ideIframeLink}}\" ></iframe>';
    this.cheUIElementsInjectorService.injectAdditionalElement(iframeParent, iframeElement);

    let defer = this.$q.defer();
    if (workspace.status === 'RUNNING') {
      defer.resolve();
    } else {
      this.cheWorkspace.fetchStatusChange(workspace.id, 'STARTING').then(() => {
        defer.resolve();
      }, (error: any) => {
        defer.reject(error);
        this.$log.error('Unable to start workspace: ', error);
      });
    }
    defer.promise.then(() => {
      this.displayIDE();
      // update list of recent workspaces
      this.cheWorkspace.fetchWorkspaces();
    });

  }

  /**
   * Emit event to move workspace immediately
   * to top of the recent workspaces list
   *
   * @param workspaceId
   */
  updateRecentWorkspace(workspaceId: string): void {
    this.$rootScope.$broadcast('recent-workspace:set', workspaceId);
  }
}

export default IdeSvc;
