import {test as base, expect} from '@playwright/test';
import {HomePage} from '../pages/HomePage.js';
import { LoginPage } from '../pages/loginPage.js';

type MyFixtures = {
    homePage: HomePage;
};
//we have defined our own test by using the existing playwright test
export const test = base.extend<MyFixtures>({
    homePage: async({page, baseURL}, use, testInfo)=>{
        const loginPage  = new LoginPage(page);
        await loginPage.gotoLoginPage(baseURL);
        //add below commented lines for github actions with chrome
        // await page.goto(baseURL + '?route=account/login', {
        //         waitUntil: 'domcontentloaded',
        //         timeout: 120000  // 120 seconds
        //     });
            
        //     // Wait for page to be ready before logging in
        // await page.waitForLoadState('networkidle').catch(() => {});
        //coming from metadata in config.ts file
        const username = testInfo.project.metadata.appUsername;
        const password = testInfo.project.metadata.appPassword;
        const homePage = await loginPage.doLogin(username, password);
        await expect(homePage.isUserLoggedIn()).toBeTruthy();
        await use(homePage);
    }

});

export {expect};