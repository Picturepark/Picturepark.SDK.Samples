import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ProxyAuthService } from '../../services/proxy-auth.service';

@Component({
  selector: 'app-auth-callback',
  template: ''
})
export class AuthCallbackComponent implements OnInit {
  constructor(private authService: ProxyAuthService, private router: Router) { }

  ngOnInit() {
    this.authService.completeAuthentication();
  }
}
