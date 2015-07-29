import {NervousName} from './core/core';

export class Nervous {
  constructor (public name = NervousName) {
    
  }
}

console.log('hi ' + (new Nervous()).name);