import { Page, Locator } from "@playwright/test";

type flexibleLocator = string | Locator;
//writing a function which supports both xpath and css
export class ElementUtil {
  private page: Page;
  private defaulttimeout: number = 30000;
  constructor(page: Page, timeout: number = 30000) {
    this.page = page;
    this.defaulttimeout = timeout;
  }

  /**
   * @param index handle duplicate elements in the page
   * @param locator this method is to convert strin(xpath, css) to a locator else it will return semantic based locators
   * @returns
   */
  private getLocator(locator: flexibleLocator, index?: number) {
    if (typeof locator === "string") {
      if (index) {
        return this.page.locator(locator).nth(index);
      } else {
        return this.page.locator(locator).first();
      }
    } else {
      if (index) {
        return locator.nth(index);
      } else {
        return locator.first();
      }
    }
  }
  /**
   * clicks on the element
   * @param locator
   * @param options
   * @param index for handling duplicate elements in the page
   */
  async click(
    locator: flexibleLocator,
    options?: { force?: boolean; timeout?: number },
    index?: number,
  ): Promise<void> {
    await this.getLocator(locator, index).click({
      force: options?.force,
      timeout: options?.timeout || this.defaulttimeout,
    });
    console.log(`clicked on element: ${locator}`);
  }
  /**
   * fill text into field
   * @param locator
   * @param text
   */
  async fill(locator: flexibleLocator, text: string): Promise<void> {
    await this.getLocator(locator).fill(text, { timeout: this.defaulttimeout });
    console.log(`filled the text into the element: ${locator}`);
  }

  /**
   * double click on an element
   * @param locator
   */
  async doubleClick(locator: flexibleLocator): Promise<void> {
    await this.getLocator(locator).dblclick({ timeout: this.defaulttimeout });
    console.log(`double clicked on the element: ${locator}`);
  }
  /**
   * right click on the element
   * @param locator r
   */
  async rightClick(locator: flexibleLocator): Promise<void> {
    await this.getLocator(locator).click({
      button: "right",
      timeout: this.defaulttimeout,
    });
    console.log(`right clicked on the element: ${locator}`);
  }

  /**
   * type text sequentially with delay
   * @param locator
   * @param text
   * @param delay
   */
  async type(
    locator: flexibleLocator,
    text: string,
    delay: number = 500,
  ): Promise<void> {
    await this.getLocator(locator).pressSequentially(text, {
      delay,
      timeout: this.defaulttimeout,
    });
    console.log(`typed text as human :${text} with delay is: ${locator}`);
  }
  /**
   * cleared the element
   * @param locator
   */
  async clear(locator: flexibleLocator): Promise<void> {
    await this.getLocator(locator).clear({ timeout: this.defaulttimeout });
    console.log(`cleared the element: ${locator}`);
  }

  //===============element visibility and state check=========================>>>>

  /**
   *
   * @param locator
   * @returns element is visible or not
   */
  async isEleVisible(
    locator: flexibleLocator,
    index?: number,
  ): Promise<boolean> {
    return await this.getLocator(locator, index).isVisible({
      timeout: this.defaulttimeout,
    });
  }

  /**
   *
   * @param locator
   * @returns element is hidden
   */
  async isHidden(locator: flexibleLocator): Promise<boolean> {
    return await this.getLocator(locator).isHidden({
      timeout: this.defaulttimeout,
    });
  }

  /**
   *
   * @param locator
   * @returns element is enabled
   */
  async isEnabled(locator: flexibleLocator): Promise<boolean> {
    return await this.getLocator(locator).isEnabled({
      timeout: this.defaulttimeout,
    });
  }
  /**
   *
   * @param locator
   * @returns element is disabled
   */
  async isDisabled(locator: flexibleLocator): Promise<boolean> {
    return await this.getLocator(locator).isDisabled({
      timeout: this.defaulttimeout,
    });
  }

  /**
   *
   * @param locator
   * @returns element is checked for checkbox/radio
   */

  async isChecked(locator: flexibleLocator): Promise<boolean> {
    return await this.getLocator(locator).isChecked({
      timeout: this.defaulttimeout,
    });
  }
  /**
   *
   * @param locator
   * @returns element is editbale
   */
  async isEditable(locator: flexibleLocator): Promise<boolean> {
    return await this.getLocator(locator).isEditable({
      timeout: this.defaulttimeout,
    });
  }

  /**
   * Get text content of the element
   */

  async getText(locator: flexibleLocator): Promise<string | null> {
    const text = await this.getLocator(locator).textContent({
      timeout: this.defaulttimeout,
    });
    return text;
  }
  /**
   * get inner text
   * @param locator
   * @returns
   */
  async getInnerText(locator: flexibleLocator): Promise<string> {
    const innertext = await this.getLocator(locator).innerText({
      timeout: this.defaulttimeout,
    });
    return innertext.trim();
  }

  /**
   * get attribute value of an element
   */
  async attributeValue(
    locator: flexibleLocator,
    attributeVal: string,
  ): Promise<string | null> {
    return await this.getLocator(locator).getAttribute(attributeVal);
  }

  /**
   * get entered value of an element
   */
  async inputValue(locator: flexibleLocator): Promise<string> {
    return await this.getLocator(locator).inputValue({
      timeout: this.defaulttimeout,
    });
  }

  /**
   * get all text content
   */

  async getAllInnerText(locator: flexibleLocator): Promise<string[]> {
    return await this.getLocator(locator).allInnerTexts();
  }

  //====================wait utils ========================>>>

  /**
   * wait for element to be visible
   */

  async isVisible(
    locator: flexibleLocator,
    timeout: number = 5000,
  ): Promise<boolean> {
    try {
      await this.getLocator(locator).waitFor({ state: "visible", timeout });
      console.log("waited for element to be visible");
      return true;
    } catch {
      return false;
    }
  }
  /**
   *
   * @param locator
   * @param timeout
   * @returns waits for element to be attached to DOM
   */
  async isAttached(
    locator: flexibleLocator,
    timeout: number = 5000,
  ): Promise<boolean> {
    try {
      await this.getLocator(locator).waitFor({ state: "attached", timeout });
      console.log("waited for element to be attached to DOM");
      return true;
    } catch {
      return false;
    }
  }

  /**
   * wait for page load state
   * @param state
   */
  async waitforPageLoad(
    state: "load" | "domcontentloaded" | "networkidle" = "load",
  ): Promise<void> {
    await this.page.waitForLoadState(state);
    console.log(`waited for page load state: ${state}`);
  }

  /**
   * wait for specific time(static)
   * @param timeout
   */
  async sleep(timeout: number): Promise<void> {
    await this.page.waitForTimeout(timeout);
    console.log(`waited for ${timeout} ms`);
  }

  //==============dropdown utilities/select based======================>>

  async selectByText(locator: flexibleLocator, text: string) {
    await this.getLocator(locator).selectOption(
      { label: text },
      { timeout: this.defaulttimeout },
    );
    console.log(`selected option ${text} from the dropdown ${locator}`);
  }

  async selectByValue(locator: flexibleLocator, value: string) {
    await this.getLocator(locator).selectOption(value, {
      timeout: this.defaulttimeout,
    });
    console.log(`selected option ${value} from the dropdown ${locator}`);
  }

  async selectByIndex(locator: flexibleLocator, indexVal: number) {
    await this.getLocator(locator).selectOption(
      { index: indexVal },
      { timeout: this.defaulttimeout },
    );
    console.log(`selected option ${indexVal} from the dropdown ${locator}`);
  }
}
