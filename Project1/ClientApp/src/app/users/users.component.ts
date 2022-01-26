import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './user'

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})

export class UsersComponent implements OnInit {
  public displayedColumns: string[] = ['usersId', 'name', 'moLastName', 'faLastName', 'address','pnumber'];
  public users: User[]

  constructor(
    private http: HttpClient,
    @Inject('BASE_URL') private baseUrl: string) { }

  ngOnInit() {
    this.http.get<User[]>(this.baseUrl + 'api/Users')
      .subscribe(result => {
        this.users = result;
      }, error => console.error(error));
  }
}
