import { Injectable } from '@angular/core';
import {InMemoryDbService} from 'angular-in-memory-web-api'
import { User } from './user.interface';

@Injectable({
  providedIn: 'root'
})
export class DataService implements InMemoryDbService {

  constructor() { }
  createDb(){
    let users: User[] = [
      {id: 1, title: 'Mr', firstName: 'Ritul', lastName: 'Anand', dob: '1997-01-10', email: 'ritul.test@gmai.com', password: '12345', acceptTerms: true},
      {id: 2, title: 'Mr', firstName: 'Tuk', lastName: 'Tuk', dob: '1999-01-10', email: 'tuk.test@gmai.com', password: '1235', acceptTerms: false}
    ]
    return {users};
  }
}
