import { test, expect } from "../fixtures/baseFixture.js";
import { ResultsPage } from "../pages/ResultPage.js";
import { ProductInfo } from "../pages/ProductInfoPage.js";
//the same dataprovider can be used for 2 test diff cases
const search = [
  { searchKey: "macbook", productName: "MacBook Pro", imagecount: 4 },
  { searchKey: "macbook", productName: "MacBook Air", imagecount: 4 },
  {
    searchKey: "samsung",
    productName: "Samsung Galaxy Tab 10.1",
    imagecount: 7,
  },
];
for (const product of search) {
  test(
    `verify product header for product: ${product.productName}`,
    {
      tag: ["@product", "@sanity", "@regression"],
      annotation: [
        // add additional info to your test good practice, it will be easier for everyone in the team
        {
          type: "epic",
          description: "Epic 100- design product page for open cart app",
        },
        { type: "feature", description: "Product page feature" },
        { type: "stry", description: "US 50- user can login to product page" },
      ],
    },
    async ({ homePage }) => {
      const resultsPage: ResultsPage = await homePage.doSearch(
        product.searchKey,
      );
      const productInfo: ProductInfo = await resultsPage.selectProduct(
        product.productName,
      );
      expect(await productInfo.productHeader()).toBe(product.productName);
    },
  );
}

for (const product of search) {
  test(
    `verify product images for product ${product.productName}: ${product.imagecount}`,
    { tag: ["@product", "@sanity"] },
    async ({ homePage }) => {
      const resultsPage: ResultsPage = await homePage.doSearch(
        product.searchKey,
      );
      const productInfo: ProductInfo = await resultsPage.selectProduct(
        product.productName,
      );
      expect(await productInfo.getProductImagesCount()).toBe(
        product.imagecount,
      );
    },
  );
}

test("verify product metadata", async ({ homePage }) => {
  const resultsPage: ResultsPage = await homePage.doSearch("macbook");
  const productInfo: ProductInfo =
    await resultsPage.selectProduct("MacBook Pro");
  const actualProductDetails = await productInfo.getProductDetails();
  //using soft assertion so that of the 1st validation fails it will still continue with next expect statement
  expect.soft(actualProductDetails.get("Header")).toBe("MacBook Pro");
  expect.soft(actualProductDetails.get("Brand")).toBe("Apple");
  expect.soft(actualProductDetails.get("Product Code")).toBe("Product 18");
  expect.soft(actualProductDetails.get("Reward Points")).toBe("800");
  expect.soft(actualProductDetails.get("Availability")).toBe("Out Of Stock");
});

test("verify product pricing", async ({ homePage }) => {
  const resultsPage: ResultsPage = await homePage.doSearch("macbook");
  const productInfo: ProductInfo =
    await resultsPage.selectProduct("MacBook Pro");
  const actualProductDetails = await productInfo.getProductDetails();
  //using soft assertion so that of the 1st validation fails it will still continue with next expect statement
  expect.soft(actualProductDetails.get("Header")).toBe("MacBook Pro");
  expect.soft(actualProductDetails.get("price")).toBe("$2,000.00");
  expect.soft(actualProductDetails.get("extraprice")).toBe("$2,000.00");
});
