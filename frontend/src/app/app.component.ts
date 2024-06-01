import { Component, OnInit } from '@angular/core';
import { AuthService } from './modules/auth/resources/services/auth.service';
import { SignalRService } from './core/resources/services/signalR.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService, private signalRService: SignalRService) {}

  ngOnInit(): void {
    if (this.authService.IsLogIn()) {
      this.signalRService.startConnection();
    }
  }

  title = 'frontend';
}
