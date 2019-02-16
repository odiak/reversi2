import 'mocha'
import { expect } from 'chai'
import { canMove, initBoard, setColor, Black, White, move, getColor } from './game'

describe('canMove', () => {
  it('works', () => {
    let board = initBoard(6, 6)
    board = setColor(board, 2, 2, Black)
    board = setColor(board, 2, 3, White)
    board = setColor(board, 3, 2, White)
    board = setColor(board, 3, 3, Black)

    expect(canMove(board, 2, 2, Black)).to.false
    expect(canMove(board, 2, 1, Black)).to.false
    expect(canMove(board, 2, 1, White)).to.true
    expect(canMove(board, 0, 0, White)).to.false
  })
})

describe('move', () => {
  it('works', () => {
    let board = initBoard(6, 6)
    board = setColor(board, 2, 2, Black)
    board = setColor(board, 2, 3, White)
    board = setColor(board, 3, 2, White)
    board = setColor(board, 3, 3, Black)

    board = move(board, 2, 1, White)
    expect(getColor(board, 2, 1)).to.eq(White)
    expect(getColor(board, 2, 2)).to.eq(White)
    expect(getColor(board, 2, 3)).to.eq(White)
    expect(getColor(board, 3, 2)).to.eq(White)
    expect(getColor(board, 3, 3)).to.eq(Black)
  })
})
