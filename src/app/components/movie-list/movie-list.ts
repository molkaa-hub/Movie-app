import { Component, inject, OnInit, signal } from '@angular/core';
import { MovieService } from '../../services/movie-service';
import { MovieCard } from '../movie-card/movie-card';
import { SearchBar } from '../search-bar/search-bar';

@Component({
  imports: [MovieCard, SearchBar],
  selector: 'app-movie-list',
  styleUrl: './movie-list.css',
  templateUrl: './movie-list.html',
})
export class MovieList implements OnInit {

  movieService = inject(MovieService);

  protected readonly loaded = signal(false);
  protected readonly failed = signal(false);

  ngOnInit(): void {
    this.movieService.getMovieList().subscribe({
      next: movies => {
        this.movieService.movieList.set(movies);
        this.loaded.set(true);
      },
      error: () => {
        this.failed.set(true);
        this.loaded.set(true);
      },
    });
  }
}
