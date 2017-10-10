/*
 * Copyright (c) 2012-2017 Red Hat, Inc.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Red Hat, Inc. - initial API and implementation
 */
package org.eclipse.che.ide.api.export;

import jsinterop.annotations.JsIgnore;
import jsinterop.annotations.JsProperty;
import jsinterop.annotations.JsType;
import org.eclipse.che.ide.api.action.Action;
import org.eclipse.che.ide.api.action.ActionManager;
import org.eclipse.che.ide.api.action.DefaultActionGroup;

/** @author Florent Benoit */
@JsType(namespace = "che")
public class Actions {

  private static ActionManager actionManager;

  @JsProperty(name = "actionManager")
  public ActionManager getActionManager() {
    return Actions.actionManager;
  }

  @JsIgnore
  public static void setActionManager(ActionManager actionManager) {
    Actions.actionManager = actionManager;
  }

  public void addActionMenu(String groupMenu, Action action) {
    DefaultActionGroup group = (DefaultActionGroup) actionManager.getAction(groupMenu);
    group.add(action);
  }
}
