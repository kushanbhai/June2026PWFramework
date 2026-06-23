import { Locator, Page } from "@playwright/test";
import { ElementUtil } from "../utils/ElementUtils.js";
import { HomePage } from "../pages/HomePage.js";
import { RegisterPage } from "../pages/RegistrationPage.js";

export class LoginPage {
  //1. //page objects/locators
  private readonly page: Page;
  private readonly eleUtil;
  private readonly emailId: Locator;
  private readonly password: Locator;
  private readonly loginBtn: Locator;
  private readonly warniningMsg: Locator;
  private readonly registerLink: Locator;
  //2.initializing the values using constructor
  constructor(page: Page) {
    this.page = page;
    this.eleUtil = new ElementUtil(page);
    this.emailId = page.getByLabel("E-Mail Address");
    this.password = page.getByRole("textbox", { name: "Password" });
    this.loginBtn = page.locator(`input[type="submit"][value="Login"]`);
    this.warniningMsg = page.locator(".alert.alert-danger.alert-dismissible");
    this.registerLink = page.getByRole("link", { name: "Register" });
  }

  //3. Page actions
  async gotoLoginPage(baseUrl: string | undefined) {
    await this.page.goto(baseUrl + "?route=account/login", {
      waitUntil: "domcontentloaded",
    });
  }
  /**
   * login to app using username and password
   * @param email
   * @param passowrd
   * @returns
   */
  async doLogin(email: string, passowrd: string): Promise<HomePage> {
    await this.eleUtil.fill(this.emailId, email);
    await this.eleUtil.fill(this.password, passowrd);
    await this.eleUtil.click(this.loginBtn, { force: true, timeout: 5000 });
    return new HomePage(this.page);
  }
  /**
   *
   * @returns error message for incorrect login
   */
  async getInvalidLoginMessage(): Promise<string | null> {
    const errMsg = this.eleUtil.getText(this.warniningMsg);
    console.log("invalid login warning message: " + errMsg);
    return errMsg;
  }

  async navigateRegisterPage(): Promise<RegisterPage> {
    await this.eleUtil.click(this.registerLink, { force: true }, 0);
    return new RegisterPage(this.page);
  }
}
