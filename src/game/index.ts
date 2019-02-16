export const Empty = 0
export const Black = 1
export const White = 2
export type Color = typeof Empty | typeof Black | typeof White

export interface Board {
  readonly raw: ReadonlyArray<Color>
  readonly width: number
  readonly height: number
  readonly _movability?: ReadonlyArray<boolean>
}

export function initBoard(width: number, height: number): Board {
  if (width <= 0 || height <= 0) {
    throw new Error('invalid board width and/or height')
  }

  return {
    raw: new Array(width * height).fill(Empty) as Color[],
    width,
    height
  }
}

function assignArray<Elem, TArray extends ReadonlyArray<Elem> | Array<Elem>>(
  array: TArray,
  index: number,
  value: Elem
): TArray {
  const newArray = array.slice()
  newArray[index] = value
  return newArray as TArray
}

function isValidXY(board: Board, x: number, y: number): boolean {
  return (
    Number.isInteger(x) &&
    Number.isInteger(y) &&
    x >= 0 &&
    y >= 0 &&
    x < board.width &&
    y < board.height
  )
}

export function getColor(board: Board, x: number, y: number): Color {
  if (!isValidXY(board, x, y)) return Empty

  return board.raw[x + board.width * y]
}

function canMoveWithDir(
  board: Board,
  x: number,
  y: number,
  color: Color,
  dx: number,
  dy: number
): boolean {
  let n = 0
  while (true) {
    x += dx
    y += dy
    const c = getColor(board, x, y)
    if (c === color) {
      return n > 0
    } else if (c !== Empty) {
      n++
    } else {
      return false
    }
  }
}

export function canMove(board: Board, x: number, y: number, color: Color): boolean {
  const movability = board._movability
  if (movability !== undefined) {
    return movability[x + y * board.width]
  }

  if (getColor(board, x, y) !== Empty) return false

  return (
    canMoveWithDir(board, x, y, color, -1, -1) ||
    canMoveWithDir(board, x, y, color, -1, 0) ||
    canMoveWithDir(board, x, y, color, -1, 1) ||
    canMoveWithDir(board, x, y, color, 0, -1) ||
    canMoveWithDir(board, x, y, color, 0, 1) ||
    canMoveWithDir(board, x, y, color, 1, -1) ||
    canMoveWithDir(board, x, y, color, 1, 0) ||
    canMoveWithDir(board, x, y, color, 1, 1)
  )
}

export function calculateMovability(board: Board, color: Color): Board {
  if (board._movability !== undefined) {
    return board
  }

  const { width, height } = board
  const n = width * height
  const m: boolean[] = new Array(n)
  for (let i = 0; i < n; i++) {
    const x = i % width
    const y = (i - x) / width
    m[i] = canMove(board, x, y, color)
  }

  return { ...board, _movability: m }
}

function moveWithDir(
  board: Board,
  x: number,
  y: number,
  color: Color,
  dx: number,
  dy: number
): number[] {
  const indices: number[] = []
  let n = 0
  while (true) {
    x += dx
    y += dy
    const c = getColor(board, x, y)
    if (c === color) {
      break
    } else if (c === Empty) {
      return []
    } else {
      n++
    }
  }
  for (; n > 0; n--) {
    x -= dx
    y -= dy
    indices.push(x + y * board.width)
  }
  return indices
}

export function setColor(board: Board, x: number, y: number, color: Color): Board {
  return {
    ...board,
    raw: assignArray(board.raw, x + y * board.width, color),
    _movability: undefined
  }
}

export function move(board: Board, x: number, y: number, color: Color): Board {
  if (!canMove(board, x, y, color)) {
    return board
  }

  const raw = board.raw.slice()
  raw[x + y * board.width] = color
  const indices = [
    ...moveWithDir(board, x, y, color, -1, -1),
    ...moveWithDir(board, x, y, color, -1, 0),
    ...moveWithDir(board, x, y, color, -1, 1),
    ...moveWithDir(board, x, y, color, 0, -1),
    ...moveWithDir(board, x, y, color, 0, 1),
    ...moveWithDir(board, x, y, color, 1, -1),
    ...moveWithDir(board, x, y, color, 1, 0),
    ...moveWithDir(board, x, y, color, 1, 1)
  ]
  for (const i of indices) {
    raw[i] = color
  }

  return { ...board, raw, _movability: undefined }
}
