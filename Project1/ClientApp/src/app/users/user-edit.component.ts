import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './User';
import { AsyncValidator } from '@angular/forms';
import { BaseFormComponent } from '../base.form.component';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent extends BaseFormComponent implements OnInit {

  title: string;

  form: FormGroup;

  user: User;

  id?: number;

  constructor(

    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { super();}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      moLastName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      faLastName: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(10), Validators.pattern('^[A-Za-zñÑáéíóúÁÉÍÓÚ ]+$')]),
      address: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(30)] ),
      pnumber: new FormControl('', [Validators.required, Validators.minLength(6), Validators.maxLength(10) ,Validators.pattern(/^[-]?[0-9]+(\.[0-9]{1,4})?$/)
]),
    } , null , this.isDupeUser());

    this.loadData();
  }

  loadData() {
    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    console.log(this.id);

      if (this.id) {
      
      var url = this.baseUrl + "api/Users/" + this.id;
      this.http.get<User>(url).subscribe(result => {
        this.user = result;
        this.title = "Edit - " + this.user.name;


        this.form.patchValue(this.user);
      }, error => console.error(error));
    }
    else {
      this.title = "Create a new User";
    }


  }

    onSubmit() {
      
      var user = (this.id) ? this.user : <User>{};
     
      //console.log("Testing " + user.name);

      user.name = this.form.get("name").value;
      user.molastname = this.form.get("moLastName").value;
      user.falastname = this.form.get("faLastName").value;
      user.address = this.form.get("address").value;
      user.pnumber = this.form.get("pnumber").value;

      if (this.id) {
          console.log("EDit Mode " + this.id);
          console.log("EDit Mode  " + this.user.id);
        var url = this.baseUrl + "api/Users/" + this.id;
        console.log("Edit User  " + user);
        this.http
          .put<User>(url, user)
          .subscribe(result => {

                  console.log("User " + user.id + " has been updated");

                  this.router.navigate(['/users']);
              }, error => console.error(error));
      }
      else {
          
          var url = this.baseUrl + "api/Users";
          this.http
              .post<User>(url, user)
              .subscribe(result => {

                  console.log("User " + result.id + " Has been created.");

                  this.router.navigate(['/users']);
              }, error => console.error(error));

      }
      
  }


  onDeletee() {

    this.id = +this.activatedRoute.snapshot.paramMap.get('id');
    var url = this.baseUrl + 'api/Users/' + this.id;
    console.log(url);
    this.http
      .delete<User>(url)
      .subscribe(result => {

        console.log("User " + this.id + " has been Delete");

        this.router.navigate(['/users']);
      }, error => console.error(error));
  }






  isDupeUser(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<{ [key: string]: any } | null> =>
      {
      var user = <User>{};
      user.id = (this.id) ? this.id : 0;
      user.name = this.form.get("name").value;
      user.molastname = this.form.get("moLastName").value;
      user.falastname = this.form.get("faLastName").value;
      user.address = this.form.get("address").value;
      user.pnumber = this.form.get("pnumber").value;

      var url = this.baseUrl + "api/Users/IsDupeUser";
      return this.http.post<boolean>(url, user).pipe(map(result => {
        return (result ? { isDupeUser: true } : null);
      }));
    }
  }
}
