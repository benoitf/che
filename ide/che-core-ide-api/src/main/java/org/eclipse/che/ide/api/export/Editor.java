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
import org.eclipse.che.ide.api.editor.document.ReadOnlyDocument;

/** @author Florent Benoit */
@JsType
public class Editor {

  private ReadOnlyDocument readOnlyDocument;

  @JsIgnore
  public void setReadOnlyDocument(ReadOnlyDocument readOnlyDocument) {
    this.readOnlyDocument = readOnlyDocument;
  }

  @JsProperty(name = "readonlyDocument")
  public ReadOnlyDocument getReadOnlyDocument() {
    return readOnlyDocument;
  }
}
