import { Component, OnInit, ViewChild} from '@angular/core';
import { ApiService } from '../service/api.service';
import { ActivatedRoute } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ChartConfiguration , ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import { CurrencyService } from './../service/currency.service';
@Component({
  selector: 'app-coin-detail',
  standalone: true,
  imports: [CurrencyPipe, BaseChartDirective],
  templateUrl: './coin-detail.component.html',
  styleUrl: './coin-detail.component.scss'
})
export class CoinDetailComponent implements OnInit{

  coinData : any;
  coinId !: string;
  days : number = 1;
  currency : string = "EUR";

  public lineChartData: ChartConfiguration['data'] = {
    datasets: [
      {
      data: [],
      label: 'Price Trends',
      backgroundColor: 'rgba(148,159,177,0.2)',
      borderColor: '#960000',
      pointBackgroundColor: '#960000',
      pointBorderColor: '#960000',
      pointHoverBackgroundColor: '#960000',
      pointHoverBorderColor: '#960000',
    }
  ],
  labels: []
  }

  public lineChartOptions: ChartConfiguration['options'] = {
    elements:{
      point:{
        radius:1
      }
    },
    plugins: {
      legend: { display:true },
    }
  };

  public lineChartType: ChartType = 'line';
  @ViewChild(BaseChartDirective) myLineChart !: BaseChartDirective

  constructor(private api : ApiService, private activatedRoute : ActivatedRoute, private CurrencyService : CurrencyService){ }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(val=>{
      this.coinId = val['id'];
    })
    this.getCoinData();
    this.getGraphData(this.days);
    this.CurrencyService.getCurrency()
    .subscribe(val=>{
      this.currency = val;
      this.getGraphData(this.days);
      this.getCoinData();
    })
  }
  getCoinData(){
    this.api.getCurrencyById(this.coinId)
    .subscribe(res=>{
      if(this.currency === "USD"){
        res.market_data.current_price.eur = res.market_data.current_price.usd;
        res.market_data.market_cap.eur = res.market_data.market_cap.usd;
      } else if(this.currency === "GBP"){
        res.market_data.current_price.eur = res.market_data.current_price.gbp;
        res.market_data.market_cap.eur = res.market_data.market_cap.gbp;
      } else if(this.currency === "PLN"){
        res.market_data.current_price.eur = res.market_data.current_price.pln;
        res.market_data.market_cap.eur = res.market_data.market_cap.pln;
      }
      res.market_data.current_price.eur = res.market_data.current_price.eur;
      res.market_data.market_cap.eur = res.market_data.market_cap.eur;
      this.coinData = res;
    })
  }
  getGraphData(days:number){
    this.days=days
    this.api.getGraphicalCurrencyData(this.coinId, this.currency, this.days)
    .subscribe(res=>{
      setTimeout(()=>{
        this.myLineChart.chart?.update();
      },200)
      console.log(res)
      this.lineChartData.datasets[0].data = res.prices.map((a:any)=>{
        return a[1]
      });
      this.lineChartData.labels = res.prices.map((a: any) => {
        let date = new Date(a[0]);
        let hours = String(date.getHours()).padStart(2, '0');
        let minutes = String(date.getMinutes()).padStart(2, '0');
        let formattedTime = `${hours}:${minutes}`
      
        return this.days === 1 
          ? `${formattedTime}H`
          : date.toLocaleDateString();
      })
    })
  }
}
