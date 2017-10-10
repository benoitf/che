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
import jsinterop.annotations.JsType;
import org.eclipse.che.ide.api.action.Action;
import org.eclipse.che.ide.api.action.ActionEvent;

/** @author Florent Benoit */
@JsType(namespace = "che.actions")
public class SimpleAction extends Action {

  private MyActionCall myActionCall;

  public SimpleAction(String title, String desc, MyActionCall myActionCall) {
    super(title, desc);
    this.myActionCall = myActionCall;
  }

  /**
   * Implement this method to provide your action handler.
   *
   * @param e Carries information on the invocation place
   */
  @JsIgnore
  @Override
  public void actionPerformed(ActionEvent e) {
    myActionCall.actionPerformed(e);
  }
}
