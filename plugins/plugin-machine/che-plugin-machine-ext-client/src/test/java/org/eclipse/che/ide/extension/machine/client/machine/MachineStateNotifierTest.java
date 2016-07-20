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
package org.eclipse.che.ide.extension.machine.client.machine;

import com.google.gwt.event.shared.SimpleEventBus;
import com.google.web.bindery.event.shared.EventBus;

import org.eclipse.che.api.machine.shared.dto.MachineConfigDto;
import org.eclipse.che.api.machine.shared.dto.MachineDto;
import org.eclipse.che.api.machine.shared.dto.event.MachineStatusEvent;
import org.eclipse.che.api.promises.client.Operation;
import org.eclipse.che.api.promises.client.Promise;
import org.eclipse.che.api.promises.client.PromiseError;
import org.eclipse.che.ide.api.app.AppContext;
import org.eclipse.che.ide.api.machine.MachineServiceClient;
import org.eclipse.che.ide.api.notification.NotificationManager;
import org.eclipse.che.ide.api.notification.StatusNotification;
import org.eclipse.che.ide.api.workspace.event.EnvironmentStatusChangedEvent;
import org.eclipse.che.ide.api.workspace.event.WorkspaceStartedEvent;
import org.eclipse.che.ide.extension.machine.client.MachineLocalizationConstant;
import org.eclipse.che.ide.extension.machine.client.perspective.widgets.machine.panel.MachinePanelPresenter;
import org.eclipse.che.ide.rest.DtoUnmarshallerFactory;
import org.eclipse.che.ide.ui.loaders.initialization.InitialLoadingInfo;
import org.eclipse.che.ide.websocket.MessageBus;
import org.eclipse.che.ide.websocket.MessageBusProvider;
import org.eclipse.che.ide.websocket.rest.Unmarshallable;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Matchers;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;

import static org.eclipse.che.api.machine.shared.dto.event.MachineStatusEvent.EventType.CREATING;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.junit.Assert.assertThat;

/**
 * @author Dmitry Shnurenko
 */
@RunWith(MockitoJUnitRunner.class)
public class MachineStateNotifierTest {

    private static final String SOME_TEXT    = "someText";
    private static final String MACHINE_NAME = "machineName";
    private static final String MACHINE_ID   = "machineId";

    private EventBus eventBus = new SimpleEventBus();

    //constructor mocks
    @Mock
    private InitialLoadingInfo initialLoadingInfo;
    @Mock
    private NotificationManager         notificationManager;
    @Mock
    private MachineLocalizationConstant locale;
    @Mock
    private MachineServiceClient        machineServiceClient;





    //additional mocks
    @Mock
    private Unmarshallable<MachineStatusEvent> unmarshaller;
    @Mock
    private MachineDto                         machine;
    @Mock
    private MachineConfigDto                   machineConfig;
    @Mock
    private MessageBus                         messageBus;
    @Mock
    private StatusNotification                 notification;
    @Mock
    private WorkspaceStartedEvent              event;


    @Mock
    private EnvironmentStatusChangedEvent environmentStatusChangedEvent;

    @Captor
    private ArgumentCaptor<StatusNotification>            notificationCaptor;
    @Captor
    private ArgumentCaptor<WorkspaceStartedEvent.Handler> startWorkspaceHandlerCaptor;

    @Mock
    private Promise<MachineDto> machinePromise;

    @Captor
    private ArgumentCaptor<Operation<MachineDto>> machineCaptor;

    @Captor
    private ArgumentCaptor<MachineStateEvent> machineStateEventCaptor;

    @InjectMocks
    private MachineStatusNotifier stateNotifier;

    @Before
    public void setUp() {
//        when(dtoUnmarshallerFactory.newWSUnmarshaller(MachineStatusEvent.class)).thenReturn(unmarshaller);
//
//        when(locale.notificationCreatingMachine(SOME_TEXT)).thenReturn(SOME_TEXT);
//        when(locale.notificationDestroyingMachine(SOME_TEXT)).thenReturn(SOME_TEXT);
//
//        when(messageBusProvider.getMessageBus()).thenReturn(messageBus);
//
//        when(machine.getConfig()).thenReturn(machineConfig);
//
//        verify(eventBus).addHandler(eq(WorkspaceStartedEvent.TYPE), startWorkspaceHandlerCaptor.capture());
//        startWorkspaceHandlerCaptor.getValue().onWorkspaceStarted(event);

        MachineStatusNotifier statusNotifier = new MachineStatusNotifier(eventBus, );

        when(environmentStatusChangedEvent.getMachineId()).thenReturn(MACHINE_ID);
        when(environmentStatusChangedEvent.getMachineName()).thenReturn(MACHINE_NAME);
        when(machineServiceClient.getMachine(MACHINE_ID)).thenReturn(machinePromise);
        when(machinePromise.then(Matchers.<Operation<MachineDto>>anyObject())).thenReturn(machinePromise);
        when(machinePromise.catchError(Matchers.<Operation<PromiseError>>anyObject())).thenReturn(machinePromise);
    }

    @Test
    public void shouldNotifyWhenDevMachineStateIsCreating() throws Exception {
        MachineDto machineDto = mock(MachineDto.class);
        MachineConfigDto machineConfigDto = mock(MachineConfigDto.class);
        when(machineDto.getConfig()).thenReturn(machineConfigDto);
        when(machineConfigDto.isDev()).thenReturn(false);

        when(environmentStatusChangedEvent.getEventType()).thenReturn(CREATING);
        stateNotifier.onEnvironmentStatusChanged(environmentStatusChangedEvent);

        verify(machinePromise).then(machineCaptor.capture());
        machineCaptor.getValue().apply(machineDto);

        eventBus.addHandler(MachineStateEvent.TYPE, new MachineStateEvent.Handler() {
            @Override
            public void onMachineCreating(MachineStateEvent event) {
                event.getMachine();
            }

            @Override
            public void onMachineRunning(MachineStateEvent event) {

            }

            @Override
            public void onMachineDestroyed(MachineStateEvent event) {

            }
        });
//        verify(eventBus).fireEvent(machineStateEventCaptor.capture());
//        MachineStateEvent machineStateEvent = machineStateEventCaptor.getValue();

//        assertTrue();
    }

}
