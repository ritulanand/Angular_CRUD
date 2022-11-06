import { Component, OnInit } from '@angular/core';
import { FormGroup ,FormBuilder, Validators, FormControl} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import Swal from 'sweetalert2';
import { DBOperation } from './_helpers/db-operation';
import { MustMatch } from './_helpers/must-match.Validators';
import { User } from './_helpers/user.interface';
import { UserService } from './_helpers/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'registrationapp';
  // registerForm : FormGroup = new FormGroup({})
  registerForm : FormGroup;
  submitted: boolean = false;
  users:User[] = [];
  buttonText :string = "Submit";
  dbops: DBOperation;
  constructor(private _toaster:ToastrService, private _fb: FormBuilder, private _userService:UserService){
    
  }
  ngOnInit(){
   this.setFormState();
   this.getAllUsers();
  }

  setFormState(){
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;

    // this.registerForm = this._fb.group({
    //   id: [0],
    //   title: ['', Validators.required],
    //   firstName: ['', Validators.compose([Validators.required, Validators.minLength(3),Validators.maxLength(10)])],
    //   lastName: ['', Validators.compose([Validators.required, Validators.minLength(3),Validators.maxLength(10)])],
    //   email : ['', Validators.compose([Validators.required, Validators.email])],
    //   dob : ['', Validators.compose([Validators.required,Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)])],
    //   password: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
    //   confirmPassword: ['', Validators.required],
    //   acceptTerms: [false, Validators.requiredTrue]
    // }, {
    //   validators : MustMatch('password', 'confirmPassword')
    // })

    this.registerForm = new FormGroup({
      id: new FormControl(0),
      title: new FormControl('', Validators.required),
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3),Validators.maxLength(10)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3),Validators.maxLength(10)])),
      email : new FormControl('', Validators.compose([Validators.required, Validators.email])),
      dob : new FormControl('', Validators.compose([Validators.required,Validators.pattern(/^\d{4}\-(0[1-9]|1[012])\-(0[1-9]|[12][0-9]|3[01])$/)])),
      password: new FormControl('', Validators.compose([Validators.required, Validators.minLength(6)])),
      confirmPassword: new FormControl('', Validators.required),
      acceptTerms: new FormControl(false, Validators.requiredTrue)
    }, 
      MustMatch('password', 'confirmPassword')
    );

    


  }
  

  get f(){
    return this.registerForm.controls;
  }
  onSubmit(){
    this.submitted = true;
    console.log(this.registerForm.value);
    if(this.registerForm.invalid){
      return;
    }
    switch(this.dbops){
      case DBOperation.create:
      this._userService.addUser(this.registerForm.value).subscribe(res => {
        this._toaster.success('user added' ,'user registration');
        this.getAllUsers();
        this.onCancel();
      })
      break;
      case DBOperation.update:
        this._userService.updateUser(this.registerForm.value).subscribe(res => {
          this._toaster.success('user updated' ,'user registration');
          this.getAllUsers();
          this.onCancel();
        })
      break;

    }

  }
  onCancel(){
    this.registerForm.reset();
    this.buttonText = "Submit";
    this.dbops = DBOperation.create;
    this.submitted = false;
  }

  getAllUsers(){
    this._userService.getUsers().subscribe((res : User[]) => {
      this.users = res;
      // debugger;
      console.log(res);
    })
  }

  Edit(userId: number){
    this.buttonText = "Update";
    this.dbops = DBOperation.update;

    let user = this.users.find((u :User) =>  u.id === userId);
    this.registerForm.patchValue(user);
    this.registerForm.get('password').setValue('');
    this.registerForm.get('confirmPassword').setValue('');
    this.registerForm.get('acceptTerms').setValue(false);
  }
  Delete(userId: number){
    Swal.fire({
      title: 'Are you sure?',
      text: 'you will not be able to recover deleted record',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'yes delete it',
      cancelButtonText: 'No keep it '
    }).then((result) => {
      if(result.value){
        this._userService.deleteUser(userId).subscribe( res=> {
          this.getAllUsers();
          this._toaster.success('Deleted success', 'User registration')
        })
        
      }else if(result.dismiss === Swal.DismissReason.cancel){
        Swal.fire(
          'cancelled',
          'your record is safe',
          'error'
        )
      }
    })
  }
}
