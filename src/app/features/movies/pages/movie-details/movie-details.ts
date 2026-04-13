import { Component, computed, inject, input, linkedSignal, signal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MoviesApi } from '../../services/movies-api';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-movie-details',
  imports: [DecimalPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {
  private readonly _moviesApi = inject(MoviesApi);
  
  readonly BASE_URL = "http://localhost:3000";

  id = input.required<string>();

  movieDetailsResource = rxResource({
    params: () => this.id(),
    stream: ({params}) => this._moviesApi.getMovieDetails(+params),
  });

  movieDetails = linkedSignal(()=> {
    const ERROR_ON_RESPONSE = !!this.movieDetailsResource.error();
    
    if(ERROR_ON_RESPONSE) return undefined;

    return this.movieDetailsResource.value();
  })
  //////////////////////////////////////////////////

  isFavorite = signal(false);
  currentRating= signal<number| undefined>(undefined);

  startStatusFilled = computed(()=> {
    const rating = this.currentRating() ?? 0;
    const boolArray = [0, 1, 2, 3, 4].map((index) => index < rating);  
    return boolArray;
  });

  toggleFavorite() {
    this.isFavorite.update((value) => !value);
    console.log(`Filme agora é favorito: ${this.isFavorite()}`);
  }

  updateRating(newRating: number){
    if(newRating === this.currentRating()){
      this.currentRating.set(0);
    } else {
      this.currentRating.set(newRating);
    }
  }

}
