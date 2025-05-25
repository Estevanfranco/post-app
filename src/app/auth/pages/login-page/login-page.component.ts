import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.css'
})
export class LoginPageComponent {
  authService = inject(AuthService);
  router = inject(Router);
  fb = inject(FormBuilder);
  hasError = signal(false);
  type = 'password';
  icon = 'bi bi-eye-slash';


  ngOnInit() {
    const rememberedEmail = localStorage.getItem('rememberedEmail');
    if (rememberedEmail) {
      this.loginForm.patchValue({
        email: rememberedEmail,
        rememberMe: true,
      })
    }
  }
  showPassword(type: string) {
    if (type === 'password') {
      this.type = 'text';
      this.icon = 'bi bi-eye';
    } else {
      this.type = 'password';
      this.icon = 'bi bi-eye-slash';
    }
  }
  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  onSubmit() {
    if (this.loginForm.invalid) {
      this.hasError.set(true);
      setTimeout(() => {
        this.hasError.set(false);
      }, 2000);
      return
    }
    const { email = '', password = '', rememberMe } = this.loginForm.value;
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email!);
    } else {
      localStorage.removeItem('rememberedEmail');
    }

    this.authService.login(email!, password!).subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Login Correcto!",
          text: `Bienvenido: ${this.authService.user().first_name} ${this.authService.user().last_name}`,
          showConfirmButton: false,
          timer: 1500
        });
        this.router.navigateByUrl('/dashboard');
        return;
      }
      this.hasError.set(true); {
        setTimeout(() => {
          this.hasError.set(false);
        }, 2000);
        return;
      }
    }
    )
  }
}
