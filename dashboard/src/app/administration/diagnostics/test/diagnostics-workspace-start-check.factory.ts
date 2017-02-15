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
import {CheWebsocket, MessageBus} from "../../../../components/api/che-websocket.factory";
import {DiagnosticCallback} from "../diagnostic-callback";
import {CheWorkspace} from "../../../../components/api/che-workspace.factory";
import any = jasmine.any;

/**
 * Test the start of a workspace
 * @author Florent Benoit
 */
export class DiagnosticsWorkspaceStartCheck {

  private $q : ng.IQService;
  private cheWorkspace;
  private lodash;

  /**
   * Default constructor
   * @ngInject for Dependency injection
   */
  constructor ($q : ng.IQService, lodash : any, cheWorkspace: CheWorkspace) {
    this.$q =$q;
    this.lodash = lodash;
    this.cheWorkspace = cheWorkspace;
  }


  deleteDiagnosticWorkspaceIfPresent(diagnosticCallback : DiagnosticCallback) : ng.IPromise {
    let defered = this.$q.defer();
    this.cheWorkspace.fetchWorkspaces().finally(() => {
      let workspaces: Array<che.IWorkspace> = this.cheWorkspace.getWorkspaces();
      let workspace: any = this.lodash.find(workspaces, (workspace: che.IWorkspace) => {
        return workspace.config.name === 'diagnostics';
      });
      // need to delete it
      if (workspace) {
        // first stop
        if (workspace.status === 'RUNNING' || workspace.status === 'STARTING') {
          // listen on the events
          let eventChannelLink = this.lodash.find(workspace.links, (link: any) => {
            return link.rel === 'get workspace events channel';
          });
          let eventChannel = eventChannelLink ? eventChannelLink.parameters[0].defaultValue : null;
          diagnosticCallback.subscribeChannel(eventChannel, (message: any) => {
            if (message.eventType === 'STOPPED') {
              diagnosticCallback.unsubscribeChannel(eventChannel);
              diagnosticCallback.progress("Removing existing workspace");
              this.cheWorkspace.deleteWorkspaceConfig(workspace.id).finally(() => {
                defered.resolve(true);
              });
            } else if ('ERROR' === message.eventType) {
              defered.reject(message.content);
            }
          });
          diagnosticCallback.progress("Stopping existing workspace");
          this.cheWorkspace.stopWorkspace(workspace.id, false);
        } else {
          diagnosticCallback.progress("Removing existing workspace");
          this.cheWorkspace.deleteWorkspaceConfig(workspace.id).finally(() => {
            defered.resolve(true);
          });
        }
      } else {
        defered.resolve(true);
      }
    }).catch((error) => {
      defered.reject(error);
    });
    return defered.promise;
  }

  recreateDiagnosticWorkspace(diagnosticCallback : DiagnosticCallback) : ng.IPromise<che.IWorkspace> {
    let defered = this.$q.defer();

    // delete if present
    this.deleteDiagnosticWorkspaceIfPresent(diagnosticCallback).then(() => {
      // now create workspace config
      let workspaceConfig: che.IWorkspaceConfig = {
        "projects": [],
        "environments": {
          "diagnostics": {
            "machines": {
              "dev-machine": {
                "agents": ["org.eclipse.che.ws-agent"],
                "servers": {},
                "attributes": {"memoryLimitBytes": "1147483648"}
              }
            },
            "recipe": {
              "content": "FROM openjdk:8-jre-alpine\nCMD tail -f /dev/null\n",
              "contentType": "text/x-dockerfile",
              "type": "dockerfile"
            }
          }
        },
        "name": "diagnostics",
        "defaultEnv": "diagnostics",
        "description": "Diagnostics Workspace",
        "commands": []
      };
      diagnosticCallback.progress("Creating workspace");
      return this.cheWorkspace.createWorkspaceFromConfig(null, workspaceConfig);
    }).then((workspace) => {
      defered.resolve(workspace);
    }).catch((error) => {
        defered.reject(error);
      }
    );
    return defered.promise;
  }


  start(diagnosticCallback : DiagnosticCallback) : ng.IPromise {
    diagnosticCallback.progress("Starting test");

    this.recreateDiagnosticWorkspace(diagnosticCallback).then((workspace : che.IWorkspace) => {

      let statusLink = this.lodash.find(workspace.links, (link: any) => {
        return link.rel === 'environment.status_channel';
      });

      let eventChannelLink = this.lodash.find(workspace.links, (link: any) => {
        return link.rel === 'get workspace events channel';
      });

      let outputLink = this.lodash.find(workspace.links, (link: any) => {
        return link.rel === 'environment.output_channel';
      });

      let eventChannel = eventChannelLink ? eventChannelLink.parameters[0].defaultValue : null;
      let agentChannel = eventChannel + ':ext-server:output';
      let statusChannel = statusLink ? statusLink.parameters[0].defaultValue : null;
      let outputChannel = outputLink ? outputLink.parameters[0].defaultValue : null;

      diagnosticCallback.shared("workspace", workspace);
      diagnosticCallback.subscribeChannel(eventChannel, (message: any) => {
        console.log('eventChannel channel =', message);
        if (message.eventType === 'RUNNING') {

          this.cheWorkspace.fetchWorkspaces().then(() => {
            let workspace = diagnosticCallback.getShared('workspace');
            this.cheWorkspace.fetchWorkspaceDetails(workspace.id).then(() => {
              diagnosticCallback.shared("workspace", this.cheWorkspace.getWorkspaceById(workspace.id));
              diagnosticCallback.success("Starting workspace OK");
            })
          });
        }
      });

      if (statusChannel) {
        diagnosticCallback.subscribeChannel(statusChannel, (message: any) => {
          if (message.eventType === 'DESTROYED' && message.workspaceId === workspace.id) {
            diagnosticCallback.error("Error while starting the workspace : " + message);
          }
          if (message.eventType === 'ERROR' && message.workspaceId === workspace.id) {
            diagnosticCallback.error("Error while starting the workspace : " + message);
          }

          //this.$log.log('Status channel of workspaceID', workspaceId, message);
          console.log("status channel message :", message);
        });
      }


      diagnosticCallback.subscribeChannel(agentChannel, (message: any) => {
        console.log('agent channel =', message);
        diagnosticCallback.addContent(message);
      });

      if (outputChannel) {
        diagnosticCallback.subscribeChannel(outputChannel, (message: any) => {
          let content : string = angular.fromJson(message).content;
          diagnosticCallback.addContent(content);

          // check if connected (always pull)
          if (content.indexOf("Client.Timeout exceeded while awaiting headers") > 0) {
            diagnosticCallback.error("Docker is trying to pull the image with auto pull mode. Try to disable the flag che.docker.always_pull_image (off) or enable Internet Connection from Docker node.");
          }


          console.log("output channel message :", message);
        });
      }

      diagnosticCallback.delayError("Test limit is for up to 5minutes. Time has exceed.", 5 * 60 * 1000);

      let startWorkspacePromise = this.cheWorkspace.startWorkspace(workspace.id, workspace.config.defaultEnv);
      startWorkspacePromise.then((workspaceData) => {
        diagnosticCallback.shared("workspace", workspaceData);
        console.log("Start workspace promise finished");
      })

    }).catch((error) => {
      diagnosticCallback.error('Unable to start workspace: ' + error);
    });


    return diagnosticCallback.getPromise();

  }


}
