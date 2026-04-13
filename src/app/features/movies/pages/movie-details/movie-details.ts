import { Component, computed, inject, input, linkedSignal, signal, WritableSignal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { MoviesApi } from '../../services/movies-api';
import { DecimalPipe } from '@angular/common';
import { tap } from 'rxjs';
import { FavoritesApi } from '../../../../shared/services/favorites-api';

@Component({
  selector: 'app-movie-details',
  imports: [DecimalPipe],
  templateUrl: './movie-details.html',
  styleUrl: './movie-details.css',
})
export class MovieDetails {
  private readonly _moviesApi = inject(MoviesApi);
  private readonly _favoritesApi = inject(FavoritesApi);
  
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

  currentRating= signal<number| undefined>(undefined);

  startStatusFilled = computed(()=> {
    const rating = this.currentRating() ?? 0;
    const boolArray = [0, 1, 2, 3, 4].map((index) => index < rating);  
    return boolArray;
  });

  rateMovieResource = rxResource({
    params: () => {
      const rating = this.currentRating() ?? 0;
      if(rating > 0) return { id: +this.id(), rating }
      return undefined;
    },
    stream: ({params}) => this._moviesApi.rateMovie(params.id, params.rating).pipe(
      tap((movieUpdated)=> this.movieDetails.set(movieUpdated))
    ),
  });

  isMovieFavoriteResource = rxResource({
    params: () => this.id(),
    stream: ({params}) => this._favoritesApi.isMovieInFavorites(+params),
  });

  isFavorite = linkedSignal(() =>{
    const ERROR_ON_RESPONSE = !!this.isMovieFavoriteResource.error();
    
    if(ERROR_ON_RESPONSE) return false;

    return this.isMovieFavoriteResource.value() ?? false;
  });

  toggleFavoriteParams = signal<boolean | undefined >(undefined);

  toggleMovieFavoriteResource = rxResource({
    params: () => {
      const status = this.toggleFavoriteParams();
      if(status === undefined) return undefined;
      return { 
        currentFavoriteStatus: status, 
        movieId: +this.id(), 
      }
    },
    stream: ({params}) => this._favoritesApi.toggleMovieFavorite(params.currentFavoriteStatus, params.movieId)
    .pipe(
      tap(() => this.isFavorite.update((currentValue)=> !currentValue))
    ),
  });

  toggleFavorite() {
    this.toggleFavoriteParams.set(this.isFavorite());
  }

  updateRating(newRating: number){
    if(newRating === this.currentRating()){
      this.currentRating.set(0);
    } else {
      this.currentRating.set(newRating);
    }
  }

}
