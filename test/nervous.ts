/// <reference path="../typings/tsd.d.ts" />

import {Nervous} from '../lib/nervous';
import chai = require('chai');

var expect = chai.expect;

describe('Nervous', function() {
  it('should be defined.', function () {
    let nervous = new Nervous();
    expect(nervous).to.be.ok;
  });
});
