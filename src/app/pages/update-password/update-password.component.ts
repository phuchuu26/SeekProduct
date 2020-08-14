import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-update-password',
  templateUrl: './update-password.component.html',
  styleUrls: ['./update-password.component.css']
})
export class UpdatePasswordComponent implements OnInit {
  public updatePasswordForm: FormGroup;

  constructor(
    private forms: FormBuilder,

  ) { }

  ngOnInit(): void {
    this.updatePasswordForm = this.forms.group({


    });
  }


  public save(){

  }
}
