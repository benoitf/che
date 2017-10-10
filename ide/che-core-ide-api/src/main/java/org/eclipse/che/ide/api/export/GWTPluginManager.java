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

import com.google.gwt.core.client.GWT;
import java.util.HashMap;
import java.util.Map;
import jsinterop.annotations.JsType;

/** @author Florent Benoit */
@JsType(namespace = "che")
public class GWTPluginManager {

  private static Map<String, PluginModule> pluginModules = new HashMap<>();

  public GWTPluginManager() {}

  public void loadPlugins() {
    pluginModules.values().forEach(pluginModule -> pluginModule.load());
  }

  public void unloadPlugins() {
    pluginModules.values().forEach(pluginModule -> pluginModule.load());
  }

  public void registerModule(String name, PluginModule pluginModule) {
    GWTPluginManager.pluginModules.put(name, pluginModule);
    GWT.log("Registering module with name" + name + " and module " + pluginModule);
    pluginModule.load();
  }
}
