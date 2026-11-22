import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MovieService } from '../../services/movie-service';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  imports: [MovieCard, RouterLink],
  selector: 'app-wish-list',
  styleUrl: './wish-list.css',
  templateUrl: './wish-list.html',
})
export class WishList {
  movieService = inject(MovieService);
}
