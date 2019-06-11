import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Restaurant } from "../models/restaurant";
import { ApiService } from "./api.service";
import {
  map,
  takeUntil,
  tap,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";

@Injectable()
export class RestaurantService {
  constructor(private api: ApiService) {}

  getRestaurants(filter?: string): Observable<Restaurant[]> {
    let endPoint = "/restaurants?country=CA";

    return this.api.get(endPoint).pipe(map(res => res.json() as Restaurant[]));
  }

  search(q: string): Observable<any> {
    let endPoint = "/restaurants?city=" + q;
    return this.api.get(endPoint).pipe(map(res => res.json()));
  }

  getRestaurantInformation(restaurant: string): Observable<any> {
    let endPoint = "/restaurants/" + restaurant;
    return this.api.get(endPoint).pipe(map(res => res.json()));
  }
}
