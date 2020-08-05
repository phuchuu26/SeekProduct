import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Users } from './store/models/users.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private USERS_URL = "https://5f0d645a11b7f60016056945.mockapi.io/api/users"
  getUserItem() {
    return this.http.get<Array<Users>>(this.USERS_URL);
  }
  deleteUserItem(id: number) {
    return this.http.delete(`${this.USERS_URL}/${id}`);
  }

  addUserItem(UserItem: Users) {
    return this.http.post(this.USERS_URL, UserItem);
  }

  UpdateUserItem(user: Users) {
    console.log(user);
    return this.http.put(`${this.USERS_URL}/${user.id}`,user);
  }
  constructor(
    private http: HttpClient
  ) { }
}
