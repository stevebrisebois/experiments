import * as React from 'react';
import { ISquareTile } from './ISquareTile';
import SquareTilesManager from './SquareTilesManager';

export interface IBoardProps {
  cols: number;
  rows: number;
  size: number;
  tiles: ReadonlyArray<ISquareTile>;
  onAddTile: (tile: ISquareTile) => void;
  colorFunction: (tile: ISquareTile) => number;
}

export interface IBoardState {
  tempTile: ISquareTile | null;
}

export default class Board extends React.Component<IBoardProps, IBoardState> {

  private mouseManager: SquareTilesManager | null;

  public constructor(props: IBoardProps){
    super(props);

    this.previewTile = this.previewTile.bind(this);
    this.addTile = this.addTile.bind(this);

    this.state = { tempTile: null };
  }

  public componentDidMount(): void {
    this.mouseManager = new SquareTilesManager(this.previewTile, this.addTile);
    this.mouseManager.configure(this.props.cols, this.props.rows, this.props.size);
  }

  public componentWillReceiveProps(props: IBoardProps): void {
    this.mouseManager.configure(props.cols, props.rows, props.size);
  }

  public componentWillUnmount(): void {
    this.mouseManager = null;
  }

  public render(): JSX.Element {

    const { cols, rows, size, tiles, colorFunction } = this.props;
    const { tempTile } = this.state;

    const width = cols * size;
    const height = rows * size;

    const containerStyle = {
      userSelect: 'none' as 'none'
    };

    const backgroundStyle = {
      fill: "#FFFFFE",
      stroke: "#D4D4D4",
      strokeWidth: "2",
    };

    const lineStyle = {
      stroke: "#D4D4D4",
      strokeWidth: "1",
      pointerEvents: 'none' as 'none'
    };

    const tileStyle = {
      pointerEvents: 'none' as 'none'
    };

    const tileBackgroundStyle = (tile: ISquareTile) => {
      return {
        stroke: "#D4D4D4",
        strokeWidth: "1",
        fill: this.hexColor(colorFunction(tile))
      };
    };

    const vLinesI = Array.apply(null, {length: cols - 1}).map(Number.call, Number);
    const vLines = vLinesI.map((i: number) => {
      return (
        <line
          key={'vLine'+i}
          x1={(i + 1) * size}
          y1={0}
          x2={(i + 1) * size}
          y2={height}
          style={lineStyle} />
      );
    });

    const hLinesI = Array.apply(null, {length: rows - 1}).map(Number.call, Number);
    const hLines = hLinesI.map((i: number) => {
      return (
        <line
          key={'hLine'+i}
          x1={0}
          y1={(i + 1) * size}
          x2={width}
          y2={(i + 1) * size}
          style={lineStyle} />
      );
    });

    const allTiles = (tiles ? tiles : []).concat(tempTile ? [tempTile] : []);

    const translate = (x: number, y: number): string => {
      return 'translate('+x+' '+y+')';
    }

    const renderedTiles = allTiles.map((t: ISquareTile) => {
      return (
        <g
          key={t.id}
          style={tileStyle}
          transform={translate(t.col * size, t.row * size)}
        >
          <rect
            width={t.side * size}
            height={t.side * size}
            style={tileBackgroundStyle(t)}
          />
          <text
            x={t.side * size / 2}
            y={t.side * size / 2}
            textAnchor="middle"
            alignmentBaseline="central"
          >
            {t.side.toString()}
          </text>
        </g>
      );
    });

    return (
      <svg width={width}
           height={height}
           style={containerStyle}
      >
        <rect
          width={width}
          height={height}
          style={backgroundStyle}
          onMouseDown={(e) => this.mouseManager.beginCreate(e)}
        />
        {vLines}
        {hLines}
        {renderedTiles}
      </svg>
    );
  }

  private hexColor(color: number): string {
    var s = color.toString(16);
    while(s.length < 6){
      s = "0" + s;
    }
    return "#" + s;
  }

  /**
   *
   * @param tile
   */
  private previewTile(tile: ISquareTile): void {
    this.setState(Object.assign(this.state, { tempTile: tile }));
  }

  /**
   *
   * @param tile
   */
  private addTile(tile: ISquareTile): void {
    this.props.onAddTile(tile);
  }

}
