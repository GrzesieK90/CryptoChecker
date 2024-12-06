import { ApiService } from '../service/api.service';
import { CommonModule, NgFor } from '@angular/common';
import {AfterViewInit, Component, ViewChild, OnInit} from '@angular/core';
import {MatPaginator, MatPaginatorModule} from '@angular/material/paginator';
import {MatSort, MatSortModule} from '@angular/material/sort';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { Router } from '@angular/router';
import { CurrencyService } from '../service/currency.service';

@Component({
  selector: 'app-coin-list',
  standalone: true,
  imports: [CommonModule, NgFor, MatFormFieldModule, MatInputModule, MatTableModule, MatSortModule, MatPaginatorModule],
  templateUrl: './coin-list.component.html',
  styleUrl: './coin-list.component.scss'
})
export class CoinListComponent implements OnInit {

  bannerData:any=[];
  currency : string = "EUR"
  dataSource!: MatTableDataSource<any>;
  displayedColumns:string[] = ['symbol', 'name', 'low_24h', 'high_24h', 'current_price', 'price_change_percentage_24h', 'market_cap'];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api :ApiService, private router : Router, private CurrencyService : CurrencyService) {}
  ngOnInit(): void {
    this.getAllData();
    this.getBannerData();
    this.CurrencyService.getCurrency()
    .subscribe(val=>{
      this.currency = val;
      this.getAllData();
      this.getBannerData();
    })
  }
  getBannerData(){
    this.api.getTrendingCurrency(this.currency)
    .subscribe(res=>{
      console.log(res)
      this.bannerData = res
    })
  }
  getAllData(){
    this.api.getCurrencyData(this.currency)
    .subscribe(res=>{
      console.log(res);
      this.dataSource = new MatTableDataSource(res);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    })
  }
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
  gotoDetails(row:any){
    this.router.navigate(['coin-detail', row.id])
  }
}
