
export interface IPlainMatrix extends Array<Array<number>> {}
export interface IConstantMatrix {
  rows: number;
  columns: number;
  value?: number;
}
export interface ICellProcedure extends Function {
  (value: number, i?: number, j?: number);
}
export interface ICellFunction extends Function {
  (value: number, i?: number, j?: number): number;
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
  
  static copy (m: Matrix): Matrix {
    let i, j,
        result: Matrix = new ConstantMatrix({
          rows: m.numRows, 
          columns: m.numCols
        });
    
    for (i = 0; i < m.numRows; i++) {
      for (j = 0; j < m.numCols; j++) {
        result[i][j] = m[i][j];
      }
    }
    
    return result;
  }
  
  public forEachCell (func: ICellProcedure): Matrix {
    let i, j;
    
    for (i = 0; i < this.numRows; i++) {
      for (j = 0; j < this.numCols; j++) {
        func(this[i][j], i, j);
      }
    }
    
    return this;
  }
  
  static forEachCell (m: Matrix, func: ICellProcedure): Matrix {
    let i, j;
    
    for (i = 0; i < m.numRows; i++) {
      for (j = 0; j < m.numCols; j++) {
        func(m[i][j], i, j);
      }
    }
    
    return m;
  }
  
  public map (func: ICellFunction): Matrix {
    let i, j;
    
    for (i = 0; i < this.numRows; i++) {
      for (j = 0; j < this.numCols; j++) {
        this[i][j] = func(this[i][j], i, j);
      }
    }
    
    return this;
  }
  
  static map (m: Matrix, func: ICellFunction): Matrix {
    let i, j;
    
    for (i = 0; i < m.numRows; i++) {
      for (j = 0; j < m.numCols; j++) {
        m[i][j] = func(m[i][j], i, j);
      }
    }
    
    return m;
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

    for (i = 0; i < this.numRows; i++) {
      
      for (j = 0; j < m.numCols; j++) {
        
        let sum = 0;
        for (k = 0; k < this.numCols; k++) {
          sum += this[i][k] * m[k][j];
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
          rows: m1.numRows, 
          columns: m2.numCols
        }),
        i, j, k;

    for (i = 0; i < m1.numRows; i++) {
      
      for (j = 0; j < m2.numCols; j++) {
        
        let sum = 0;
        for (k = 0; k < m1.numCols; k++) {
          sum += m1[i][k] * m2[k][j];
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
      rows: this.numCols, 
      columns: this.numRows
    });
    
    this.forEachCell((x, i, j) => {
      result[j][i] = this[i][j];
    });
    result.forEachCell((x, i, j) => {
      this[i][j] = x;
    });

    return this;
  }
  
  static transpose (m: Matrix): Matrix {
    let result = new ConstantMatrix({
      rows: m.numCols, 
      columns: m.numRows
    });
    
    m.forEachCell((x, i, j) => {
      result[j][i] = m[i][j];
    });

    return result;
  }
  
  public sum (): number {
    let sum = 0;
    
    this.forEachCell(x => {
      sum += x;
    });
    
    return sum;
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

