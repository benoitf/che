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
import {DiagnosticCallback} from "../diagnostic-callback";
import {CheWorkspace} from "../../../../components/api/che-workspace.factory";
import any = jasmine.any;

/**
 * Test a workspace that is flagged as RUNNING by the server side.
 * @author Florent Benoit
 */
export class DiagnosticsRunningWorkspaceCheck {

  private $q : ng.IQService;
  private cheWorkspace;
  private lodash;
  private $resource : ng.resource.IResourceService;

  /**
   * Default constructor
   * @ngInject for Dependency injection
   */
  constructor ($q : ng.IQService, lodash : any, cheWorkspace: CheWorkspace, $resource : ng.resource.IResourceService) {
    this.$q =$q;
    this.lodash = lodash;
    this.cheWorkspace = cheWorkspace;
    this.$resource = $resource;

  }

  checkExecAgent(diagnosticCallback : DiagnosticCallback) : ng.IPromise {
    diagnosticCallback.delayError("Unable to ping exec agent", 3000);
    return diagnosticCallback.getPromise();
  }


  checkWsAgent(diagnosticCallback : DiagnosticCallback) : ng.IPromise {
    diagnosticCallback.progress("Execute command with exec agent...");
    let workspace : che.IWorkspace = diagnosticCallback.getShared("workspace");

    let wsAgentLink = this.lodash.find(workspace.runtime.links, (link: any) => {
      return link.rel === 'wsagent';
    });

    let wsAgentHRef = wsAgentLink.href;
    wsAgentHRef = 'http://localhost:365646/api';

    // connect to the workspace agent
    let resourceAPI : any = this.$resource(wsAgentHRef + '/', {}, {
      getDetails: {method: 'OPTIONS'}
    }, {
      stripTrailingSlashes: false
    });

    resourceAPI.getDetails().$promise.then((data) => {
      diagnosticCallback.success("Able to get WS agent SCM revision " + angular.fromJson(data).scmRevision + " from " + wsAgentHRef);
    }).catch((error) => {
      diagnosticCallback.failure("Unable to call WS agent on " + wsAgentHRef + ": " + error);
    });


    return diagnosticCallback.getPromise();
  }


}
