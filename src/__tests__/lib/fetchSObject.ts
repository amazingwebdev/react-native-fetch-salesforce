import * as sinon from 'sinon';
import * as Promise from 'bluebird';
import { Fetcher } from '../../lib/fetcher';
import { FetchSObject } from '../../lib/fetchSObject';

import { SalesforceOptions } from '../../lib/SalesforceOptions';
import { withValidSalesforceOptions } from './SalesforceOptions';

describe('fetchSObject', () => {
    let fetcher: Fetcher;
    let options: SalesforceOptions;
    let fetchSObject: FetchSObject;
    let fetchJSONStub: sinon.SinonStub;
        
    beforeEach(() => {
        options = withValidSalesforceOptions();
        fetcher = Fetcher.Create(options);
        fetchSObject = FetchSObject.Create(fetcher, options);

        fetchJSONStub = sinon.stub(fetcher, 'fetchJSON')
            .returns(Promise.resolve('success'));
    });

    afterEach(() => {
        fetchJSONStub.restore();
    });

    describe('constructor', () => {
        it('sets fetcher and options', () => {
            expect(fetchSObject.fetcher).toBe(fetcher);
            expect(fetchSObject.options).toBe(options);
        });

        it('sets baseDataURL', () => {
            expect(options.baseURL).toBe('https://baseurl/test/');
            expect(options.apiVersion).toBe(37);
            expect(fetchSObject.baseDataURL).toBe('https://baseurl/test/services/data/v37.0')
        });
    });

    describe('insert', () => {
        it('calls fetchJSON', (testDone) => {
            let sObjectName = 'Account';
            let sObjectBody = {
                Name: 'test name'
            };

            let expectedURL = 'https://baseurl/test/services/data/v37.0/Account';
            let expectedOptions = {
                    headers: { 'Content-Type': 'application/json' },
                    method: 'POST',
                    body: '{"Name":"test name"}'
                };

            fetchSObject.insert(sObjectName, sObjectBody)
                .then((result) => {
                    expect(result).toBe('success');

                    expect(fetchJSONStub.calledWithExactly(expectedURL, expectedOptions)).toBeTruthy();
                    testDone();
                });
        });
    });

    describe('get', () => {
        let sObjectName: string;
        let id: string;

        beforeEach(() => {
            sObjectName = 'Case';
            id = 'a0Ga000000awuHe';
        });

        it('calls fetchJSON', () => {
            let expectedURL = 'https://baseurl/test/services/data/v37.0/Case/a0Ga000000awuHe';
            let expectedOptions = {
                headers: { 'Content-Type': 'application/json' },
                method: 'GET'
            };

            return fetchSObject.get(sObjectName, id)
                .then((result) => {
                    expect(result).toBe('success');
                    expect(fetchJSONStub.calledOnce).toBeTruthy();
                    expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                    expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                });
        });
    });

    describe('update', () => {
        let sObjectName: string;
        let sObjectBody: any;

        beforeEach(() => {
            sObjectName = 'Case';
            sObjectBody = {
                Name: 'test case name',
                Subject: 'what'
            }
        });

        describe('with id', () => {
            beforeEach(() => {
                sObjectBody.id = 'a0Ga000000awuHe';
            });

            it('calls fetchJSON', () => {
                let expectedURL = 'https://baseurl/test/services/data/v37.0/Case/a0Ga000000awuHe';
                let expectedOptions = {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'PATCH',
                        body: '{"Name":"test case name","Subject":"what","id":"a0Ga000000awuHe"}'
                    };

                return fetchSObject.update(sObjectName, sObjectBody)
                    .then((result) => {
                        expect(result).toBe('success');
                        expect(fetchJSONStub.calledOnce).toBeTruthy();
                        expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                        expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                    });
            });
        });

        describe('without id', () => {
            it('calls fetchJSON and an exception is thrown', () => {
                let expectedURL = 'https://baseurl/test/services/data/v37.0/Case/a0Ga000000awuHe';
                let expectedOptions = {
                        headers: { 'Content-Type': 'application/json' },
                        method: 'PATCH',
                        body: '{"Name":"test case name","Subject":"what","id":"a0Ga000000awuHe"}'
                    };

                try {
                    fetchSObject.update(sObjectName, sObjectBody)
                        .then(fail);
                } catch(reason) {
                    let expectedReason = {
                        error: 'Invalid body for update, missing id',
                        body: sObjectBody
                    }
                    expect(reason).toEqual(expectedReason);
                }
            });
        });
    });

    describe('delete', () => {
        let sObjectName: string;
        let id: string;

        beforeEach(() => {
            sObjectName = 'Case';
            id = 'a0Ga000000awuHe';
        });

        it('calls fetchJSON', () => {
            let expectedURL = 'https://baseurl/test/services/data/v37.0/Case/a0Ga000000awuHe';
            let expectedOptions = {
                method: 'DELETE'
            };

            return fetchSObject.delete(sObjectName, id)
                .then((result) => {
                    expect(result).toBe('success');
                    expect(fetchJSONStub.calledOnce).toBeTruthy();
                    expect(fetchJSONStub.getCall(0).args[0]).toEqual(expectedURL);
                    expect(fetchJSONStub.getCall(0).args[1]).toEqual(expectedOptions);
                });
        });
    });
});