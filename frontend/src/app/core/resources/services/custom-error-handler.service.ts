import { ErrorHandler, Injectable, NgZone } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class CustomErrorHandler implements ErrorHandler {

  constructor(private snackbar: MatSnackBar, private zone: NgZone) { }

  handleError(error: any) {
    let message = 'Error was detected! We are already working on it!';
    if(error?.status === 403) {
      message = "Oops.. It looks like you don't have needed rights, contact your administrator";
    }
    this.zone.run(() => {
      this.snackbar.open(
        message,
        'Close',
        {
          duration: 5000
        }
      );
    })
    console.warn(`Caught by Error Handler: `, error);
  }
}
