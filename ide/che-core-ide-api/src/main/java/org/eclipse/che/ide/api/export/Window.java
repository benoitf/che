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
import org.eclipse.che.ide.api.editor.EditorAgent;
import org.eclipse.che.ide.api.editor.EditorPartPresenter;
import org.eclipse.che.ide.api.editor.document.Document;
import org.eclipse.che.ide.api.editor.document.ReadOnlyDocument;
import org.eclipse.che.ide.api.editor.texteditor.TextEditor;

/** @author Florent Benoit */
@JsType(namespace = "che")
public class Window {

  private static EditorAgent editorAgent;

  @JsProperty(name = "editor")
  public Editor getEditor() {
    EditorPartPresenter editorPartPresenter = editorAgent.getActiveEditor();
    if (editorPartPresenter instanceof TextEditor) {
      TextEditor textEditor = (TextEditor) editorPartPresenter;
      Editor editor = new Editor();
      Document document = textEditor.getDocument();
      if (document instanceof ReadOnlyDocument) {
        editor.setReadOnlyDocument(textEditor.getDocument());
      }

      return editor;
    }
    return null;
  }

  @JsIgnore
  public static void setEditorAgent(EditorAgent editorAgent) {
    Window.editorAgent = editorAgent;
  }
}
