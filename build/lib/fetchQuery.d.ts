import { Fetcher } from './fetcher';
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchQuery {
    fetcher: Fetcher;
    baseDataURL: string;
    options: SalesforceOptions;
    static Create(fetcher: Fetcher, options: SalesforceOptions): FetchQuery;
    constructor(fetcher: Fetcher, options: SalesforceOptions);
    private initializeBaseDataURL();
    query(soqlQuery: string): Promise<any>;
}