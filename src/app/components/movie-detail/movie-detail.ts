import { DatePipe, DecimalPipe } from '@angular/common';
import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faArrowLeft, faHeart, faTrashCan } from '@fortawesome/free-solid-svg-icons';
import { catchError, EMPTY, switchMap } from 'rxjs';
import { MovieService } from '../../services/movie-service';

@Component({
  imports: [RouterLink, FontAwesomeModule, DatePipe, DecimalPipe],
  selector: 'app-movie-detail',
  styleUrl: './movie-detail.css',
  templateUrl: './movie-detail.html',
})
export class MovieDetail implements OnInit {

  private readonly route = inject(ActivatedRoute);
  private readonly destroyRef = inject(DestroyRef);
  protected readonly movieService = inject(MovieService);

  protected readonly faArrowLeft = faArrowLeft;
  protected readonly faHeart = faHeart;
  protected readonly faTrashCan = faTrashCan;

  protected readonly failed = signal(false);

  protected readonly movie = this.movieService.selectedMovie;
  protected readonly posterUrl = computed(() => this.movieService.imageUrl(this.movie()?.poster_path));
  protected readonly backdropUrl = computed(() => this.movieService.imageUrl(this.movie()?.backdrop_path, 'w1280'));
  protected readonly inWishList = computed(() => {
    const movie = this.movie();
    return !!movie && this.movieService.isInWishList(movie.id);
  });
  protected readonly languageName = computed(() => {
    const code = this.movie()?.original_language ?? '';
    try {
      return new Intl.DisplayNames(['en'], { type: 'language' }).of(code) ?? code;
    } catch {
      return code;
    }
  });

  ngOnInit(): void {
    this.route.paramMap.pipe(
      switchMap(params => {
        this.failed.set(false);
        this.movieService.selectedMovie.set(null); // évite d'afficher le film précédent
        const id = Number(params.get('id'));
        return this.movieService.getMovieById(id).pipe(
          catchError(() => {
            this.failed.set(true);
            return EMPTY;
          })
        );
      }),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(movie => this.movieService.selectedMovie.set(movie));
  }

  toggleWishList(): void {
    const movie = this.movie();
    if (movie) {
      this.movieService.toggleWishList(movie);
    }
  }
}
