import { EventEmitter, Inject, Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { MenuItem } from 'shared/models/menu-item';


@Injectable({
  providedIn: 'root'
})
export class SignalRService {
  private hubConnection: signalR.HubConnection;
  onUpdatedItemReceived = new EventEmitter();
  onDeletedItemReceived = new EventEmitter();

  constructor(@Inject('BASE_URL') private baseUrl: string) { }

  startConnection = () => {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.baseUrl + 'menuItemHub')
      .build();

    this.hubConnection
      .start()
      .then(() => {})
      .catch(() => setTimeout(this.startConnection, 5000));
  }

  addTransferUpdatedItemListener = () => {
    this.hubConnection.on('transferUpdatedItem', (data: MenuItem[]) => {
      this.onUpdatedItemReceived.emit(data);
    });
  }

  addTransferDeletedItemListener = () => {
    this.hubConnection.on('transferDeletedItem', (data: MenuItem) => {
      this.onDeletedItemReceived.emit(data);
    });
  }

  isConnected = () => { this.hubConnection && this.hubConnection.state === 'Connected' }
}
