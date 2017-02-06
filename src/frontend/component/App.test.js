import chai from 'chai';
import { expect } from 'chai';

import App from './App.vue';

chai.should();

describe('App component test', () => {
    it('check if it has correct name set', () => {
        expect(App.name).to.be.eql('app');
    });
});
