import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Movie } from '../interfaces/movie';
import { MovieResponse } from '../interfaces/movie-response';

const WISHLIST_KEY = 'wishList';

export type ImageSize = 'w342' | 'w500' | 'w780' | 'w1280';

@Injectable({
    providedIn: 'root'
})
export class MovieService {

    private readonly http = inject(HttpClient);
    private readonly url = environment.url_api;
    private readonly key = environment.api_key;
    private readonly movieUrl = environment.url_movie_api.replace(/\/$/, '');

    public movieList = signal<Movie[]>([]);
    public selectedMovie = signal<Movie | null>(null);

    // La wish list est relue depuis le localStorage au démarrage :
    // sans cela elle serait vide après chaque rafraîchissement de la page.
    public wishList = signal<Movie[]>(this.loadWishList());
    public readonly wishCount = computed(() => this.wishList().length);

    getMovieList(): Observable<Movie[]> {
        return this.http
            .get<MovieResponse>(`${this.url}?api_key=${this.key}`)
            .pipe(
                map(response => response.results),
                shareReplay({ bufferSize: 1, refCount: false })
            );
    }

    getMovieById(id: number): Observable<Movie> {
        return this.http.get<Movie>(`${this.movieUrl}/${id}?api_key=${this.key}`);
    }

    imageUrl(path: string | null | undefined, size: ImageSize = 'w500'): string | null {
        return path ? `https://image.tmdb.org/t/p/${size}${path}` : null;
    }

    isInWishList(id: number): boolean {
        return this.wishList().some(movie => movie.id === id);
    }

    addToWishList(movie: Movie): void {
        if (this.isInWishList(movie.id)) {
            return; // pas de doublon
        }
        this.saveWishList([...this.wishList(), movie]);
    }

    removeFromWishList(id: number): void {
        this.saveWishList(this.wishList().filter(movie => movie.id !== id));
    }

    toggleWishList(movie: Movie): void {
        if (this.isInWishList(movie.id)) {
            this.removeFromWishList(movie.id);
        } else {
            this.addToWishList(movie);
        }
    }

    private saveWishList(list: Movie[]): void {
        this.wishList.set(list);
        try {
            localStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
        } catch {
            // stockage indisponible (mode privé, quota) : la liste reste en mémoire
        }
    }

    private loadWishList(): Movie[] {
        try {
            const raw = localStorage.getItem(WISHLIST_KEY);
            const parsed: unknown = raw ? JSON.parse(raw) : [];
            return Array.isArray(parsed) ? (parsed as Movie[]) : [];
        } catch {
            return [];
        }
    }
}
