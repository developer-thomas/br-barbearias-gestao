import { MatSnackBar } from '@angular/material/snack-bar';
export function openSnackBar(snackbar: MatSnackBar, message: string) {
  snackbar.open(
    message, 
    '', 
    {
      duration: 4000
    }
  )
}