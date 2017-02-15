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
import {DiagnosticsWebsocketWsMaster} from "./test/diagnostics-websocket-wsmaster.factory";
import {DiagnosticState} from "./diagnostic-state";
import {DiagnosticItem} from "./diagnostic-item";
import {DiagnosticCallback} from "./diagnostic-callback";
import {DiagnosticsWorkspaceStartCheck} from "./test/diagnostics-workspace-start-check.factory";
import {MessageBus, CheWebsocket} from "../../../components/api/che-websocket.factory";
import {DiagnosticsRunningWorkspaceCheck} from "./test/diagnostics-workspace-check-workspace.factory";

/**
 * @ngdoc controller
 * @name administration.diagnostics.controller:DiagnosticsController
 * @description This class is handling the controller for the diagnostics page
 * @author Florent Benoit
 */
export class DiagnosticsController {


  $q: ng.IQService;
  $log: ng.ILogService;
  lodash: any;
  $mdDialog: ng.material.IDialogService;

  private isTesting: boolean = false;

  private items : Array<DiagnosticItem>;
  private diagnosticsWebsocketWsMaster : DiagnosticsWebsocketWsMaster;
  private diagnosticsWorkspaceStartCheck : DiagnosticsWorkspaceStartCheck;

  private messageBus : MessageBus;
  private $timeout : ng.ITimeoutService;
  private sharedMap : Map<string, any>;
  private diagnosticsRunningWorkspaceCheck : DiagnosticsRunningWorkspaceCheck;

  /**
   * Default constructor that is using resource
   * @ngInject for Dependency injection
   */
  constructor($log: ng.ILogService, $mdDialog: ng.material.IDialogService, $q: ng.IQService, lodash: any,
              $timeout : ng.ITimeoutService,
              diagnosticsWebsocketWsMaster : DiagnosticsWebsocketWsMaster,
              cheWebsocket: CheWebsocket,
              diagnosticsRunningWorkspaceCheck : DiagnosticsRunningWorkspaceCheck,
              diagnosticsWorkspaceStartCheck : DiagnosticsWorkspaceStartCheck) {
    this.$q = $q;
    this.$log = $log;
    this.lodash = lodash;
    this.$timeout = $timeout;
    this.$mdDialog = $mdDialog;
    this.diagnosticsWebsocketWsMaster = diagnosticsWebsocketWsMaster;
    this.diagnosticsWorkspaceStartCheck = diagnosticsWorkspaceStartCheck;
    this.diagnosticsRunningWorkspaceCheck = diagnosticsRunningWorkspaceCheck;
    this.items = new Array<DiagnosticItem>();
    this.messageBus = cheWebsocket.getBus();
    this.sharedMap = new Map<string, any>();
  }

  public start() : void {
    this.items.length = 0;
    this.sharedMap.clear();
    this.isTesting = true;

    // First check websocket on workspace master
    this.checkWebsocketWsMaster().then(() => {
      return this.checkWorkspaceStart();
    }).then(() => {
      return this.$q.all([this.checkWorkspaceCheck(), this.checkExecAgent()]);
    }).catch((error) => {
      let item : DiagnosticItem = new DiagnosticItem();
      item.title = "Diagnostic aborting...";
      item.state = DiagnosticState.ABORT;
      item.message = error;
      this.items.push(item);
    }).finally(() => {
      this.isTesting = false;
      }
    )
  }

  private newItem(text: string) : DiagnosticCallback {
    let item : DiagnosticItem = new DiagnosticItem();
    this.items.push(item);
    return new DiagnosticCallback(this.$q, this.messageBus, this.$timeout, text, item, this.sharedMap);
  }


  public checkWebsocketWsMaster() : ng.IPromise {
    return this.diagnosticsWebsocketWsMaster.start(this.newItem("Test Websocket"));
  }

  public checkWorkspaceStart() : ng.IPromise {
    return this.diagnosticsWorkspaceStartCheck.start(this.newItem("Test Workspace creation"));
  }

  public checkWorkspaceCheck() : ng.IPromise {
    return this.diagnosticsRunningWorkspaceCheck.checkWsAgent(this.newItem("WS Agent"))
  }

  public checkExecAgent() : ng.IPromise {
    return this.diagnosticsRunningWorkspaceCheck.checkExecAgent(this.newItem("Exec Agent"))
  }


  public isReady(item : DiagnosticItem) {
    return DiagnosticState.READY === item.state;
  }

  public isInProgress(item : DiagnosticItem) {
    return DiagnosticState.IN_PROGRESS === item.state;
  }

  public isOk(item : DiagnosticItem) {
    return DiagnosticState.OK === item.state;
  }

  public isError(item : DiagnosticItem) {
    return DiagnosticState.ERROR === item.state;
  }

  public isFailure(item : DiagnosticItem) {
    return DiagnosticState.FAILURE === item.state;
  }

  public isAbort(item : DiagnosticItem) {
    return DiagnosticState.ABORT === item.state;
  }

}
