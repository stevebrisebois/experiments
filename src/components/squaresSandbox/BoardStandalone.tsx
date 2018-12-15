import * as React from 'react';
import Board from './Board';
import { ISquareTile } from './ISquareTile';

export interface IBoardStandaloneProps {
  cols: number;
  rows: number;
  size: number;
}

export interface IBoardStandaloneState {
  tiles: ReadonlyArray<ISquareTile>;
}

export default class BoardStandalone extends React.Component<IBoardStandaloneProps, IBoardStandaloneState> {

  private colors = [
    0x0193d1,
    0xee659a,
    0x863363,
    0x7fc79f,
    0xf7991d,
    0xa50a26,
    0x63b947,
    0xf7ab85,
    0x01919d,
    0x6d4c9c,
  ];

  public constructor(props: IBoardStandaloneProps) {
    super(props);
    this.state = {
      tiles: [],
    };
    this.addTile = this.addTile.bind(this);
    this.colorArea = this.colorArea.bind(this);
  }

  private colorArea(tile: ISquareTile): number {
    if(tile.side == 1)return 0xFFFFFF;
    return this.colors[(tile.side - 2) % this.colors.length];
  }

  private addTile(newTile: ISquareTile): void {
    var tiles = this.state.tiles.filter((tile) => {
      return !this.tilesIntersects(tile, newTile);
    });

    this.setState(Object.assign(this.state, { tiles: tiles.concat([newTile]) }));
  }

  private tilesIntersects(t1: ISquareTile, t2: ISquareTile): boolean {
    var r1 = this.tileToRect(t1);
    var r2 = this.tileToRect(t2);

    return !(r2.left > r1.right ||
            r2.right < r1.left ||
            r2.top > r1.bottom ||
            r2.bottom < r1.top);
  }

  private tileToRect(tile: ISquareTile): { top: number, left: number, bottom: number, right: number } {
    return {
      left: tile.col,
      right: tile.col + tile.side - 1,
      top: tile.row,
      bottom: tile.row + tile.side - 1
    };
  }

  public render(): JSX.Element {

    const { cols, rows, size } = this.props;

    const { tiles } = this.state;

    return (
      <div>
        <Board
          cols={cols}
          rows={rows}
          size={size}
          tiles={tiles}
          onAddTile={this.addTile}
          colorFunction={this.colorArea}
        />
        <p>
          {tiles.length}
        </p>
      </div>
    );
  }

}
