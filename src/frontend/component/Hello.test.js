import chai, { expect } from 'chai';
import Vue from 'vue';

import Hello from './Hello.vue';

chai.should();

describe('vue test', () => {
    it('should render correct contents', () => {
        const vm = new Vue({
            el: document.createElement('div'),
            render: (h) => h(Hello)
        });
        expect(vm.$el.querySelector('h1').textContent).to.be.eql('Welcome to Your Vue.js App');
    });
});

describe('testing mocha', () => {
    it('should pass', () => {
        expect(true).to.equal(true);
    });
});

describe('number tests', () => {
    function isEven(number) { return number % 2 === 0; }
    describe('isEven', () => {
        it('should return true when number is even', () => { isEven(4).should.be.true; });
        it('should return false when number is odd', () => { expect(isEven(5)).to.be.false; });
    });

    function add(num1, num2) { return num1 + num2; }
    describe('add with setup and teardown', () => {
        let num;
        beforeEach(() => { num = 5; });
        afterEach(() => {});
        it('should be 10 when adding to 5', () => {
            num = add(num, 5);
            num.should.equal(10);
        });
        it.skip('should be 12 when adding to 7', () => { add(num, 7).should.equal(12); });
    });
});
