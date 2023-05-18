
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import cardsMarkup from "./ts/template";
import SimpleLightbox from "simplelightbox";
import "simplelightbox/dist/simple-lightbox.min.css";
import getRefs from "./ts/refs.js";
import { fetchImages } from "./ts/api-service";
import { ICard } from './ts/appTypes';

const refs = getRefs();

if(refs.searchForm) {
    refs.searchForm.addEventListener('submit', onSearch)
}
if(refs.loadMore){
    refs.loadMore.addEventListener('click', onLoadMore)
}

let page = 1;
let formInput = "";
const imageOnPage = 40;
const lightbox = new SimpleLightbox('.gallery a');

async function onSearch(e:Event) {
    try {
        e.preventDefault();
        page = 1;
        
        const target = e.currentTarget as HTMLFormElement;
        const searchQueryInput = target.querySelector('#searchQuery') as HTMLInputElement;
        formInput = searchQueryInput.value;
        if (!formInput) {
            Notify.failure("Sorry, empty search. Please try again.");
            return
        }
        const imageCollection = await fetchImages(formInput, page);
       
        if(refs.gallery){
            refs.gallery.innerHTML = "";
        }
        
        imageMarkup(imageCollection.data.hits);
        if (!imageCollection.data.total) {
        Notify.failure("Sorry, there are no images matching your search query. Please try again.")
        return
        }
       
        if (refs.loadMore && refs.loadMore.classList.contains('is-hidden')&&page <= imageCollection.data.totalHits/imageOnPage) {
            refs.loadMore.classList.toggle('is-hidden');
        }
        Notify.success(`Hooray! We found ${imageCollection.data.totalHits} images.`);
        (e.target as HTMLFormElement).reset();
    
    } catch (error) {
       console.log(error);
    }  
}
async function onLoadMore() {
    try {
        if(refs.loadMore){
            refs.loadMore.classList.toggle('is-hidden');
        page += 1;
        const loadMoreImages = await fetchImages(formInput, page);
        refs.loadMore.classList.toggle('is-hidden');
        imageMarkup(loadMoreImages.data.hits);
        smoothScroll();

        if (page >= loadMoreImages.data.totalHits/imageOnPage) {
            refs.loadMore.classList.toggle('is-hidden');
            Notify.info("We're sorry, but you've reached the end of search results.")
        }
        }

    } catch (error) {
        console.log(error);
    }
}

// async function fetchImages(search, page) {
//     const res = await axios(`https://pixabay.com/api/?key=28071781-459ddb4c5fc455b50beadddbb&q=${search}&image_type=photo&orientation=horizontal&safesearch=true&per_page=${imageOnPage}&page=${page}`)

//     return res.data;
// }

function imageMarkup(arr:ICard[]) {
   if(refs.gallery){
    refs.gallery.insertAdjacentHTML('beforeend', cardsMarkup(arr));
    lightbox.refresh();
   }
}

function smoothScroll() {
    const gallery = document.querySelector(".gallery");
    if(gallery){
        const firstChild = gallery.firstElementChild;
        if(firstChild){
            const { height: cardHeight } = firstChild.getBoundingClientRect();
            window.scrollBy({
                top: cardHeight * 2,
                behavior: "smooth",
              });
        }
    }
    


}