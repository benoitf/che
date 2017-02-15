import {DiagnosticItem} from "./diagnostic-item";
import {DiagnosticState} from "./diagnostic-state";
import {MessageBus} from "../../../components/api/che-websocket.factory";
export class DiagnosticCallback {

  private diagnosticItem : DiagnosticItem;

  /**
   * Promise service handling.
   */
  private $q : ng.IQService;

  /**
   * Promise service handling.
   */
  private $q : ng.IQService;

  private messageBus : MessageBus;

  private defered : ng.IDeferred;

  private listeningChannels : Array<string>;

  private timeoutPromises : Array<ng.IPromise>;
  private $timeout : ng.ITimeoutService;
  private sharedMap : Map<string, any>;

  constructor($q : ng.IQService, messageBus : MessageBus, $timeout : ng.ITimeoutService, name: string, diagnosticItem : DiagnosticItem, sharedMap : Map<string, any>) {
    this.$q = $q;
    this.messageBus = messageBus;
    this.$timeout = $timeout;
    this.defered = $q.defer();
    this.listeningChannels = new Array<string>();
    this.timeoutPromises = new Array<ng.IPromise>();
    this.diagnosticItem = diagnosticItem;
    diagnosticItem.title = name;
    diagnosticItem.state = DiagnosticState.READY;
    this.sharedMap = sharedMap;
  }

  public shared(key:string, value : any) : void {
    this.sharedMap.set(key, value);
  }
  
  public getShared(key:string) : any {
    return this.sharedMap.get(key);
  }
  
  public progress(message? : string) : void {
    if (message) {
      this.diagnosticItem.message = message;
    }
    this.diagnosticItem.state = DiagnosticState.IN_PROGRESS;
  }

  public success(message : string) : void {
    this.diagnosticItem.message = message;
    this.diagnosticItem.state = DiagnosticState.OK;
    this.cleanup();
    this.defered.resolve(message);
  }

  public failure(message : string) : void {
    this.diagnosticItem.message = message;
    this.diagnosticItem.state = DiagnosticState.FAILURE;
    this.cleanup();
    this.defered.resolve(message);
  }


  public error(message : string) : void {
    this.diagnosticItem.message = message;
    this.diagnosticItem.state = DiagnosticState.ERROR;
    this.cleanup();
    this.defered.reject(message);
  }

  public addContent(content : string) : void {
    console.log('add content', content);
    if (!this.diagnosticItem.content) {
      this.diagnosticItem.content = content;
    } else {
      this.diagnosticItem.content += '\n' + content;
    }
  }

  public getPromise() : ng.IPromise {
    return this.defered.promise;
  }

  public getMessageBus() : MessageBus {
    return this.messageBus;
  }

  delayError(message: string, delay: number) {
    let promise = this.$timeout(() => {this.error(message)}, delay);
    this.timeoutPromises.push(promise);
  }


  public subscribeChannel(channel : string, callback : any) : void {
    this.messageBus.subscribe(channel, callback);
    this.listeningChannels.push(channel);
  }

  public unsubscribeChannel(channel : string) : void {
    this.messageBus.unsubscribe(channel);
    let index : number = this.listeningChannels.indexOf(channel);
    if (index >= 0) {
      delete this.listeningChannels[index];
    }
  }

  protected cleanup() : void {
    this.timeoutPromises.forEach((promise: ng.IPromise) => {
      console.log('canceling promise ', promise);
      this.$timeout.cancel(promise);
    });
    this.timeoutPromises.length = 0;

    this.listeningChannels.forEach((channel: string) => {
      this.messageBus.unsubscribe(channel);
    });
    this.listeningChannels.length = 0;

  }

}
