import { Component, OnInit } from "@angular/core";
import { Restaurant } from "./models/restaurant";
import { RestaurantService } from "./services/restaurant.service";
import { Subject } from "rxjs";
import {
  map,
  takeUntil,
  tap,
  debounceTime,
  distinctUntilChanged
} from "rxjs/operators";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  title = "Welcome to Restaurant Search Engine";

  cache = {
    restaurants: [],
    selectedRestaurant: []
  };
  config: any;
  restaurants: Restaurant[] = [];
  search: Subject<string> = new Subject<string>();
  selectedRestaurant: Restaurant = new Restaurant();
  loadingFollowers: boolean = false;

  constructor(private restaurantService: RestaurantService) {
    this.config = {
      currentPage: 1,
      itemsPerPage: 25
    };
    this.search
      .pipe(debounceTime(200))
      .pipe(distinctUntilChanged())
      .subscribe(searchTerm => {
        // call to restaurant service and search by query

        this.restaurantService.search(searchTerm).subscribe(res => {
          this.restaurants = res["restaurants"] as Restaurant[];
        });
      });
  }

  ngOnInit() {
    this.restaurantService.getRestaurants().subscribe(
      res => {
        this.cache.restaurants = res; // store cached for next time.

        this.restaurants = res["restaurants"];
      },
      error => {
        console.log(error); // for development only.
      }
    );
  }

  /**
   * On restaurant typing key to search.
   */
  onSearch(q: string) {
    if (q !== "") {
      this.search.next(q);
    } else {
      //if empty search box we restore first restaurants
      //this.restaurants = this.cache.restaurants;
    }
  }

  go(s: string) {
    if (s == "home") {
      this.selectedRestaurant = new Restaurant();
      this.restaurantService.getRestaurants().subscribe(
        res => {
          this.cache.restaurants = res; // store cached for next time.

          this.restaurants = res["restaurants"];
        },
        error => {
          console.log(error); // for development only.
        }
      );
    }
  }

  viewRestaurant(restaurant: Restaurant) {
    this.selectedRestaurant = restaurant;

    let restaurantInCache: Restaurant = this.findRestaurantInCache(restaurant);
    // let find if existing in cache we return and no longer call to api again
    if (restaurantInCache) {
      this.selectedRestaurant = restaurantInCache;
    } else {
      this.restaurantService.getRestaurantInformation(restaurant.id).subscribe(
        res => {
          this.cacheSelectRestaurant(this.selectedRestaurant);
        },
        err => {
          console.log(err);
        }
      );
    }
  }

  /**
   * we storage selected restaurant and dont again to api. just simply function for now.
   * */

  cacheSelectRestaurant(restaurant: Restaurant) {
    if (!this.findRestaurantInCache(restaurant)) {
      this.cache.selectedRestaurant.push(restaurant);
    }
  }

  /**
   * Find restaurant if exist in cache we return restaurant object
   * @param restaurant
   * @returns {boolean}
   */
  findRestaurantInCache(restaurant: Restaurant): Restaurant {
    for (var i = 0; i < this.cache.selectedRestaurant.length; i++) {
      if (this.cache.selectedRestaurant[i].id == restaurant.id) {
        return this.cache.selectedRestaurant[i];
      }
    }

    return null;
  }
}
