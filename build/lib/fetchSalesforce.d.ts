import { Fetcher } from './fetcher';
import { FetchSObject } from './fetchSObject';
import { FetchQuery } from './fetchQuery';
import { FetchChatter } from './fetchChatter';
import { SalesforceOptions } from './salesforceOptions';
export declare class FetchSalesforce {
    options: SalesforceOptions;
    fetcher: Fetcher;
    fetchSObject: FetchSObject;
    fetchQuery: FetchQuery;
    fetchChatter: FetchChatter;
    constructor(options: SalesforceOptions);
}
