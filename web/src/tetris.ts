function noop() {}
export type Tetronomino = {
  figure: Figure;
  cords: Cords;
  ghostCords: Cords;
};
export type Cords = { x: number; y: number };
export type Figure = number[][];
export type Drawer = (field: Figure, next: Figure, score: number) => void;

const TETRONOMINOS: Figure[] = [
  // I
  [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
  ],
  // O
  [
    [0, 0, 0, 0],
    [0, 2, 2, 0],
    [0, 2, 2, 0],
    [0, 0, 0, 0],
  ],
  // T
  [
    [0, 0, 0],
    [3, 3, 3],
    [0, 3, 0],
  ],
  // S
  [
    [0, 0, 0],
    [0, 4, 4],
    [4, 4, 0],
  ],
  // Z
  [
    [0, 0, 0],
    [5, 5, 0],
    [0, 5, 5],
  ],
  // J
  [
    [0, 0, 0],
    [6, 6, 6],
    [0, 0, 6],
  ],
  // L
  [
    [0, 0, 0],
    [7, 7, 7],
    [7, 0, 0],
  ],
];
const GHOST = 8;

export class Tetris {
  private readonly field: Figure = [
    //buffer
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    // playField
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];
  private activeTetronomino: Tetronomino;
  private nextTetronomino: Tetronomino;

  private score = 0;
  constructor(
    private readonly speed: number,
    private readonly drawer: Drawer = noop
  ) {
    this.activeTetronomino = this.generateTetronomino();
    this.nextTetronomino = this.generateTetronomino();
  }
  private generateTetronomino(): Tetronomino {
    const id = Math.floor(Math.random() * TETRONOMINOS.length);
    const x = Math.floor(
      (this.field[0].length - TETRONOMINOS[id][0].length) / 2
    );
    return {
      figure: TETRONOMINOS[id],
      cords: { x, y: 0 },
      ghostCords: { x, y: 0 },
    };
  }
  private updateTetronominos() {
    this.activeTetronomino = this.nextTetronomino;
    this.nextTetronomino = this.generateTetronomino();
  }
  private calcGhostPosition() {
    const y = this.activeTetronomino.cords.y;
    this.activeTetronomino.cords.y++;
    while (!this.hasCollision()) {
      this.activeTetronomino.cords.y++;
    }
    this.activeTetronomino.ghostCords.y = this.activeTetronomino.cords.y - 1;
    this.activeTetronomino.ghostCords.x = this.activeTetronomino.cords.x;
    this.activeTetronomino.cords.y = y;
  }
  private isTetronominoHasValue(
    figure: Figure,
    cords: Cords,
    x: number,
    y: number
  ) {
    return figure[y - cords.y] && figure[y - cords.y][x - cords.x] > 0;
  }
  private getState() {
    const { field, activeTetronomino } = this;
    const result = [] as Figure;
    for (let i = 4; i < field.length; i++) {
      if (i < 3) {
        continue;
      }
      const row = i - 4;
      result[row] = [];
      for (let j = 0; j < field[i].length; j++) {
        result[row][j] = field[i][j];
        if (
          this.isTetronominoHasValue(
            activeTetronomino.figure,
            activeTetronomino.ghostCords,
            j,
            i
          )
        ) {
          result[row][j] = GHOST;
        }
        if (
          this.isTetronominoHasValue(
            activeTetronomino.figure,
            activeTetronomino.cords,
            j,
            i
          )
        ) {
          result[row][j] =
            activeTetronomino.figure[i - activeTetronomino.cords.y][
              j - activeTetronomino.cords.x
            ];
        }
      }
    }
    this.drawer(result, this.nextTetronomino.figure, this.score);
  }
  private lockTetronomino() {
    const { figure, cords } = this.activeTetronomino;
    for (let y = 0; y < figure.length; y++) {
      for (let x = 0; x < figure[y].length; x++) {
        if (figure[y][x] !== 0) {
          this.field[cords.y + y][cords.x + x] = figure[y][x];
          this.score++;
        }
      }
    }
  }
  public moveLeft() {
    this.activeTetronomino.cords.x--;
    if (this.hasCollision()) {
      this.activeTetronomino.cords.x++;
      return;
    }
    this.calcGhostPosition();
    this.getState();
  }
  public moveRight() {
    this.activeTetronomino.cords.x++;
    if (this.hasCollision()) {
      this.activeTetronomino.cords.x--;
      return;
    }
    this.calcGhostPosition();
    this.getState();
  }
  public moveDown() {
    this.activeTetronomino.cords.y++;
    if (this.hasCollision()) {
      this.activeTetronomino.cords.y--;
      this.lockTetronomino();
      this.updateTetronominos();
      this.clearFullRows();
      return;
    }
    this.calcGhostPosition();
    this.getState();
  }
  public rotate() {
    const { figure } = this.activeTetronomino;
    const length = figure.length;
    const newFigure = [] as Figure;
    for (let i = 0; i < length; i++) {
      newFigure[i] = [];
      for (let j = 0; j < length; j++) {
        newFigure[i][j] = figure[length - 1 - j][i];
      }
    }
    this.activeTetronomino.figure = newFigure;
    if (this.hasCollision()) {
      this.activeTetronomino.figure = figure;
    }
    this.calcGhostPosition();
    this.getState();
  }
  private hasCollision() {
    const {
      field,
      activeTetronomino: { figure, cords },
    } = this;
    for (let i = 0; i < figure.length; i++) {
      for (let j = 0; j < figure[i].length; j++) {
        if (
          figure[i][j] !== 0 &&
          (field[cords.y + i] === undefined ||
            field[cords.y + i][cords.x + j] === undefined ||
            field[cords.y + i][cords.x + j] !== 0)
        ) {
          return true;
        }
      }
    }
    return false;
  }
  private isLastRowFilled() {
    for (let i = 0; i < this.field[3].length; i++) {
      if (this.field[3][i] > 0) {
        return true;
      }
    }
    return false;
  }
  private calcScorePerRow(count: number) {
    const scores = [100, 300, 500, 800];
    this.score += scores[count - 1] || 0;
  }
  private dropRowsAbove(y: number) {
    for (let j = y; j > 0; j--) {
      for (let x = 0; x < this.field[j].length; x++) {
        this.field[j][x] = this.field[j - 1][x];
      }
    }
  }
  private clearFullRows() {
    let clearedRows = 0;
    const length = this.field.length;
    for (let y = length - 1; y > 0; y--) {
      let isRowFull = true;
      for (let x = 0; x < this.field[y].length; x++) {
        if (this.field[y][x] === 0) {
          isRowFull = false;
          break;
        }
      }
      if (!isRowFull) {
        continue;
      }

      this.dropRowsAbove(y);
      clearedRows++;
      y++;
    }
    this.calcScorePerRow(clearedRows);
  }
  public loop() {
    if (this.isLastRowFilled()) {
      return;
    }
    this.moveDown();
    setTimeout(() => {
      this.loop();
    }, this.speed);
  }
}
