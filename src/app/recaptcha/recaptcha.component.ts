

import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserForm } from '../interface/UserForm';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';
import { SiteVerifyRequest } from '../interface/SiteVerifyReq';
import { CaptchaService } from '../services/captcha.service';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIcon } from '@angular/material/icon';


declare global {
  interface Window {
    onloadCallback: () => void;
    grecaptcha:any
  }
}


const SCRIPT_ID = 'recaptcha';
const CALLBACK_NAME='onloadCallback';

let components = [
  ReactiveFormsModule, 
  MatButtonModule, 
  MatCardModule, 
  MatFormFieldModule, 
  MatInputModule,
  MatToolbarModule,
  MatIcon
]


@Component({
  selector: 'app-recaptcha',
  imports: [...components],
  templateUrl: './recaptcha.component.html',
  styleUrl: './recaptcha.component.scss'
})
export class RecaptchaComponent implements OnInit {

  formReCaptcha: FormGroup<UserForm> = new FormGroup<UserForm>(
    {
      dni: new FormControl('', [Validators.minLength(7), Validators.maxLength(10), Validators.required])
    });

    formTurnstile: FormGroup<UserForm> = new FormGroup<UserForm>(
      {
        dni: new FormControl('', [Validators.minLength(7), Validators.maxLength(10), Validators.required])
      });


    urlHome: string;

    validCaptcha: boolean = false;

  constructor(@Inject(DOCUMENT) private document: Document,
  private snackBar: MatSnackBar,
  private captchaService: CaptchaService,
){
    this.urlHome = environment.urlHome;
    this.loadRecaptchaScript();
    
  }

  ngOnInit(): void {
      
  }

  loadRecaptchaScript(){

    window[CALLBACK_NAME]=() => {

        window.grecaptcha.ready(() => {
          window.grecaptcha
            .execute(`${environment.recaptcha.siteKey}`, { action: 'submit' })
            .then((token: string) => {
    
              if (token){
    
                let req: SiteVerifyRequest = {} as SiteVerifyRequest;
                req.secret = environment.recaptcha.siteKey;
                req.response = token;
    
                this.captchaService.validateReCaptcha(req)
                .subscribe(
                  {
                    next:(val)=>{
    
                        if (val.success){
    
                          this.validCaptcha = true;
                          
                          this.snackBar.open('Se valido captcha.','Info')
                        }
                        else {
                          this.snackBar.open('Error de captcha.','Error')
                        }
                    },
                    error:(error)=>{
                      this.snackBar.open('Error desconocido de captcha.','Error')
                    }
                  })
                
              }
              
            })
        });
   

    }

    
    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${environment.recaptcha.siteKey}&onload=onloadCallback`;
    script.id = SCRIPT_ID;
    script.async = true;
    script.defer = true;
    document.head.appendChild(script);

  }

  //Get el control DNI del form
  get dni(){
    return this.formReCaptcha.get('dni')
  }


    submit(){



      if (this.validCaptcha){

        this.snackBar.open('Se enviara datos a backed .... por implementar .','Info')
      }
  
      else {
  
        this.snackBar.open('No es un acceso valido.','Alert')
  
      }
  
  
      
    }
  

  openLink(){
    this.document.location.href = this.urlHome;
  }

  get checkForm(){
    return this.validCaptcha && this.formReCaptcha.valid
  }


}
