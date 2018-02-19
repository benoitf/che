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

const htmlLink=require('./share-workspace.html');

/**
 * @ngdoc directive
 * @name workspaces.details.directive:shareWorkspace
 * @restrict E
 * @element
 *
 * @description
 * <share-workspace></share-workspace> for managing sharing the workspace.
 *
 * @usage
 *   <share-workspace></share-workspace>
 *
 * @author Ann Shumilova
 */
export class ShareWorkspace implements ng.IDirective {
  restrict = 'E';
  templateUrl = htmlLink;

  controller = 'ShareWorkspaceController';
  controllerAs = 'shareWorkspaceController';
  bindToController = true;
}
