import { Component, OnInit } from '@angular/core';
import { HttpHelperService } from '../http-helper.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private httpHelper: HttpHelperService) { }

  serachText: string = "";
  serachResult: any = {};
  showResults: boolean = false;
  readMore: boolean = false;
  showError: boolean = false;
  rating: number = 0;
  trendingMovies: any = [];
  ngOnInit(): void {
    this.loadTrendingMovies();
  }

  loadTrendingMovies() {
    this.trendingMovies = [];
    this.httpHelper.get("/trending").subscribe((resp: any) => {
      this.trendingMovies = resp;
    })
  }

  onEnter() {

    if (this.serachText && this.serachText.length > 0) {
      this.httpHelper.get("/movie?movieName=" + this.serachText)
        .subscribe((resp: any) => {
          this.serachResult = resp;
          this.showResults = this.serachResult.isMoviePresent;
          const element: any = document.getElementsByClassName('auto-height');
          if (this.serachResult.isMoviePresent) {
            element[0].style["margin-top"] = "2%";
            this.showError = false;
          } else {
            element[0].style["margin-top"] = "10%";
            this.showError = true;
          }

        });

    }

  }

  rate(r: number, movieId: number, imdbId: string) {
    this.rating = r;
    this.httpHelper.post("/rating", {
      rating: r,
      movieId: movieId,
      imdbId: imdbId
    }).subscribe((resp: any) => {
      console.log(resp);
      this.loadTrendingMovies();
    });
  }

}
