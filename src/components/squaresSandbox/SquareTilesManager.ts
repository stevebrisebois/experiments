import { ISquareTile } from './ISquareTile';
import { calculateMousePos } from '../../utils/MouseUtils';

export default class SquareTilesManager {

  private onPreviewTile: (tile: ISquareTile | null)=> void;
  private onAddTile: (tile: ISquareTile) => void;

  public constructor(
      onPreviewTile: (tile: ISquareTile | null) => void,
      onAddTile: (tile: ISquareTile) => void){

    this.onPreviewTile = onPreviewTile;
    this.onAddTile = onAddTile;

    this.onUpdate = this.onUpdate.bind(this);
    this.onCommit = this.onCommit.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  private cols: number;
  private rows: number;
  private size: number;

  public configure(cols: number, rows: number, size: number): void {
    this.cols = cols;
    this.rows = rows;
    this.size = size;
  }

  private target: HTMLElement;
  private row0: number;
  private col0: number;
  private row: number;
  private col: number;
  private side: number;

  public beginCreate(event: any): void {
    event.preventDefault();

    this.target = event.target;

    var pos: { col: number, row: number } = this.getPosition(event);

    this.col0 = pos.col;
    this.row0 = pos.row;
    this.col = pos.col;
    this.row = pos.row;
    this.side = 1;

    this.onPreviewTile(this.getTempTile());
    this.toggleWindowListeners(true);
  }

  private onUpdate(event: any): void {
    event.preventDefault();

    var pos: { col: number, row: number } = this.getPosition(event);

    var colSpan = Math.abs(this.col0 - pos.col);
    var rowSpan = Math.abs(this.row0 - pos.row);

    this.col = Math.min(this.col0, pos.col);
    this.row = Math.min(this.row0, pos.row);

    var side = Math.min(colSpan, rowSpan) + 1;

    var overflowCols: number = Math.max(0, this.col + side - this.cols);
    var overflowRows: number = Math.max(0, this.row + side - this.rows);

    this.side = side - Math.max(overflowCols, overflowRows);

    var tile = this.getTempTile();
    this.onPreviewTile(tile);
  }

  private onCommit(event: any): void {
    this.toggleWindowListeners(false);
    this.onAddTile(this.getTempTile());
    this.onPreviewTile(null);
  }

  private onCancel(event: any): void {
    this.toggleWindowListeners(false);
    this.onPreviewTile(null);
  }

  private toggleWindowListeners(value: boolean): void {
    window.document.removeEventListener("mousemove", this.onUpdate);
    window.document.removeEventListener("mouseup", this.onCommit);
    window.document.removeEventListener("mouseleave", this.onCancel);

    if (value) {
      window.document.addEventListener("mousemove", this.onUpdate);
      window.document.addEventListener("mouseup", this.onCommit);
      window.document.addEventListener("mouseleave", this.onCancel);
    }
  }

  private getPosition(event: any): {col: number, row: number} {
    var mouseX: number;
    var mouseY: number;

    if (this.target === event.target) {
      var rect = event.target.getBoundingClientRect();
      mouseX = event.clientX - rect.left; //x position within the element.
      mouseY = event.clientY - rect.top;  //y position within the element.
    } else {
      var mousePos = calculateMousePos(this.target, event);
      mouseX = mousePos.x;
      mouseY = mousePos.y;
    }

    var col = Math.floor(mouseX / this.size);
    var row = Math.floor(mouseY / this.size);

    col = Math.max(col, 0);
    row = Math.max(row, 0);

    col = Math.min(col, this.cols - 1);
    row = Math.min(row, this.rows - 1);

    return { col, row };
  }

  private getTempTile(): ISquareTile {
    return {
      id: Math.random(),
      col: this.col,
      row: this.row,
      side: this.side
    };
  }

}
