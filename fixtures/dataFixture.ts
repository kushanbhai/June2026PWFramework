import { expect, test as base } from '@playwright/test';
import fs from 'fs';
import { parse } from 'csv-parse/sync';


type RegData = {
    firstName: string,
    lastName: string,
    telephone: string,
    password: string,
    subscribeNewsletter: string
}




type csvFixture = {
    regData: RegData[];
}
//dataTest is the fixture name which will be used globally
export const dataTest = base.extend<csvFixture>({
    regData: async ({ }, use) => {
        let fileContent = fs.readFileSync('./data/register.csv', 'utf-8');
        let registrationData: RegData[] = parse(fileContent, {
            columns: true,
            skip_empty_lines: true
        });
        await use(registrationData);
    }
})

export {expect};