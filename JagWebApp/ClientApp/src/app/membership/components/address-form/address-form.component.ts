import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ERROR_PATTERN_MESSAGE, ERROR_REQUIRED_MESSAGE, SUCCESS_SAVE_DATA_MESSAGE } from 'shared/consts/user-messages.consts';
import { Address } from 'shared/models/address';
import { Customer } from 'shared/models/customer';
import { UserService } from 'shared/services/user.service';
import { notEmptyInput } from 'shared/validators/not-empty-input.validator';

@Component({
  selector: 'app-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.css']
})
export class AddressFormComponent implements OnInit {
  form: FormGroup;
  customer: Customer;

  constructor(
    private userService: UserService,
    private router: Router,
    private toastr: ToastrService,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.initForm();

    this.userService.getSingle()
      .subscribe(customer => {
        this.customer = customer;
        if (this.route.snapshot.routeConfig.path === 'user/data/address/new' && this.customer.address) 
          this.router.navigate(['/user/data']);
         
        this.setFormValues();
      });
  }

  save() {
    if (this.form.invalid)
      return;

    let address: Address = {
      customerName: this.customerName.value,
      street: this.street.value,
      houseNumber: this.houseNumber.value,
      postcode: this.postcode.value,
      city: this.city.value
    };

    let patchUser = [
      { op: 'replace', path: "/phoneNumber", value: this.phone.value },
      { op: 'replace', path: "/address", value: address}
    ];

    this.userService.update(patchUser)
      .subscribe(() => {
        this.router.navigate(['/user/data']);
        this.toastr.success(SUCCESS_SAVE_DATA_MESSAGE);
      });
  }

  getCustomerNameErrorMessage() {
    return this.customerName.hasError('required') || this.customerName.hasError('empty') 
      ? ERROR_REQUIRED_MESSAGE 
      : '';
  }

  getPhoneErrorMessage() {
    return this.phone.hasError('required') 
      ? ERROR_REQUIRED_MESSAGE 
      : this.phone.hasError('pattern') 
        ? ERROR_PATTERN_MESSAGE 
        : '';
  }

  getStreetErrorMessage() {
    return this.street.hasError('required') || this.street.hasError('empty') ? ERROR_REQUIRED_MESSAGE : '';
  }

  getHouseNumberErrorMessage() {
    return this.houseNumber.hasError('required') || this.houseNumber.hasError('empty') 
      ? ERROR_REQUIRED_MESSAGE 
      : '';
  }

  getPostcodeErrorMessage() {
    return this.postcode.hasError('required') 
      ? ERROR_REQUIRED_MESSAGE
      : this.postcode.hasError('pattern') 
        ? ERROR_PATTERN_MESSAGE 
        : '';
  }

  getCityErrorMessage() {
    return this.city.hasError('required') || this.city.hasError('empty') ? ERROR_REQUIRED_MESSAGE : '';
  }

  get customerName() {
    return this.form.get('customerName');
  }

  get phone() {
    return this.form.get('phone');
  }

  get street() {
    return this.form.get('street');
  }

  get houseNumber() {
    return this.form.get('houseNumber');
  }

  get postcode() {
    return this.form.get('postcode');
  }

  get city() {
    return this.form.get('city');
  }

  private initForm() {
    this.form = new FormGroup({
      customerName: new FormControl('', [Validators.required, notEmptyInput()]),
      phone: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{9}')]),
      street: new FormControl('', [Validators.required, notEmptyInput()]),
      houseNumber: new FormControl('', [Validators.required, notEmptyInput()]),
      postcode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{2}-[0-9]{3}')]),
      city: new FormControl('', [Validators.required, notEmptyInput()])
    });
  }

  private setFormValues() {
    if (this.customer.address) {
      this.phone.setValue(this.customer.phoneNumber);
      this.customerName.setValue(this.customer.address.customerName);
      this.street.setValue(this.customer.address.street);
      this.houseNumber.setValue(this.customer.address.houseNumber);
      this.postcode.setValue(this.customer.address.postcode);
      this.city.setValue(this.customer.address.city);
    }
  }
}
