import axios from 'axios';

export default class ApiService {
   constructor() {
      this.perPage = 40;
      this.page = 1;
      this.search = '';
   }

   async getData() {
      return await axios
         .get(
            `https://pixabay.com/api/?key=${process.env.API_KEY}&q=${this.search}&image_type=photo&orientation=horizontal&safesearch=true&page=${this.page}&per_page=40`
         )
         .then(response => {
            this.incrementPage();
            return response.data;
         })
         .catch(e => {
            console.error(e);
            console.error('Sorry, there are no images matching your search query. Please try again.');
         });
   }

   incrementPage() {
      this.page += 1;
   }

   resetPage() {
      this.page = 1;
   }
}