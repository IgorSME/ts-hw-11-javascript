
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import cardsMarkup from "./js/template";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import getRefs from "./js/refs.js";
import { fetchImages } from "./js/api-service";

const refs = getRefs();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMore.addEventListener('click', onLoadMore)

let page = 1;
let formInput = "";
const imageOnPage = 40;
const lightbox = new SimpleLightbox('.gallery a');

async function onSearch(e) {
    try {
        e.preventDefault();
        page = 1;
        
        formInput = e.currentTarget.elements.searchQuery.value;
        if (!formInput) {
            Notify.failure("Sorry, empty search. Please try again.");
            return
        }
        const imageCollection = await fetchImages(formInput, page);
       
        refs.gallery.innerHTML = "";
        imageMarkup(imageCollection.hits);
        if (!imageCollection.total) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        return
        }
       
        if (refs.loadMore.classList.contains('is-hidden')&&page <= imageCollection.totalHits/imageOnPage) {
            refs.loadMore.classList.toggle('is-hidden');
        }
        Notify.success(`Hooray! We found ${imageCollection.totalHits} images.`);
        e.target.reset();
    
    } catch (error) {
        error => console.log(error);
    }  
}
async function onLoadMore() {
    try {
        refs.loadMore.classList.toggle('is-hidden');
        page += 1;
        const loadMoreImages = await fetchImages(formInput, page);
        refs.loadMore.classList.toggle('is-hidden');
        imageMarkup(loadMoreImages.hits);
        smoothScroll();

        if (page >= loadMoreImages.totalHits/imageOnPage) {
            refs.loadMore.classList.toggle('is-hidden');
            Notify.info("We're sorry, but you've reached the end of search results.")
        }

    } catch (error) {
        error => console.log(error);
    }
}

// async function fetchImages(search, page) {
//     const res = await axios(`https://pixabay.com/api/?key=28071781-459ddb4c5fc455b50beadddbb&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${imageOnPage}&page=${page}`)

//     return res.data;
// }

function imageMarkup(arr) {
    refs.gallery.insertAdjacentHTML('beforeend', cardsMarkup(arr));
    lightbox.refresh();
}

function smoothScroll() {
    const { height: cardHeight } = document
  .querySelector(".gallery")
  .firstElementChild.getBoundingClientRect();

window.scrollBy({
  top: cardHeight * 2,
  behavior: "smooth",
});
}