import { Injectable, OnDestroy } from "@angular/core";
import { HubConnection, HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import { environment } from "../../../../environments/environment";
import { ACCES_TOKEN_KEY } from "../../../modules/auth/resources/models/tokens";
import { SignalRType } from "../../../shared/models/signalR-type";

@Injectable({
  providedIn: 'root'
})
export class SignalRService implements OnDestroy {
  private hubConnection: HubConnection | null = null;

  constructor() {}

  public startConnection = (): Promise<void> => {
    if (this.hubConnection !== null) {
      return Promise.resolve();
    }

    this.hubConnection = new HubConnectionBuilder()
      .withUrl(environment.baseUrl + '/notifications', { accessTokenFactory: () => localStorage.getItem(ACCES_TOKEN_KEY)! })
      .withAutomaticReconnect()
      .configureLogging(LogLevel.Information)
      .build();

      return this.hubConnection
        .start()
        .then(() => console.log('Connection started...'))
        .catch(err => {
          console.error('Error while starting connection: ' + err);
          throw err;
        });
  }

  public stopConnection = (): void => {
    if (this.hubConnection && this.hubConnection.state === 'Connected') {
      this.hubConnection.stop()
        .then(() => console.log('Connection stopped'))
        .catch(err => console.error('Error while stopping connection: ' + err));
      this.hubConnection = null;
    }
  }

  public addChangesListener = (callback: (type: SignalRType) => void) => {
    if(this.hubConnection){
      this.hubConnection.on('sendtouser', (message) => {
        callback(message);
      });
    }
  }

  public addNotificationListener = (callback: () => void) => {
    if(this.hubConnection){
      this.hubConnection.on('receivenotification', () => {
        callback();
      });
    }
  }

  ngOnDestroy(): void {
    this.stopConnection();
  }
}

// private hubConnectionBuilder!: HubConnection;
// this.hubConnectionBuilder = new HubConnectionBuilder().withUrl(environment.baseUrl + '/notifications', { accessTokenFactory: () => this.authService.GetToken()! })
// .withAutomaticReconnect()
// .configureLogging(LogLevel.Information).build();
// this.hubConnectionBuilder.start().then(() => console.log('Connection started.......!')).catch(err => console.log('Error while connect with server'));
// this.hubConnectionBuilder.on('sendtouser', (message) => {
// console.log('Message received: ', message);
// this.testSignalR = message
// });
