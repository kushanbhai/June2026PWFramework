import { Locator, Page } from "@playwright/test";
import { ElementUtil } from "../utils/ElementUtils.js";


export class ProductInfo{
    private readonly page: Page;
    private readonly eleUtil: ElementUtil;
    private readonly header: Locator;
    private readonly imageCount: Locator;
    private readonly productMetaData: Locator;
    private readonly productPriceData: Locator;
    private readonly productMap = new Map<string, string | number |null>();

    constructor(page: Page){
        this.page = page;
        this.eleUtil = new ElementUtil(page);
        this.header = page.locator('h1');
        this.imageCount = page.locator(`div#content img`);
        this.productMetaData = page.locator(` (//div[@id='content']//ul[@class='list-unstyled'])[1]/li`);
        this.productPriceData = page.locator(`(//div[@id='content']//ul[@class='list-unstyled'])[2]/li`)
    }

    async productHeader(): Promise<string>{
        const header = await this.eleUtil.getInnerText(this.header);
        console.log('the header is :'+header);
        return header.trim();
    }

    async getProductImagesCount(): Promise<number>{
       await this.eleUtil.isVisible(this.imageCount); 
       const imageCnt =  await this.imageCount.count();
       console.log(`the total no of images for ${this.productHeader()} is ==>> ${imageCnt}`);
       return imageCnt;
    }
    /**
     * 
     * @returns this methode is returning complete product information: header, images, metadata, priceing
     */
    async getProductDetails(): Promise<Map<string,string|number|null>>{
        this.productMap.set('Header',await this.productHeader());
        this.productMap.set('ImageCount', await this.getProductImagesCount());
        await this.getProductMetaData();
        await this.getProductProductPriceData();

        console.log(`Full product details for product : ${this.productHeader()}`);
        this.printProductDetails();
        return this.productMap;
    }

    private async printProductDetails(){
        for (const [key, value] of this.productMap){
            console.log(key, value);
        }
    }
// Brand: Apple
// Product Code: Product 17
// Reward Points: 700
// Availability: Out Of Stock
    private async getProductMetaData(){
       let productMetaData =  await this.productMetaData.allInnerTexts();
       for (let meta of productMetaData){
           let metaData: string[] = meta.split(':');
           let metaKey = metaData[0].trim();
           let metaValue = metaData[1].trim();
           this.productMap.set(metaKey, metaValue);

       }
    }
//     $1,202.00
// Ex Tax: $1,000.00
    private async getProductProductPriceData(){
       let productPriceData: string[] =  await this.productPriceData.allInnerTexts();
       let productPrice = productPriceData[0].trim();
       let productExTax = productPriceData[1].split(':')[1].trim();

       this.productMap.set('price',productPrice);
       this.productMap.set('extraprice', productExTax);
       
    }


}