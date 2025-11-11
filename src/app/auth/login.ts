import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup, FormControl } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent {
  form!: FormGroup;
  loading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router) {
    // Inicializamos el form *después* de que fb esté disponible
    this.form = this.fb.group({
      username: this.fb.nonNullable.control('', [Validators.required]),
      password: this.fb.nonNullable.control('', [Validators.required])
    });
  }

  // getters tipados para plantilla
  get username(): FormControl<string> | null {
    return this.form.get('username') as FormControl<string> | null;
  }
  get password(): FormControl<string> | null {
    return this.form.get('password') as FormControl<string> | null;
  }

  submit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.error = null;

    // gracias a nonNullable, tenemos seguridad de no-null aquí
    const username = this.username?.value ?? '';
    const password = this.password?.value ?? '';

    // Guardar credenciales (sessionStorage si persist=true)
    this.auth.setCredentials(username, password, true);

    // Navegar a la lista principal
    this.loading = false;
    this.router.navigate(['/']);
  }
}
