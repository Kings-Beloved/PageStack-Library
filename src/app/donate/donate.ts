import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Footer } from "../footer/footer";
import { Header } from "../header/header";

declare const PaystackPop: any;

@Component({
  imports: [ReactiveFormsModule, Footer, Header],
  selector: 'app-donate',
  styleUrl: './donate.css',
  templateUrl: './donate.html',
})
export class Donate {
  // Replace with your active Paystack Public Key
  private readonly paystackPublicKey = 'pk_test_a1ef78b53b31f346ad562d8cf4a9244cd4e1d3e';

  donateForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    amount: new FormControl(0, [Validators.required, Validators.min(100)]),
  });

  donate() {
    if (this.donateForm.invalid) {
      this.donateForm.markAllAsTouched();
      return;
    }

    const { firstName, lastName, email, amount } = this.donateForm.value;

    const handler = PaystackPop.setup({
      key: this.paystackPublicKey,
      email: email,
      amount: Number(amount) * 100, // Converts Naira to Kobo
      currency: 'NGN',
      ref: 'PS_' + Math.floor(Math.random() * 1000000000 + 1),
      metadata: {
        custom_fields: [
          {
            display_name: 'Donor Name',
            variable_name: 'donor_name',
            value: `${firstName} ${lastName}`
          }
        ]
      },
      callback: (response: any) => {
        console.log('Payment successful. Ref:', response.reference);
        this.donateForm.reset();
      },
      onClose: () => {
        console.log('Payment window closed');
      }
    });

    handler.openIframe();
  }
}