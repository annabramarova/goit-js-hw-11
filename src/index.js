import GalleryFetcher from '../src/js/fetchImages';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

import Notiflix from 'notiflix';


const refs = {
    searchForm: document.querySelector('.search-form'),
    gallery: document.querySelector('.gallery'),
    end: document.querySelector('.end-line'),
};

const lightbox = new SimpleLightbox('.gallery a');
const galleryFetcher = new GalleryFetcher();

refs.searchForm.addEventListener('submit', onSearchClick);

function onSearchClick(e) {
    e.preventDefault();

    hideEndLine();
    cleanGallery();
    galleryFetcher.resetPages();

    const query = e.target.elements.searchQuery.value.trim();

    if (!query) {
        return;
    }

    galleryFetcher.currentQuery = query;

    galleryFetcher.fetchImages().then(response => {
        galleryFetcher.calculateTotalPagesAmount(response.data.totalHits);
        drawGallery(response.data);
        pageInfoHandler(response.data);
    });
    e.currentTarget.reset();
};

const pageInfoHandler = allCards => {
    const { totalHits } = allCards;

   if (galleryFetcher.totalPages <= 1) {
    hideEndLine();
  }

  if (galleryFetcher.totalPages > 1) {
    showEndLine();
  }

  if (
    galleryFetcher.page === galleryFetcher.totalPages &&
    galleryFetcher.totalPages !== 1
  ) {
    Notiflix.Notify.info(
      `We're sorry, but you've reached the end of search results.`
    );
    hideEndLine();
  }

  if (galleryFetcher.page === 1 && totalHits !== 0) {
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }

  if (totalHits === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
    return;
  }
};

function renderGallery (images) {
    const markup = images.hits.map(
        ({ webformatURL, likes, views, comments, tags, downloads, largeImageURL }) => `
    <div class="photo-card">
    <a href="${largeImageURL}"><img class="photo" src="${webformatURL}" alt="${tags}" loading="lazy" /></a>
    <div class="info">
      <p class="info-item">
        <b>Likes</b>
        <span class="info-item-api">${likes}</span>
      </p>
      <p class="info-item">
        <b>Views</b>
        <span class="info-item-api">${views}</span>
      </p>
      <p class="info-item">
        <b>Comments</b>
        <span class="info-item-api">${comments}</span>
      </p>
      <p class="info-item">
        <b>Downloads</b>
        <span class="info-item-api">${downloads}</span>
      </p>
    </div>
  </div>`
    );

    refs.gallery.insertAdjacentHTML('beforeend', markup.join(''));
    
    lightbox.refresh();
}

const smoothScroll = () => {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
};

const showEndLine = () => {
  refs.end.classList.remove('hidden');
};

const hideEndLine = () => {
  refs.end.classList.add('hidden');
};

const handleIntersect = e => {
  const isPageEnded = e[0].isIntersecting;

  if (isPageEnded) {
    galleryFetcher.currentPage += 1;

    galleryFetcher.fetchImages()
    .then(r => {
    renderGallery(r.data);
    pageInfoHandler(r.data);

    smoothScroll();
    })
        .catch(error => {
                console.error(error);
            })
  }
};

const intersectOptions = {
  threshold: 1.0,
};

let observer = new IntersectionObserver(handleIntersect, intersectOptions);

observer.observe(refs.end);

function cleanGallery() {
  refs.gallery.innerHTML = '';
}
