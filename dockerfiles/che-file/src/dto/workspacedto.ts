export class WorkspaceDto {

    id: String;
    content: any;


    constructor(workspaceObject: any) {
        this.id = workspaceObject.id;
        this.content = workspaceObject;
    }

    getId() : String {
        return this.id;
    }

    getContent() : any {
        return this.content;
    }
}