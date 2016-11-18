import sinon = require('sinon');
import Promise = require('bluebird');
import { Fetcher } from '../../lib/fetcher';
import { FetchQuery } from '../../lib/fetchQuery';

import { SalesforceOptions } from '../../lib/SalesforceOptions';
import { withValidSalesforceOptions } from './SalesforceOptions';

describe('fetchQuery', () => {
    let fetcher: Fetcher;
    let options: SalesforceOptions;
    let fetchQuery: FetchQuery;
    let fetchJSONStub: sinon.SinonStub;
        
    beforeEach(() => {
        options = withValidSalesforceOptions();
        fetcher = Fetcher.Create(options);
        fetchQuery = FetchQuery.Create(fetcher, options);

        fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
            .returns(Promise.resolve('success'));
    });

    afterEach(() => {
        fetchJSONStub.restore();
    });

    describe('constructor', () => {
        it('sets fetcher and options', () => {
            expect(fetchQuery.fetcher).toBe(fetcher);
            expect(fetchQuery.options).toBe(options);
        });

        it('sets baseDataURL', () => {
            expect(options.baseURL).toBe('https://baseurl/test/');
            expect(options.apiVersion).toBe(37);
            expect(fetchQuery.baseDataURL).toBe('https://baseurl/test/services/data/v37.0')
        });
    });

    describe('query', () => {
        it('calls fetchJSON', () => {
            let soqlQuery = 'SELECT Id, Name FROM Account';

            let expectedURL = 'https://baseurl/test/services/data/v37.0/query?q=SELECT%20Id%2C%20Name%20FROM%20Account';
            let expectedOptions = { method: 'GET', cache: false };

            return fetchQuery.query(soqlQuery)
                .then((result) => {
                    expect(result).toBe('success');

                    expect(fetchJSONStub.calledOnce).toBeTruthy();
                    expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                    expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                });
        });
    });
});