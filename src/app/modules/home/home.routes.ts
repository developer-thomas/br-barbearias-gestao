import { Routes } from '@angular/router';
import { HomeComponent } from './home.component';
import { ForgotPasswordComponent } from './pages/forgot-password/forgot-password.component';
import { SigninComponent } from './pages/signin/signin.component';
import { TermsPrivacyComponent } from './pages/terms-privacy/terms-privacy.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    children: [
      { path: '', component: SigninComponent },
      { path: 'forgot-password', component: ForgotPasswordComponent },
    ],
  },
  {
    path: 'terms-privacy/:type',
    component: TermsPrivacyComponent,
  },
];
