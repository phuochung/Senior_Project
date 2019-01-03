import { HomePage } from './../home/home';
import { AuthService } from './../../services/auth.service';
import { Component } from '@angular/core';
import { LoadingController, NavController } from 'ionic-angular';
import { Provider } from '../../models/provider.model';
import { UIHelper } from '../../helpers/ui-helper';
import { Language } from '../../app/constants';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidatorHelper } from '../../helpers/validator-helper';
import { LoginPage } from '../login/login';

@Component({
  templateUrl: 'register.html'
})
export class RegisterPage {
  provider: Provider = new Provider();
  isLoading: boolean = false;
  file: File = null;

  validatorHelper = ValidatorHelper;

  registerForm: FormGroup;
  submitAttempt: boolean = false;

  constructor(
    public loadingCtrl: LoadingController,
    public navCtrl: NavController,
    private authService: AuthService,
    private uiHelper: UIHelper,
    public formBuilder: FormBuilder
  ) {
    this.registerForm = formBuilder.group({
      username: [
        '',
        Validators.compose([Validators.minLength(6), Validators.maxLength(100), Validators.required]),
        this.validatorHelper.checkExistingUsername(this.authService)
      ],
      password: ['', Validators.compose([Validators.minLength(6), Validators.required])],
      confirmPassword: ['', Validators.compose([Validators.required])],
      name: ['', Validators.compose([Validators.required])],
      email: [
        '',
        Validators.compose([Validators.required, this.validatorHelper.hasValidEmailPattern]),
      ],
      tel: ['', Validators.compose([Validators.required, this.validatorHelper.hasValidPhoneNumberPattern])],
      address: ['', Validators.compose([Validators.required])]
    }, {
        validator: this.validatorHelper.MatchPassword
      });
  }

  register(): void {
    this.isLoading = true;
    let loading = this.uiHelper.showLoading();
    this.submitAttempt = true;
    this.provider.lang = Language.VI;
    this.authService.register(this.provider)
      .then((res) => {
        this.isLoading = false;
        this.submitAttempt = false;
        this.uiHelper.hideLoading(loading);
        if (res['success']) {
          this.uiHelper.alert('Đăng ký thành công! Vui lòng đợi xác nhận từ trong vòng 24h...');
          this.navCtrl.setRoot(LoginPage);
        } else {
          this.uiHelper.alert('Lỗi gì đó đã xảy ra thật bất ngờ, vui lòng thử lại sau.');
        }

      });
  }
}
