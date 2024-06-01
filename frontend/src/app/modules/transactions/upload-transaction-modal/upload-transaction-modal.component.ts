import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ValidateFilesize } from '../../settings/resources/validators/filesize.validator';
import { Store } from '@ngrx/store';
import { AppState } from '../../../store';
import { uploadTransactions } from '../resources/state/transactions.actions';

@Component({
  selector: 'app-upload-transaction-modal',
  templateUrl: './upload-transaction-modal.component.html',
  styleUrls: ['./upload-transaction-modal.component.scss']
})
export class UploadTransactionModalComponent implements OnInit {

  form = new FormGroup({
    "file": new FormControl<File | null>(null, [Validators.required]),
  });

  constructor(private store: Store<AppState>) { }

  ngOnInit() {
  }

  onSubmit(){
    if (!this.form.valid){
      this.form.markAllAsTouched();
      return;
    }

    const values = this.form.value;
    if (values.file) {
      const file = values.file;
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        const payload = { fileContent: base64String?.toString() ?? '' };
        this.store.dispatch(uploadTransactions({file: payload}));
      }
    }
  }

  onFileChange($event: Event) {
    const input = $event.target as HTMLInputElement;
    const files = input.files;
    if (files && files.length > 0) {
      const file = files[0];
      this.form.patchValue({ file: file });
      this.form.get('file')?.updateValueAndValidity();
    }
  }

  remove() {
    this.form.patchValue({file: null});
  }

}
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
}
