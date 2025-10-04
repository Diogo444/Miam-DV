import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../../services/api/api.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { FormsModule } from '@angular/forms';
import { LocalstorageService } from '../../../../services/localstorage/localstorage.service';

@Component({
  selector: 'app-password',
  imports: [FormsModule],
  templateUrl: './password.component.html',
  styleUrl: './password.component.scss',
})
export class PasswordComponent implements OnInit {
  username: string = '';
  password: string = '';

  constructor(
    private api: ApiService,
    private router: Router,
    private auth: AuthService,
    private localStorage: LocalstorageService
  ) {}
  ngOnInit(): void {
    this.auth.getUsername().subscribe((username) => {
      this.username = username;
    });
  }

  onSubmit(): void {
    const token = this.localStorage.getItem('token');
    if (token) {
      this.api.change_password(this.password, token).subscribe(
        (response) => {
          this.localStorage.setItem('token', response.token);
          this.router.navigate([this.router.url]);
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      console.error('Aucun token trouvé');
    }
  }
}
