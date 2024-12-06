import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatTableModule } from '@angular/material/table';
import { CurrencyService } from './service/currency.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatSelectModule, MatFormFieldModule, FormsModule, MatInputModule, HttpClientModule, MatTableModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  template:`
  <div>
    <canvas baseChart
            [data]="lineChartData"
            [labels]="lineChartOptions"
            [type]="lineChartType"
          >
    </canvas>
  </div>
`
})
export class AppComponent {
  selectedCurrency : string = "EUR";
  constructor(private CurrencyService : CurrencyService){

  }
  sendCurrency(event:string){
    console.log(event);
    this.CurrencyService.setCurrency(event)
  }
}