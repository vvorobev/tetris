import { Figure } from "./tetris";

export class View {
  private readonly ctx: CanvasRenderingContext2D;
  private readonly rectSize: number;
  private readonly width = 300;
  private readonly height = 600;
  private readonly colors: Record<number, string> = {
    0: "#334155",
    1: "#22d3ee",
    2: "#facc15",
    3: "#c084fc",
    4: "#4ade80",
    5: "#f87171",
    6: "#60a5fa",
    7: "#fb923c",
    8: "#475569",
  };
  private readonly strokeColors: Record<number, string> = {
    0: "#334155",
    1: "#cffafe",
    2: "#fef9c3",
    3: "#f3e8ff",
    4: "#dcfce7",
    5: "#fee2e2",
    6: "#dbeafe",
    7: "#ffedd5",
    8: "#f1f5f9",
  };
  constructor() {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
    this.ctx = ctx;
    canvas.width = this.width;
    canvas.height = this.height;
    this.rectSize = 30;
    canvas.style.backgroundColor = this.colors[0];
    document.body.appendChild(canvas);
  }
  private drawRect(x: number, y: number, value: number, stroke: boolean) {
    this.ctx.fillStyle = this.colors[value];
    this.ctx.strokeStyle = this.strokeColors[value];
    this.ctx.lineWidth = 2;
    this.ctx.fillRect(
      x * this.rectSize,
      y * this.rectSize,
      this.rectSize,
      this.rectSize
    );
    if (stroke) {
      this.ctx.strokeRect(
        x * this.rectSize,
        y * this.rectSize,
        this.rectSize,
        this.rectSize
      );
    }
  }
  private clear() {
    this.ctx.fillStyle = this.colors[0];
    this.ctx.fillRect(0, 0, this.width, this.height);
  }
  public drawer(field: Figure, next: Figure, score: number) {
    this.clear();
    for (let y = 0; y < field.length; y++) {
      for (let x = 0; x < field[y].length; x++) {
        const value = field[y][x];
        this.drawRect(x, y, value, value > 0);
      }
    }
  }
}
