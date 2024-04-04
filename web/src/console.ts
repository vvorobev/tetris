import { Figure, Tetris } from "./tetris";
const endColor = "\x1b[0m";

const symbols: Record<number, string> = {
  0: "\x1b[40m",
  1: "\x1b[48;5;14m",
  2: "\x1b[48;5;220m",
  3: "\x1b[45m",
  4: "\x1b[48;5;10m",
  5: "\x1b[41m",
  6: "\x1b[48;5;33m",
  7: "\x1b[48;5;208m",
  8: "\x1b[48;5;8m",
};
function generateSymbol(figure: Figure, x: number, y: number): string {
  let line = "";
  let value = figure[y][x];
  line += symbols[value];
  line += "  ";
  line += endColor;
  return line;
}

function drawer(field: Figure, next: Figure, score: number) {
  let line = "";
  for (let y = 0; y < field.length; y++) {
    for (let x = 0; x < field[y].length; x++) {
      line += generateSymbol(field, x, y);
    }
    if (y === 0) {
      line += "  Next";
    }
    if (y > 1 && y < 2 + next.length) {
      line += "  ";
      for (let j = 0; j < next.length; j++) {
        line += generateSymbol(next, j, y - 2);
      }
    }
    if (y === 7) {
      line += "  Score: ";
      line += score.toString();
    }

    line += "\n";
  }
  console.log(line);
}

const tetris = new Tetris(20, drawer);
// tetris.loop();
