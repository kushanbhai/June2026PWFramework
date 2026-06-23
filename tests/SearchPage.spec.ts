import { test, expect } from "../fixtures/baseFixture.js";
import { ResultsPage } from "../pages/ResultPage.js";

//data provider for prod search key and results count
const searchData = [
  { searchKey: "macbook", resultsCount: 3 },
  { searchKey: "samsung", resultsCount: 2 },
  { searchKey: "imac", resultsCount: 1 },
  { searchKey: "canon", resultsCount: 1 },
  { searchKey: "Dummy", resultsCount: 0 },
];

for (const product of searchData) {
  test(` @search verify product search ${product.searchKey}`, async ({
    homePage,
  }) => {
    const resultsPage: ResultsPage = await homePage.doSearch(product.searchKey);
    expect(await resultsPage.getSearchResultsCount()).toBe(
      product.resultsCount,
    );
  });
}
