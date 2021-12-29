import { Component, OnInit } from '@angular/core';
import { HoleState } from "./shared/hole-state";
import { holesCount } from "./shared/app.config";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public table: HoleState[][] = [];
  public isWon: boolean = false;
  public readonly holeState: typeof HoleState = HoleState;

  public ngOnInit(): void {
    this.initTable();
  }

  public check(i): void {
    this.table[this.table.length - 1][i] = HoleState.Checked;
    this.addNewRow();
  }

  public revertLastStep(): void {
    const previousRow: HoleState[] = this.table[this.table.length - 2];
    previousRow[previousRow.indexOf(HoleState.Checked)] = HoleState.Unknown;
    this.table.splice(this.table.length - 1, 1);
  }

  public reset(): void {
    this.table = [];
    this.initTable();
  }

  private initTable(): void {
    const row: HoleState[] = new Array(holesCount);
    row.fill(HoleState.Unknown);
    this.table.push(row);
  }

  private addNewRow(): void {
    const newRow: HoleState[] = this.table[this.table.length - 1].reduce((row, cell, index, lastRow) => {
      if ([lastRow[index - 1], lastRow[index + 1]].includes(HoleState.Unknown)) {
        row.push(HoleState.Unknown);
      } else {
        row.push(HoleState.Empty);
      }
      return row;
    }, []);
    this.isWon = this.verify(newRow);
    if (!this.isWon) {
      this.table.push(newRow);
    }
  }

  private verify(row: HoleState[]): boolean {
    const possibleCells: HoleState[] = row.filter((cell: HoleState) => cell === HoleState.Unknown);
    return possibleCells.length < 1;
  }
}
