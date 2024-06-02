import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { SimpleChart } from '../resources/models/simple-chart';
import { Chart } from 'angular-highcharts';
import { TransactionType } from '../../dashboard/resources/models/transaction';

@Component({
  selector: 'app-simple-chart-example',
  templateUrl: './simple-chart-example.component.html',
  styleUrls: ['./simple-chart-example.component.scss']
})
export class SimpleChartExampleComponent implements OnInit, OnChanges {

  @Input() simpleChart!: SimpleChart;
  @Input() type!: TransactionType;
  percentageData: { [key: string]: {y:number, color:string, amount:number} } = {};
  totalAmount: number = 0;
  dataPoints: { y: number, name: string, color: string, amount: number }[] = [];
  chartOptions!: any;
  pieChart!: Chart;

  constructor() { }

  ngOnInit() {
    this.updateChartData();
  }

  ngOnChanges() {
    console.log('recalculate')
    this.updateChartData();
  }

  updateChartData(): void {
    this.totalAmount = this.simpleChart.values.reduce((acc, curr) => acc + curr.amount, 0);
    this.calculatePercentages();
    this.createDataPointsArray();
    let type = this.type === TransactionType.Income ? '+' : '-';
    let color = this.type === TransactionType.Expense ? '#ED5252' : '#35995F';
    this.pieChart=new Chart({
        chart: {
          type: 'pie',
          plotShadow: false,

        },

        credits: {
          enabled: false,
        },

        plotOptions: {
          pie: {
            innerSize: '90%',
            borderWidth: 10,
            borderColor: '',
            slicedOffset: 10,
            dataLabels: {
              connectorWidth: 0,
            },
          },
        },

        title: {
          verticalAlign: 'middle',
          floating: true,
          text: type + ` ${Math.round(this.totalAmount)} ${this.simpleChart.currency}`,
          style: {
              color: color,
          }
        },

        legend: {
          enabled: false,
        },

        series: [
          {
            type: 'pie',
            data: this.dataPoints,
          },
        ],

        tooltip: {
          formatter() {
            return `${this.key} - ${this.y}%`
          }
        }
      })
  }

  calculatePercentages(): void {
    this.simpleChart.values.forEach(value => {
      let percentage = (value.amount / this.totalAmount) * 100;

      this.percentageData[value.categoryTitle] = { y:Math.round(percentage), color:value.color, amount:value.amount };
    });
  }

  createDataPointsArray(): void {
    this.dataPoints = Object.keys(this.percentageData).map(key => ({
      y: this.percentageData[key].y,
      name: key,
      color: this.percentageData[key].color,
      amount: this.percentageData[key].amount
    }));
  }
}
