/*******************************************************************************
 * Copyright (c) 2012-2017 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 *******************************************************************************/
package org.eclipse.che.plugin.languageserver.ide.editor;

import org.eclipse.che.ide.api.editor.document.Document;
import org.eclipse.che.ide.api.editor.events.DocumentChangeEvent;
import org.eclipse.che.ide.api.editor.events.DocumentChangeHandler;
import org.eclipse.che.ide.api.editor.reconciler.DirtyRegion;
import org.eclipse.che.ide.api.editor.reconciler.ReconcilingStrategy;
import org.eclipse.che.ide.api.editor.text.Region;
import org.eclipse.che.plugin.languageserver.ide.editor.sync.TextDocumentSynchronize;
import org.eclipse.che.plugin.languageserver.ide.editor.sync.TextDocumentSynchronizeFactory;
import org.eclipse.lsp4j.ServerCapabilities;
import org.eclipse.lsp4j.TextDocumentSyncKind;
import org.eclipse.lsp4j.TextDocumentSyncOptions;
import org.eclipse.lsp4j.jsonrpc.messages.Either;

import com.google.inject.Inject;
import com.google.inject.assistedinject.Assisted;

/**
 * Responsible for document synchronization
 *
 * @author Evgen Vidolob
 */
public class LanguageServerReconcileStrategy implements ReconcilingStrategy {

    private int version = 0;
    private final TextDocumentSynchronize synchronize;

    @Inject
    public LanguageServerReconcileStrategy(TextDocumentSynchronizeFactory synchronizeFactory,
                                           @Assisted ServerCapabilities serverCapabilities) {

        Either<TextDocumentSyncKind, TextDocumentSyncOptions> documentSync = serverCapabilities.getTextDocumentSync();
        synchronize = synchronizeFactory.getSynchronize(documentSync.isLeft() ? documentSync.getLeft() : documentSync.getRight().getChange());
    }

    @Override
    public void setDocument(Document document) {
        document.getDocumentHandle().getDocEventBus().addHandler(DocumentChangeEvent.TYPE, new DocumentChangeHandler() {
            @Override
            public void onDocumentChange(DocumentChangeEvent event) {
                synchronize.syncTextDocument(event, ++version);
            }
        });
    }

    @Override
    public void reconcile(DirtyRegion dirtyRegion, Region subRegion) {
        doReconcile();
    }

    public void doReconcile() {
        //TODO use DocumentHighlight to add additional highlight for file
    }

    @Override
    public void reconcile(Region partition) {
        doReconcile();
    }

    @Override
    public void closeReconciler() {

    }
}
