export interface Genre {
    id: number;
    name: string;
}

export interface Movie {
    id: number;
    title: string;
    adult: boolean;
    backdrop_path: string | null;
    genre_ids: number[];
    // renvoyé uniquement par l'endpoint de détail (/movie/{id})
    genres?: Genre[];

    original_language: string;
    original_title: string;
    overview: string;
    popularity: number;
    poster_path: string | null;
    release_date: string;
    softcore: boolean;
    video: boolean;
    vote_average: number;
    vote_count: number;
}
