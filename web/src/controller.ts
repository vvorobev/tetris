type ControllerOptions = {
  onUp?: () => void;
  onDown?: () => void;
  onLeft?: () => void;
  onRight?: () => void;
};

export class Controller {
  constructor(private readonly optios: ControllerOptions = {}) {
    document.addEventListener("keydown", this.handleKeydown.bind(this));
  }
  private handleKeydown(event: KeyboardEvent) {
    console.log("---event", event);
    switch (event.key) {
      case "ArrowUp":
        this.optios.onUp?.();
        break;
      case "ArrowDown":
        this.optios.onDown?.();
        break;
      case "ArrowLeft":
        this.optios.onLeft?.();
        break;
      case "ArrowRight":
        this.optios.onRight?.();
        break;
      default:
        break;
    }
  }
}
