import { Controller } from "./controller";
import "./style.css";
import { Tetris } from "./tetris";
import { View } from "./view";

const view = new View();

const tetris = new Tetris(350, view.drawer.bind(view));
tetris.loop();

const controller = new Controller({
  onUp: tetris.rotate.bind(tetris),
  onDown: tetris.moveDown.bind(tetris),
  onLeft: tetris.moveLeft.bind(tetris),
  onRight: tetris.moveRight.bind(tetris),
});
