import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);
  
  // Add headers if needed
  const modifiedReq = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  });

  return next(modifiedReq).pipe(
    catchError(error => {
      let errorMessage = 'An error occurred';
      
      if (error.error?.error) {
        errorMessage = error.error.error;
      } else if (error.status === 0) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else if (error.status === 404) {
        errorMessage = 'Resource not found';
      } else if (error.status === 400) {
        errorMessage = 'Bad request. Please check your input.';
      } else if (error.status === 500) {
        errorMessage = 'Server error. Please try again later.';
      }
      
      // Show snackbar notification
      snackBar.open(errorMessage, 'Close', {
        duration: 5000,
        horizontalPosition: 'right',
        verticalPosition: 'top',
        panelClass: ['error-snackbar']
      });
      
      return throwError(() => error);
    })
  );
};