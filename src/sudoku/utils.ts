const DIM = 9;
const GRID_DIM = DIM / 3;
export const PLACEHOLDER = -1;
const buildSets = (): Set<number>[] => {
  const sets: Set<number>[] = [];
  for (let i = 0; i < DIM; i += 1) {
    sets.push(new Set());
  }
  return sets;
}

const getBlockIdx = (row: number, col: number): number => Math.floor(row / GRID_DIM) * GRID_DIM + Math.floor(col / GRID_DIM);

const parseBoard = (board: number[][]): Record<'rows'|'cols'|'blocks', Set<number>[]> => {
  const rows = buildSets();
  const cols = buildSets();
  const blocks = buildSets();
  
  for (let i = 0; i < DIM; i += 1) {
    for (let j = 0; j < DIM; j += 1) {
      const val = board[i][j];
      if (val === PLACEHOLDER) {
        continue;
      }

      rows[i].add(val);
      cols[j].add(val);
      blocks[getBlockIdx(i, j)].add(val);
    }
  }

  return { rows, cols, blocks }
}

export const checkBoard = (board: number[][]): boolean => {
  const rows = buildSets();
  const cols = buildSets();
  const blocks = buildSets();
  
  for (let i = 0; i < DIM; i += 1) {
    for (let j = 0; j < DIM; j += 1) {
      const val = board[i][j];
      if (val === PLACEHOLDER) {
        continue;
      }
      if (rows[i].has(val)) {
        return false;
      }
      rows[i].add(val);
      if (cols[j].has(val)) {
        return false;
      }
      cols[j].add(val);
      const blockIdx = getBlockIdx(i, j);
      if (blocks[blockIdx].has(val)) {
        return false;
      }
      blocks[blockIdx].add(val);
    }
  }

  return true;
}

export const solveSudoku = (board: number[][]): boolean => {
  const seen = parseBoard(board)
  
  return fillBoard(board, 0 ,0, seen)
}

const fillBoard = (board: number[][], row: number, col: number, seen: Record<'rows' | 'cols' | 'blocks', Set<number>[]>): boolean => {
  if (row >= board.length) {
    return true;
  }
  if (col >= board[0].length)  {
    return fillBoard(board, row + 1, 0, seen);
  }
  if (board[row][col] !== PLACEHOLDER) {
    return fillBoard(board, row, col + 1, seen);
  }

  const blockIdx = getBlockIdx(row, col);

  for (let candidate = 1; candidate <= 9; candidate += 1) {
    if (seen.rows[row].has(candidate) || seen.cols[col].has(candidate) || seen.blocks[blockIdx].has(candidate)) {
      continue;
    }

    board[row][col] = candidate;
    seen.rows[row].add(candidate);
    seen.cols[col].add(candidate);
    seen.blocks[blockIdx].add(candidate);
    if (fillBoard(board, row, col + 1, seen)) {
      return true;
    }

    board[row][col] = PLACEHOLDER;
    seen.rows[row].delete(candidate);
    seen.cols[col].delete(candidate);
    seen.blocks[blockIdx].delete(candidate);
  }

  return false;
}

/**
 * Returns an empty sudoku board
 */
export const buildBoard = (): number[][] => {
  const board: number[][] = [];
  for (let i = 0; i < DIM; i += 1) {
    if (i === board.length) {
      board.push([]);
    }
    for (let j = 0; j < DIM; j += 1) {
      board[i].push(PLACEHOLDER);
    }
  }
  return board;
}

export const buildExample = (): number[][] => {
  return [
    [-1, -1,  7, -1,  9,  1, -1, -1,  6],
    [ 6,  3, -1, -1,  4, -1, -1,  2,  9],
    [ 5, -1, -1,  2, -1,  3,  8, -1,  1],
  
    [-1, -1, -1, -1, -1,  9, -1, -1,  4],
    [-1, -1,  4, -1,  7, -1,  2, -1, -1],
    [ 1, -1, -1,  4, -1, -1, -1, -1, -1],
  
    [ 9, -1,  8,  3, -1,  4, -1, -1,  2],
    [ 4,  6, -1, -1,  8, -1, -1,  9,  3],
    [ 7, -1, -1,  9,  1, -1,  4, -1, -1],
  ]
}