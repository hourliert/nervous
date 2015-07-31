
export interface IPlainMatrix extends Array<Array<number>> {}
export interface IConstantMatrix {
  rows: number;
  columns: number;
  value?: number;
}
export interface ICellApplicator extends Function {
  (value: number, i: number, j: number);
}

export class Matrix {
  public dimension: Array<number>;
  
  constructor (
    public numRows: number,
    public numCols: number,
    values: number|number[][] = 0
  ) {
    let i, j;
    
    this.dimension = [numRows, numCols];
    
    for (i = 0; i < this.numRows; i++) {
      for (j = 0; j < this.numCols; j++) {
          
          if (values instanceof Array) {
            this[i] = this[i] || [];
            this[i][j] = values[i][j];
          } else if (typeof values === 'number') {
            this[i] = this[i] || [];
            this[i][j] = values;
          }
          
      }
    }
  }
  
  public forEachCell (func: ICellApplicator) {
    let i, j;
    
    for (i = 0; i < this.numRows; i++) {
      for (j = 0; j < this.numCols; j++) {
        func(this[i][j], i, j);
      }
    }
    
  }
  
  public add (m: Matrix): Matrix {
    
    if (this.numRows !== m.numRows || this.numCols !== m.numCols) {
      throw new Error('You can only add matrices with equal dimensions');
    }   
    this.forEachCell((x, i, j) => {
      this[i][j] = x + m[i][j];
    }); 
    return this;
    
  }
  
  static add (m1: Matrix, m2: Matrix): Matrix {
    
    let result: Matrix = new ConstantMatrix({
      rows: m1.numRows, 
      columns: m1.numCols
    });
    
    if (m1.numRows !== m2.numRows || m1.numCols !== m2.numCols) {
      throw new Error('You can only add matrices with equal dimensions');
    } 
    result.forEachCell((x, i, j) => {
      console.log
      result[i][j] = m1[i][j] + m2[i][j];
    });
    return result;
    
  }
  
  public sub (m: Matrix): Matrix {
    
    if (this.numRows !== m.numRows || this.numCols !== m.numCols) {
      throw new Error('You can only add matrices with equal dimensions');
    }
    this.forEachCell((x, i, j) => {
      this[i][j] = x - m[i][j];
    }); 
    return this;
    
  }
  
  static sub (m1: Matrix, m2: Matrix): Matrix {
    
    let result: Matrix = new ConstantMatrix({
      rows: m1.numRows, 
      columns: m1.numCols
    });
    
    if (m1.numRows !== m2.numRows || m1.numCols !== m2.numCols) {
      throw new Error('You can only add matrices with equal dimensions');
    }
    result.forEachCell((x, i, j) => {
      result[i][j] = m1[i][j] - m2[i][j];
    });
    return result;
    
  }
  
  public multiply (m: Matrix): Matrix {
    let result: Matrix = new ConstantMatrix({
          rows: m.numRows, 
          columns: this.numCols
        }),
        i, j, k;

    for (i = 0; i < m.numRows; i++) {
      
      for (j = 0; j < this.numCols; j++) {
        
        let sum = 0;
        for (k = 0; k < this.numRows; k++) {
          sum += this[k][j] * m[i][k];
        } 
        result[i][j] = sum;
        
      }
      
    }
    result.forEachCell((x, i, j) => {
      this[i][j] = x;
    });
    
    return this;
    
  }
  
  static multiply (m1: Matrix, m2: Matrix): Matrix {
    let result: Matrix = new ConstantMatrix({
          rows: m2.numRows, 
          columns: m1.numCols
        }),
        i, j, k;

    for (i = 0; i < m2.numRows; i++) {
      
      for (j = 0; j < m1.numCols; j++) {
        
        let sum = 0;
        for (k = 0; k < m1.numRows; k++) {
          sum += m1[k][j] * m2[i][k];
        } 
        result[i][j] = sum;
        
      }
      
    }
    
    return result;
    
  }
  
  public multiplyScalar (scalar: number): Matrix {
    
    this.forEachCell((x, i, j) => {
      this[i][j] = scalar * x;
    });  
    return this;

  }
  
  static multiplyScalar (m: Matrix, scalar: number): Matrix {
    let result: Matrix = new ConstantMatrix({
          rows: m.numRows, 
          columns: m.numCols
        });
        
    m.forEachCell((x, i, j) => {
      result[i][j] = scalar * x;
    });  
    return result;

  }
  
  public multiplyElement (m: Matrix): Matrix {
    if (this.numRows !== m.numRows || this.numCols !== m.numCols) {
      throw new Error('You can only multiply elements-wise matrices with equal dimensions');
    } 
    this.forEachCell((x, i, j) => {
      this[i][j] = x * m[i][j];
    });
    return this;
  }
  
  static multiplyElement (m1: Matrix, m2: Matrix): Matrix {
    
    let result: Matrix = new ConstantMatrix({
      rows: m1.numRows, 
      columns: m1.numCols
    });
   
    if (m1.numRows !== m2.numRows || m1.numCols !== m2.numCols) {
      throw new Error('You can only multiply elements-wise matrices with equal dimensions');
    } 
    result.forEachCell((x, i, j) => {
      result[i][j] = m1[i][j] * m2[i][j];
    });
    return result;
  }
  
  public transpose (): Matrix {
    let result = new ConstantMatrix({
      rows: this.numRows, 
      columns: this.numCols
    });
    
    this.forEachCell((x, i, j) => {
      result[i][j] = this[j][i];
    });
    result.forEachCell((x, i, j) => {
      this[i][j] = x;
    });

    return this;
  }
  
  static transpose (m: Matrix): Matrix {
    let result = new ConstantMatrix({
      rows: m.numRows, 
      columns: m.numCols
    });
    
    m.forEachCell((x, i, j) => {
      result[i][j] = m[j][i];
    });

    return result;
  }
}

export class ConstantMatrix extends Matrix {
  constructor (
    options: IConstantMatrix
  ) {
    super(options.rows, options.columns, options.value); 
  }
}

export class PlainMatrix extends Matrix {
  constructor (
    options: IPlainMatrix
  ) {
    super(options.length, options[0].length, options);
  }
}

