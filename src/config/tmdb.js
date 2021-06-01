const API_KEY = '3eefa9a0b6504326bb324ccf04c5d4ca';

const API_BASE = 'https://api.themoviedb.org/3';


/*
 - originais da netflix
 - recomendados (trending)
 - em alta (top rated)
 - ação
 - comedia
 - romance

*/


const basicFetch = async (endpoint) => {
    const req = await fetch(`${API_BASE}${endpoint}`);
    const json = await req.json();
    return json;
}

export default {
    getHomeList: async () => {
        return [
            {
                slug: 'toprated',
                title: 'Em Alta',
                items: await basicFetch(`/movie/top_rated?language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug: 'action',
                title: 'Ação',
                items: await basicFetch(`/discover/movie?with_genres=28&language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug: 'comedy',
                title: 'Comédia',
                items: await basicFetch(`/discover/movie?with_genres=35&language=pt-BR&api_key=${API_KEY}`)
            },
            {
                slug: 'romance',
                title: 'Romance',
                items: await basicFetch(`/discover/movie?with_genres=10749&language=pt-BR&api_key=${API_KEY}`)
            }
        ]
    },
    getFilmes: async (film) => {
        const items = await basicFetch(`/movie/${film}?api_key=${API_KEY}&language=pt-BR`);
        return items;
    }
}
