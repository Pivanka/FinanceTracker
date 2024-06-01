import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../../../core/resources/services/api.service';
import { PaginatedList } from '../../../../shared/models/paginated-list';
import { QueryParams } from '../../../../shared/models/query-params';
import { Transaction } from '../../../dashboard/resources/models/transaction';
import { environment } from '../../../../../environments/environment';
import { UploadTransaction } from '../models/upload-transaction';

@Injectable({
  providedIn: 'root'
})
export class TransactionsService extends ApiService {

  constructor(http: HttpClient) {
    super(http);
  }

  getPaginatedTransactions(params: QueryParams): Observable<PaginatedList<Transaction>> {
    const path = '/api/transaction/paginated';
    return this.http.post<PaginatedList<Transaction>>(`${environment.baseUrl}${path}`, params);
  }

  getHttpParams(params: QueryParams, withOutPagination:boolean = false): HttpParams {
    var queryParams = new HttpParams()

    if (!withOutPagination){
      queryParams = queryParams
      .append('pageIndex', params.pageIndex)
      .append('pageSize', params.pageSize)
    };

    if (!!params.search) {
      queryParams = queryParams.append('search', params.search);
    }

    params.sort.forEach(sort => {
      queryParams = queryParams
        .append('sort', sort.field + ' ' + sort.direction)
    })

    params.filter.forEach(filter => {
      queryParams = queryParams.append('filter', filter.key + ' ' + filter.filterType + ' ' + filter.value);
    });

    return queryParams;
  }

  upload(path: string, formData: { fileContent: string }, params?: any) {
    return this.http.post<UploadTransaction[]>(`${environment.baseUrl}${path}`, formData, { params });
  }
}
