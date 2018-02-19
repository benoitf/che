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

const htmlLink=require('./project-metadata.html');

/**
 * Defines a directive for the project's metadata.
 *
 * @author Oleksii Kurinnyi
 */
export class ProjectMetadata implements ng.IDirective {
  restrict: string = 'E';
  templateUrl: string = htmlLink;
  replace: boolean = true;

  controller: string = 'ProjectMetadataController';
  controllerAs: string = 'projectMetadataController';

  bindToController: boolean = true;

  scope: {
    [propName: string]: string;
  };

  /**
   * Default constructor that is using resource
   */
  constructor() {
    this.scope = {
      origTemplate: '=template',
      templateName: '@',
      isProjectNameUnique: '&'
    };
  }

}
