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
package org.eclipse.che.ide.api.export.panel;

import com.google.gwt.user.client.ui.AcceptsOneWidget;
import com.google.gwt.user.client.ui.HTML;
import com.google.gwt.user.client.ui.IsWidget;
import org.eclipse.che.ide.api.parts.AbstractPartPresenter;

/** @author Florent Benoit */
public class HtmlPresenter extends AbstractPartPresenter {

  private HTML html = new HTML();
  private String title;
  private String titleTooltip;
  private String htmlCode;

  /**
   * Allows presenter to expose it's view to the container.
   *
   * @param container
   */
  @Override
  public void go(AcceptsOneWidget container) {
    html.setHTML(htmlCode);
    container.setWidget(html);
  }

  /** @return Title of the Part */
  @Override
  public String getTitle() {
    return title;
  }

  @Override
  public IsWidget getView() {
    return html;
  }

  /**
   * Returns the title tool tip text of this part. An empty string result indicates no tool tip. If
   * this value changes the part must fire a property listener event with <code>PROP_TITLE</code>.
   *
   * <p>The tool tip text is used to populate the title bar of this part's visual container.
   *
   * @return the part title tool tip (not <code>null</code>)
   */
  @Override
  public String getTitleToolTip() {
    return titleTooltip;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public void setTitleTooltip(String titleTooltip) {
    this.titleTooltip = titleTooltip;
  }

  public void setHtmlCode(String htmlCode) {
    this.htmlCode = htmlCode;
  }
}
