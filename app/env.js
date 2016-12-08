(function(window) {
    window.__env = window.__env || {};
    window.__env.CLIENT_ID = 'cbo_client_demo';
    window.__env.CLIENT_SECRET = '7e98a24f4fe91535348f6e87cde866dca9134b50fc029abefdc7278369f2';
    window.__env.AUTH_URL = 'https://auth.cbo.upward.st/api/';
    //window.__env.AUTH_URL = 'http://localhost:3000/api/';
    window.__env.API_URL = 'https://api.cbo.upward.st/';
    window.__env.RESPONSE_TYPE = 'code';
    window.__env.GRANT_TYPE = 'password';
    window.__env.REDIRECT_URL = 'cbo.upward.st/';
    window.__env.CALLBACK_URL = 'localhost:9000/#/reset';
    //window.__env.CALLBACK_URL = 'cbo.upward.st/#/reset';
    window.__env.ENV = 'helpinghand.cbo.upward.st';
    window.__env.DISTRICT = [{
        id: 'seattle',
        name: 'Seattle'
    }, {
        id: 'highline',
        name: 'Highline'
    }, {
        id: 'federalway',
        name: 'Federal Way'
    }, {
        id: 'renton',
        name: 'Renton'
    }, {
        id: 'northshore',
        name: 'North Shore'
    }, {
        id: 'tukwila',
        name: 'Tukwila'
    }];
    window.__env.RELATIONSHIP = [{
        id: 'parent',
        name: 'Parent'
    }, {
        id: 'grandparent',
        name: 'Grandparent'
    }, {
        id: 'aunt',
        name: 'Aunt'
    }, {
        id: 'uncle',
        name: 'Uncle'
    }, {
        id: 'brother',
        name: 'Brother'
    }, {
        id: 'sister',
        name: 'Sister'
    }];
})(this);