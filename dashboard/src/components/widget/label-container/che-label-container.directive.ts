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

const htmlLink=require('./che-label-container.html');


/**
 * Defines a directive for creating label container.
 * @author Florent Benoit
 */
export class CheLabelContainer implements ng.IDirective {

  restrict = 'E';
  replace = true;
  transclude = true;
  templateUrl = htmlLink;

  // scope values
  scope = {
    labelName: '@cheLabelName',
    labelDescription: '@?cheLabelDescription',
    alignment: '@cheAlignment'
  };

}
