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

import com.google.gwt.core.client.ScriptInjector;
import java.util.List;
import jsinterop.annotations.JsIgnore;
import jsinterop.annotations.JsType;
import org.eclipse.che.ide.api.export.panel.HtmlPresenter;
import org.eclipse.che.ide.api.parts.PartPresenter;
import org.eclipse.che.ide.api.parts.PartStack;
import org.eclipse.che.ide.api.parts.PartStackType;
import org.eclipse.che.ide.api.parts.WorkspaceAgent;

/** @author Florent Benoit */
@JsType(namespace = "che")
public class Panels {

  private static WorkspaceAgent workspaceAgent;

  @JsIgnore
  public static void setWorkspaceAgent(WorkspaceAgent workspaceAgent) {
    Panels.workspaceAgent = workspaceAgent;
  }

  public void addInformationPanel(String title, String html, String scriptContent) {
    addPanel(title, html, scriptContent, PartStackType.INFORMATION);
  }

  public void addNavigationPanel(String title, String html, String scriptContent) {
    addPanel(title, html, scriptContent, PartStackType.NAVIGATION);
  }

  public void addEditingPanel(String title, String html, String scriptContent) {
    addPanel(title, html, scriptContent, PartStackType.EDITING);
  }

  public void addToolingPanel(String title, String html, String scriptContent) {
    addPanel(title, html, scriptContent, PartStackType.TOOLING);
  }

  @JsIgnore
  protected void addPanel(
      String title, String html, String scriptContent, PartStackType partStackType) {
    PartStack partStack = workspaceAgent.getPartStack(partStackType);

    if (scriptContent != null) {
      ScriptInjector.fromString(scriptContent)
          .setRemoveTag(false)
          .setWindow(ScriptInjector.TOP_WINDOW)
          .inject();
    }

    HtmlPresenter htmlPresenter = new HtmlPresenter();
    htmlPresenter.setTitle(title);
    htmlPresenter.setHtmlCode(html);
    partStack.addPart(htmlPresenter);
  }


  public void removeInformationPanel(String title) {
    removePanel(title, PartStackType.INFORMATION);
  }

  public void removeNavigationPanel(String title) {
    removePanel(title, PartStackType.NAVIGATION);
  }

  public void removeEditingPanel(String title) {
    removePanel(title, PartStackType.EDITING);
  }

  public void removeToolingPanel(String title) {
    removePanel(title, PartStackType.TOOLING);
  }

  @JsIgnore
  public void removePanel(String title, PartStackType partStackType) {
      PartStack partStack = workspaceAgent.getPartStack(partStackType);
      List<? extends PartPresenter> parts = partStack.getParts();
      for (PartPresenter partPresenter : parts) {
        if (title.equals(partPresenter.getTitle())) {
          partStack.removePart(partPresenter);
        }
      }

  }
}
