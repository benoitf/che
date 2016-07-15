/*******************************************************************************
 * Copyright (c) 2012-2016 Codenvy, S.A.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Contributors:
 *   Codenvy, S.A. - initial API and implementation
 *******************************************************************************/
package org.eclipse.che.api.local;

import org.eclipse.che.api.workspace.server.spi.tck.StackDaoTest;
import org.testng.annotations.ITestAnnotation;
import org.testng.internal.annotations.IAnnotationTransformer;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;
import java.util.HashSet;
import java.util.Set;

import static java.lang.String.format;

/**
 * ACL and public actions are not part of the local implementation.
 *
 * @author Yevhenii Voevodin
 */
public class StackTestsSkipper implements IAnnotationTransformer {

    private final Set<String> skipTestMethodNames = new HashSet<>();

    {
        skipTestMethodNames.add("shouldFindStacksWithPublicSearchPermission");
        skipTestMethodNames.add("shouldFindStacksWithPublicSearchPermissionSpecifiedForCertainUser");
        skipTestMethodNames.add("shouldFindStacksWithPublicSearchPermissionAndSpecifiedTags");
        for (String skipMethodName : skipTestMethodNames) {
            try {
                StackDaoTest.class.getMethod(skipMethodName);
            } catch (NoSuchMethodException x) {
                throw new RuntimeException(format("'%s' class doesn't contain method '%s' while it is declared to be skipped",
                                                  StackDaoTest.class.getName(),
                                                  skipMethodName));
            }
        }
    }

    @Override
    public void transform(ITestAnnotation annotation, Class testClass, Constructor testConstructor, Method testMethod) {
        if (testMethod != null
            && testMethod.getDeclaringClass() == StackDaoTest.class
            && skipTestMethodNames.contains(testMethod.getName())) {
            annotation.setEnabled(false);
        }
    }
}
