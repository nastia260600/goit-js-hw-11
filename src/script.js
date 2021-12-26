import './sass/main.scss';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import Notiflix from 'notiflix';
import ApiService from './apiService.js';
import dotenv from 'dotenv';

dotenv.config();

const apiService = new ApiService();

const lightBox = new SimpleLightbox('.photo__card a');
const searchForm = document.querySelector('.search__form');
const imgGallery = document.querySelector('.gallery');
const loadBtn = document.querySelector('.load__btn');

searchForm.addEventListener('submit', onSearch);
loadBtn.addEventListener('click', loadMore);

function btnHide(data) {
   const totalHits = data.totalHits;
   const totalPages = Math.ceil(totalHits / apiService.perPage);

   if (apiService.page > totalPages) {
      loadBtn.classList.remove('show');

      window.onscroll = () => {
         if (window.innerHeight + window.pageYOffset >= document.body.offsetHeight) {
            Notiflix.Notify.info('You\'ve reached the end of search results.');
         }
      };
   }
}

function showMessage(data) {
   const totalHits = data.totalHits;

   if (totalHits > 40) {
      loadBtn.classList.add('show');
   }

   if (totalHits > 0) {
      Notiflix.Notify.success(`We found ${totalHits} images.`);
   } else {
      Notiflix.Notify.failure(
         'Sorry, there are no images matching your search request. Please try again.',
      );
      loadBtn.classList.remove('show');
   }
}

function onSearch(e) {
   e.preventDefault();

   loadBtn.classList.remove('show');
   apiService.resetPage();

   apiService.search = e.target.elements.search.value;

   const request = apiService.search.trim();

   if (request.length === 0) {
      Notiflix.Notify.failure('Please enter your request');
   } else {
      apiService
         .getData()
         .then(collection => {
            showMessage(collection);
            return collection;
         })
         .then(renderData);
   }

   emptyGallery();
}

function renderData(data) {
   const hits = data.hits;

   const articles = hits
      .map(el => {
         return `<div class='photo__card'>
              <a href='${el.largeImageURL}'>
                <img src='${el.webformatURL}' alt='${el.tags}' loading='lazy' />
                <div class='info'>
                  <p class='info__item'>
                    Likes
                    <b>${el.likes}</b>
                  </p>
                  <p class='info__item'>
                    Views
                    <b>${el.views}</b>
                  </p>
                  <p class='info__item'>
                    Comments
                    <b>${el.comments}</b>
                  </p>
                  <p class='info__item'>
                    Downloads
                    <b>${el.downloads}</b>
                  </p>
                </div>
                </a>
              </div>`;
      }).join('');
   imgGallery.insertAdjacentHTML('beforeend', articles);
   lightBox.refresh();
}

function emptyGallery() {
   imgGallery.innerHTML = '';
}

function loadMore() {
   apiService
      .getData()
      .then(data => {
         btnHide(data);
         return data;
      })
      .then(renderData);
}
