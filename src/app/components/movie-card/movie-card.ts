import { DecimalPipe } from '@angular/common';
import { Component, computed, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faHeart, faStar, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { Movie } from '../../interfaces/movie';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [RouterLink, FontAwesomeModule, DecimalPipe],
  selector: 'app-movie-card',
  styleUrl: './movie-card.css',
  templateUrl: './movie-card.html',
})
export class MovieCard {
  readonly movie = input.required<Movie>();
  /** Affiche un bouton « Remove » explicite (utilisé dans la wish list). */
  readonly removable = input(false);

  protected readonly movieService = inject(MovieService);

  protected readonly faHeart = faHeart;
  protected readonly faStar = faStar;
  protected readonly faTrashCan = faTrashCan;

  protected readonly posterUrl = computed(() => this.movieService.imageUrl(this.movie().poster_path));
  protected readonly year = computed(() => this.movie().release_date?.slice(0, 4) ?? '');
  protected readonly inWishList = computed(() => this.movieService.isInWishList(this.movie().id));
  protected readonly heartLabel = computed(() =>
    this.inWishList() ? 'Remove from wish list' : 'Add to wish list'
  );

  protected toggle(): void {
    this.movieService.toggleWishList(this.movie());
  }

  protected remove(): void {
    this.movieService.removeFromWishList(this.movie().id);
  }
}
