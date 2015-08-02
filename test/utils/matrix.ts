/// <reference path="../../typings/tsd.d.ts" />

import * as Utils from '../../lib/utils/matrix';
import chai = require('chai');

var expect = chai.expect;

describe('Matrix', () => {
  describe('Creation', () => {
    it('create an matrix 3x3 of ones.', () => {
      let matrix = new Utils.ConstantMatrix({
        rows: 3, 
        columns: 3,
        value: 1
      });
      
      expect(matrix).to.be.instanceOf(Utils.Matrix);
      expect(matrix).to.be.instanceOf(Utils.ConstantMatrix);

      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix[i][j]).to.be.equals(1);
        }
      }
      
    });
    
    it('create an matrix 3x3', () => {
      let matrix = new Utils.PlainMatrix([
        [1, 2, 3],
        [1, 2, 3],
        [4, 5, 6]
      ]);
      
      expect(matrix).to.be.instanceOf(Utils.Matrix);
      expect(matrix).to.be.instanceOf(Utils.PlainMatrix);
      
      expect(matrix).to.be.ok;
      expect(matrix[0]).to.deep.equal([1, 2, 3]);
      expect(matrix[1]).to.deep.equal([1, 2, 3]);
      expect(matrix[2]).to.deep.equal([4, 5, 6]);
    });
  });
  
  describe('Add', () => {
    it('should add 2 matrix', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 1
          }), 
          matrix2 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 2
          });
          
      expect(matrix1).to.be.ok;
      expect(matrix2).to.be.ok;
      
      matrix1.add(matrix2);
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix1[i][j]).to.be.equals(3);
          expect(matrix2[i][j]).to.be.equals(2);
        }
      }
    });
    
    it('should static add 2 matrix', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 1
          }), 
          matrix2 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 2
          }),
          res = Utils.Matrix.add(matrix1, matrix2);
          
      expect(matrix1).to.be.ok;
      expect(matrix2).to.be.ok;
      expect(res).to.be.ok;
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix1[i][j]).to.be.equals(1);
          expect(matrix2[i][j]).to.be.equals(2);
          expect(res[i][j]).to.be.equals(3);
        }
      }
    });
  });
  
  describe('Sub', () => {
    it('should sub 2 matrix', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 10
          }), 
          matrix2 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 2
          });
          
      expect(matrix1).to.be.ok;
      expect(matrix2).to.be.ok;
      
      matrix1.sub(matrix2);
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix1[i][j]).to.be.equals(8);
          expect(matrix2[i][j]).to.be.equals(2);
        }
      }
    });
    
    it('should static sub 2 matrix', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 1
          }), 
          matrix2 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 2
          }),
          res = Utils.Matrix.sub(matrix1, matrix2);
          
      expect(matrix1).to.be.ok;
      expect(matrix2).to.be.ok;
      expect(res).to.be.ok;
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix1[i][j]).to.be.equals(1);
          expect(matrix2[i][j]).to.be.equals(2);
          expect(res[i][j]).to.be.equals(-1);
        }
      }
    });
  });
  
  describe('Multiply', () => {
    it('should multiply 2 matrix', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 2, 
            columns: 2,
            value: 10
          }), 
          matrix2 = new Utils.ConstantMatrix({
            rows: 2, 
            columns: 2,
            value: 2
          });
          
      expect(matrix1).to.be.ok;
      expect(matrix2).to.be.ok;
      
      matrix1.multiply(matrix2);
      
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          expect(matrix1[i][j]).to.be.equals(40);
          expect(matrix2[i][j]).to.be.equals(2);
        }
      }
    });
    
    it('should static multiply 2 matrix', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 2, 
            columns: 2,
            value: 10
          }), 
          matrix2 = new Utils.ConstantMatrix({
            rows: 2, 
            columns: 2,
            value: 2
          }),
          res = Utils.Matrix.multiply(matrix1, matrix2),
          matrix3 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 2,
            value: 10
          }), 
          matrix4 = new Utils.ConstantMatrix({
            rows: 2, 
            columns: 4,
            value: 2
          }),
          res2 = Utils.Matrix.multiply(matrix3, matrix4);
          
      expect(matrix1).to.be.ok;
      expect(matrix2).to.be.ok;
      expect(res).to.be.ok;
      expect(matrix3).to.be.ok;
      expect(matrix4).to.be.ok;
      expect(res2).to.be.ok;
      
      
      for (let i = 0; i < 2; i++) {
        for (let j = 0; j < 2; j++) {
          expect(matrix1[i][j]).to.be.equals(10);
          expect(matrix2[i][j]).to.be.equals(2);
          expect(res[i][j]).to.be.equals(40);
        }
      }
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
          expect(res2[i][j]).to.be.equals(40);
        }
      }
    });
  });
  
  describe('Multiply', () => {
    it('should multiply a matrix by a scalar', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 10
          }); 
            
      expect(matrix1).to.be.ok;
  
      matrix1.multiplyScalar(2);
        
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix1[i][j]).to.be.equals(20);
        }
      }
    });
    
    it('should static multiply a matrix by a scalar', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 10
          }),
          res = Utils.Matrix.multiplyScalar(matrix1, 5);
            
      expect(matrix1).to.be.ok;
      expect(res).to.be.ok;
      
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix1[i][j]).to.be.equals(10);
          expect(res[i][j]).to.be.equals(50);
        }
      }
    });
  });
  
  describe('Multiply element-wise', () => {
    it('should multiply 2 matrix element-wise', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 10
          }),
          matrix2 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 5
          });
            
      expect(matrix1).to.be.ok;
      expect(matrix2).to.be.ok;
      
      matrix1.multiplyElement(matrix2);
  
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix1[i][j]).to.be.equals(50);
          expect(matrix2[i][j]).to.be.equals(5);
        }
      }
    });
    
    it('should static multiply a matrix by a scalar', () => {
      let matrix1 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 10
          }),
          matrix2 = new Utils.ConstantMatrix({
            rows: 3, 
            columns: 3,
            value: 9
          }),
          res = Utils.Matrix.multiplyElement(matrix1, matrix2); 
            
      expect(matrix1).to.be.ok;
      expect(matrix2).to.be.ok;
      expect(res).to.be.ok;
  
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          expect(matrix1[i][j]).to.be.equals(10);
          expect(matrix2[i][j]).to.be.equals(9);
          expect(res[i][j]).to.be.equals(90);
        }
      }
    });
  });
  
  describe('Transpose', () => {
    it('should transpose a matrix', () => {
      let matrix1 = new Utils.PlainMatrix([
            [1, 2],
            [1, 2]
          ]);
      
      expect(matrix1).to.be.ok;
      
      matrix1.transpose();
      
      expect(matrix1[0]).to.deep.equal([1, 1]);
      expect(matrix1[1]).to.deep.equal([2, 2]);
    });
    
    it('should static transpose a matrix', () => {
      let matrix1 = new Utils.PlainMatrix([
            [1, 2],
            [1, 2]
          ]),
          res = Utils.Matrix.transpose(matrix1);
      
      expect(matrix1).to.be.ok;
      expect(res).to.be.ok;
      
      expect(matrix1[0]).to.deep.equal([1, 2]);
      expect(matrix1[1]).to.deep.equal([1, 2]);
      expect(res[0]).to.deep.equal([1, 1]);
      expect(res[1]).to.deep.equal([2, 2]);
    });
  });
});
