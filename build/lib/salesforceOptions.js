"use strict";
var numeral = require('numeral');
var urlJoin = require('url-join');
var defaultOptions = {
    apiVersion: 33
};
function withDefaults(options) {
    var defaultOptionsByBaseURL = Object.assign({}, defaultOptions);
    defaultOptionsByBaseURL.authorizationServiceURL = urlJoin(options.baseURL, '/services/oauth2/authorize');
    defaultOptionsByBaseURL.tokenServiceURL = urlJoin(options.baseURL, '/services/oauth2/token');
    defaultOptionsByBaseURL.revokeServiceURL = urlJoin(options.baseURL, '/services/oauth2/revoke');
    return Object.assign(defaultOptionsByBaseURL, options);
}
exports.withDefaults = withDefaults;
function formatApiVersion(apiVersion) {
    return 'v' + numeral(apiVersion).format('0.0');
}
exports.formatApiVersion = formatApiVersion;
//# sourceMappingURL=salesforceOptions.js.map