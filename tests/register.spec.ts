import { LoginPage } from '../pages/loginPage.js';
import { RegisterPage } from '../pages/RegistrationPage.js';
import { expect, test } from '@playwright/test';
import fs from 'fs';
import {parse} from 'csv-parse/sync';

type RegData = {
    firstName: string,
    lastName: string,
    telephone: string,
    password: string,
    subscribeNewsletter: string
}

let fileContent = fs.readFileSync('./data/register.csv', 'utf-8');
let registrationData:RegData[] = parse(fileContent, {
    columns: true,
    skip_empty_lines: true
});
for(let user of registrationData){
test(`verify user is able to register ${user.firstName} @register`,async({page, baseURL})=>{
    let loginPage = new LoginPage(page);
    await loginPage.gotoLoginPage(baseURL);
    let registerPage: RegisterPage  = await loginPage.navigateRegisterPage();
    const isUserRegistered = await registerPage.registerUser(user.firstName, user.lastName,getRandomEmail(),user.telephone,user.password,user.subscribeNewsletter);
    await expect (isUserRegistered).toBeTruthy();
   
    
})
}

function getRandomEmail(): string{
   let randomValue = Math.random().toString(36).substring(2,9);
   return `auto_${randomValue}@nal.com`
}