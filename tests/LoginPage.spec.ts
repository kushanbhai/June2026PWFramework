import { test, expect } from "../fixtures/baseFixture.js";
import { LoginPage } from "../pages/loginPage.js";

test("verify valid login @login @sanity", async ({ homePage }) => {
  await homePage.page.waitForLoadState("domcontentloaded");
  await expect(homePage.page).toHaveTitle("My Account");
});

//here we are using in built fixture, we dont need custom fixture
test.skip("verify invalid login", async ({ page, baseURL }) => {
  const loginPage = new LoginPage(page);
  await loginPage.gotoLoginPage(baseURL);
  await loginPage.doLogin("111kushanc@abc.com", "111airteli@123");
  const errMsg = await loginPage.getInvalidLoginMessage();
  expect(errMsg).toContain(
    "Warning: No match for E-Mail Address and/or Password",
  );
});
