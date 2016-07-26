/// <reference path='./typings/tsd.d.ts' />

import {WorkspaceDto} from './dto/workspacedto';

export class Workspace {

    http: any;
    remoteHostname : String;
    port : number;

    constructor(remoteHostname: String, port : number) {
        this.http = require('http');
        this.remoteHostname = remoteHostname;
        this.port = port;

    }


    createWorkspace(workspaceName: String, dockerContent: String) : Promise<WorkspaceDto> {

        var options = {
            hostname: this.remoteHostname,
            port: this.port,
            path: '/api/workspace?account=',
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };


        let p = new Promise<WorkspaceDto>( (resolve, reject) => {
            var req = this.http.request(options,  (res) => {
                res.on('data', function (body) {

                    if (res.statusCode == 201) {
                        // workspace created, continue
                        resolve(new WorkspaceDto(JSON.parse(body)));
                    } else {
                        // error
                        reject(body);
                    }
                });

            });

            req.on('error', (err) => {
                reject('HTTP error: ' + err);
            });


            var workspace = {
                "defaultEnv": "default",
                "commands": [],
                "projects": [],
                "environments": [{
                    "machineConfigs": [{
                        "dev": true,
                        "servers": [],
                        "envVariables": {},
                        "limits": {"ram": 2500},
                        "source": {"type": "dockerfile", "content": dockerContent},
                        "name": "default",
                        "type": "docker",
                        "links": []
                    }], "name": "default"
                }],
                "name": workspaceName,
                "links": [],
                "description": null
            };


            req.write(JSON.stringify(workspace));
            req.end();

        });






        return p;
    }



    startWorkspace(workspaceId: String) : Promise<WorkspaceDto> {
console.log('call start Workspace with id', workspaceId);

        var options = {
            hostname: this.remoteHostname,
            port: this.port,
            path: '/api/workspace/' + workspaceId + '/runtime?environment=default',
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json;charset=UTF-8'
            }
        };


        console.log('call start Workspace with id2', workspaceId);
        let p = new Promise<WorkspaceDto>( (resolve, reject) => {
            var req = this.http.request(options,  (res) => {

                console.log('call start Workspace with id3', workspaceId);
                res.on('error', function (body) {
                    console.log('got the following error', body.toString());


                });

                res.on('data', function (body) {
                    console.log('got the following res code', res.statusCode);
console.log('got the following code', body.toString());
                    if (res.statusCode == 200) {
                        // workspace created, continue
                        resolve(new WorkspaceDto(JSON.parse(body)));
                    } else {
                        // error
                        reject(body);
                    }
                });

            });

            req.on('error', (err) => {
                console.log('call start Workspace with id4', workspaceId, err);

                reject('HTTP error: ' + err);
            });

            console.log('call start Workspace with id5', workspaceId);

            req.write('{}');
            req.end();
            console.log('call start Workspace with id7', workspaceId);

        });
        console.log('call start Workspace with id6', workspaceId);

        return p;
    }


}