import { Locator, Page } from "@playwright/test";
import { ElementUtil } from "../utils/ElementUtils.js";
import {ProductInfo} from "../pages/ProductInfoPage.js"


export class ResultsPage{

private readonly page: Page;
private readonly eleUtil: ElementUtil;
private readonly results: Locator;

    constructor(page: Page){
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.results = page.locator('.product-thumb');
    }

    //3. page actions
    async getSearchResultsCount(): Promise<number>{
        return await this.results.count();
    }

    async selectProduct(productName: string):Promise<ProductInfo>{
        console.log('============poduct name is: ===>>>'+productName);
        //always declare the locator inside the method if its a dynamic locator
        await this.eleUtil.click(this.page.getByRole('link', { name: `${productName}` }));
        return new ProductInfo(this.page);
    }
}