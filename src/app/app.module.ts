import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";

import { AppComponent } from "./app.component";
import { ApiService } from "./services/api.service";
import { RestaurantService } from "./services/restaurant.service";

@NgModule({
  declarations: [AppComponent],
  imports: [BrowserModule, FormsModule, HttpModule],
  providers: [ApiService, RestaurantService],
  bootstrap: [AppComponent]
})
export class AppModule {}
