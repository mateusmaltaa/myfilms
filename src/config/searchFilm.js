const API_BASE = 'https://api.themoviedb.org/3/search/movie?api_key=3eefa9a0b6504326bb324ccf04c5d4ca&language=pt-BR&query=';

const API_BASE2 = '&page=1&include_adult=false';


export default {
    listMovies: async (film) => {
        const req = await fetch(`${API_BASE}${film}${API_BASE2}`);
        const json = await req.json();
        return json;
    }
}