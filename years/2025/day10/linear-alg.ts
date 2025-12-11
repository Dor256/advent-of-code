export class LinearSystemSolver {
  private matrix: number[][] = [];
  private numRows: number = 0;
  private numCols: number = 0;
  private minimumPresses = Infinity;
  private pivotCols: number[] = [];
  private freeCols: number[] = [];

  solve(target: number[], operations: number[][]): number {
    this.numRows = target.length;
    this.numCols = operations.length;
    this.minimumPresses = Infinity;

    // 1. Build the Augmented Matrix
    this.matrix = Array.from({ length: this.numRows }, () => Array(this.numCols + 1).fill(0));
    
    // Fill columns based on operations
    for (let col = 0; col < this.numCols; col++) {
      for (const targetIndex of operations[col]) {
        if (targetIndex < this.numRows) {
            this.matrix[targetIndex][col] = 1;
        }
      }
    }
    // Fill last column with target values
    for (let row = 0; row < this.numRows; row++) {
      this.matrix[row][this.numCols] = target[row];
    }

    // 2. Perform Gaussian Elimination to get RREF
    this.gaussianElimination();

    // 3. Identify Pivot vs Free Columns
    this.pivotCols = Array(this.numRows).fill(-1);
    const isPivot = new Set<number>();
    
    for (let row = 0; row < this.numRows; row++) {
      for (let col = 0; col < this.numCols; col++) {
        if (Math.abs(this.matrix[row][col] - 1) < 1e-9) { // Found leading 1
          this.pivotCols[row] = col;
          isPivot.add(col);
          break;
        }
      }
    }

    this.freeCols = [];
    for (let col = 0; col < this.numCols; col++) {
      if (!isPivot.has(col)) this.freeCols.push(col);
    }

    // 4. Recursive Search on Free Variables
    const initialJoltage = Array(this.numCols).fill(0);
    this.search(0, 0, initialJoltage);

    return this.minimumPresses === Infinity ? -1 : this.minimumPresses;
  }

  private gaussianElimination() {
    let pivotRow = 0;
    for (let col = 0; col < this.numCols && pivotRow < this.numRows; col++) {
      // Find max row for pivot (numerical stability)
      let maxRow = pivotRow;
      for (let row = pivotRow + 1; row < this.numRows; row++) {
        if (Math.abs(this.matrix[row][col]) > Math.abs(this.matrix[maxRow][col])) {
          maxRow = row;
        }
      }

      // If column is practically zero, skip
      if (Math.abs(this.matrix[maxRow][col]) === 0) continue;

      // Swap rows
      [this.matrix[pivotRow], this.matrix[maxRow]] = [this.matrix[maxRow], this.matrix[pivotRow]];

      // Normalize pivot row
      const divisor = this.matrix[pivotRow][col];
      for (let j = col; j <= this.numCols; j++) {
        this.matrix[pivotRow][j] /= divisor;
      }

      // Eliminate other rows
      for (let row = 0; row < this.numRows; row++) {
        if (row !== pivotRow) {
          const factor = this.matrix[row][col];
          for (let j = col; j <= this.numCols; j++) {
            this.matrix[row][j] -= factor * this.matrix[pivotRow][j];
          }
        }
      }
      pivotRow++;
    }
  }

  private search(freeVarIndex: number, currentFreePresses: number, joltage: number[]) {
    // Optimization: Since Pivot Vars must be >= 0, Total moves >= currentFreeSum.
    // If our free vars alone already exceed the best total found, stop.
    if (currentFreePresses >= this.minimumPresses) return;

    // Base Case: All free variables assigned
    if (freeVarIndex === this.freeCols.length) {
      this.calculatePivotsAndCheck(joltage, currentFreePresses);
      return;
    }

    const colIdx = this.freeCols[freeVarIndex];
    
    // Determine upper bound
    const upperBound = Math.max(...this.matrix.map((row) => row[this.numCols]));
    
    // Iterate possible values for this free variable
    for (let val = 0; val <= upperBound; val++) {
      joltage[colIdx] = val;
      this.search(freeVarIndex + 1, currentFreePresses + val, joltage);
    }
  }

  private calculatePivotsAndCheck(joltage: number[], currentFreePresses: number) {
    let buttonPressCounter = currentFreePresses;

    for (let row = 0; row < this.numRows; row++) {
      const pivotCol = this.pivotCols[row];

      if (pivotCol === -1) {
        if (Math.abs(this.matrix[row][this.numCols]) > 1e-9) return; 
        continue;
      }

      // Pivot = Constant - Sum(FreeVars * Coeffs)
      let joltageCounter = this.matrix[row][this.numCols]; 
      for (const freeCol of this.freeCols) {
        joltageCounter = joltageCounter - this.matrix[row][freeCol] * joltage[freeCol];
      }

      if (joltageCounter < -1e-9 || Math.abs(joltageCounter - Math.round(joltageCounter)) > 1e-9) return;
      
      const intVal = Math.round(joltageCounter);
      joltage[pivotCol] = intVal;
      buttonPressCounter += intVal;
    }

    if (buttonPressCounter < this.minimumPresses) {
      this.minimumPresses = buttonPressCounter;
    }
  }
}
