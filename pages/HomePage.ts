import { Locator, Page } from "@playwright/test";
import { ElementUtil } from "../utils/ElementUtils.js";
import {LoginPage} from "../pages/loginPage.js";
import {ResultsPage} from "../pages/ResultPage.js";


export class HomePage{


   readonly page: Page;
   private readonly eleUtil;
   private readonly logOutLink: Locator;
   private readonly search: Locator;
   private readonly searchIcon: Locator;
   private readonly loginLink: Locator;

   constructor(page: Page){
    this.page = page;
    this.eleUtil = new ElementUtil(page);
    this.logOutLink = page.getByRole('link', { name: 'Logout' });
    this.search = page.getByRole('textbox', { name: 'Search' });
    this.searchIcon = page.locator('.btn.btn-default.btn-lg');
    this.loginLink = page.getByRole('link', { name: 'Login' });

   }
 

   //page actions
   async isUserLoggedIn(): Promise<boolean>{
     return await this.eleUtil.isEleVisible(this.logOutLink,1);
   }

   async userLogout(): Promise<LoginPage>{
       await this.eleUtil.click(this.logOutLink,{timeout: 5000},1);
       await this.eleUtil.click(this.loginLink, {timeout: 5000}, 1);
       return new LoginPage(this.page);
   }

   async doSearch(searchKey: string):Promise<ResultsPage>{
    console.log(`search key is: ${searchKey}`);
    await this.eleUtil.fill(this.search,searchKey);
    await this.eleUtil.click(this.searchIcon);
    return new ResultsPage(this.page);
   }



}