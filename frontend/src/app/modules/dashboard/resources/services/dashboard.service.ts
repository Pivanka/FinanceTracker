import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Transaction } from '../models/transaction';
import { PaginatedList } from '../../../../shared/models/paginated-list';
import { ApiService } from '../../../../core/resources/services/api.service';
import { environment } from '../../../../../environments/environment';
import { Notification } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class DashboardService extends ApiService {
  constructor(
    http: HttpClient
  ) {
    super(http);
  }

  public getTransactions$(page: number, take: number, searchString: string, isDescending: boolean, days?: number)
    : Observable<PaginatedList<Transaction>> {
    const path = '/api/Transaction';

    let queryParams = new HttpParams()
      .append("searchString", searchString)
      .append("isDescending", isDescending)
      .append("page", page)
      .append("take", take)

    if (days)
      queryParams = queryParams.append("days", days)

    return this.http.get<PaginatedList<Transaction>>(`${environment.baseUrl}${path}`, {params: queryParams});
  }

  public getNotifications$(page: number, take: number, searchString: string, isDescending: boolean, days?: number)
    : Observable<PaginatedList<Notification>> {
      const path = "/api/Notification";

      let queryParams = new HttpParams()
        .append("searchString", searchString)
        .append("isDescending", isDescending)
        .append("page", page)
        .append("take", take)

      if (days)
        queryParams = queryParams.append("days", days)

      return this.http.get<PaginatedList<Notification>>(`${environment.baseUrl}${path}`, {params: queryParams});
  }

}
