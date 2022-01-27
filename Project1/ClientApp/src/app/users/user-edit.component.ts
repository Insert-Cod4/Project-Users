import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, AbstractControl, AsyncValidatorFn } from '@angular/forms';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { User } from './User';
import { AsyncValidator } from '@angular/forms';
//import { Console } from 'console';
//import { Console } from 'console';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})

export class UserEditComponent implements OnInit {

  title: string;

  form: FormGroup;

  user: User;

  id?: number;

  constructor(

    private activatedRoute: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl('', Validators.required),
      moLastName: new FormControl('', Validators.required),
      faLastName: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      pnumber: new FormControl('', Validators.required)
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

      /*console.log(user.name);
      console.log(user.molastname);
      console.log(user.falastname);
      console.log(user.address);
      console.log(user.number);*/

      if (this.id) {
          console.log("EDit Mode " + this.id);
          console.log("EDit Mode  " + this.user.id);
          var url = this.baseUrl + "api/Users/" + this.id;
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
