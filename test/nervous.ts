/// <reference path="../typings/tsd.d.ts" />

import {Nervous} from '../lib/nervous';
import {PlainMatrix} from '../lib/utils/matrix';
import chai = require('chai');

var expect = chai.expect;

describe('Nervous', function() {
  it('should be defined.', function () {
    let nervous = new Nervous(2, [3, 3], 1);
    
    expect(nervous).to.be.ok;
    expect(nervous.weights.length).to.be.equals(3);
    expect(nervous.weights[0].numRows).to.be.equals(2);
    expect(nervous.weights[0].numCols).to.be.equals(3);
    expect(nervous.weights[1].numRows).to.be.equals(3);
    expect(nervous.weights[1].numCols).to.be.equals(3);
    expect(nervous.weights[2].numRows).to.be.equals(3);
    expect(nervous.weights[2].numCols).to.be.equals(1);
  });
  
  it('should forward.', function () {
    let nervous = new Nervous(2, [3, 3], 1),
        input = new PlainMatrix([
                  [3,5], 
                  [5,1], 
                  [10,2]
                ]),
        output = nervous.forward(input);
        
     console.log('output', output);    
  });
});
