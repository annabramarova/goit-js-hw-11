import axios from 'axios';
axios.defaults.baseURL = 'https://pixabay.com/api/';
const KEY = '31931672-bd2c71509f90e4d9af4570b10';
const IMG_PER_PAGE = 40;

export default class Pixabay {

    constructor() {
        this.currentPage = 1;
        this.currentQuery = '';
        this.totalAmountOfPages = '';
    }

    get page() {
    return this.currentPage;
    }

    set page(newPage) {
        return (this.currentPage = newPage);
    }

    get totalPages() {
        return this.totalAmountOfPages;
    }

    set totalPages(newTotalPages) {
        return (this.totalAmountOfPages = newTotalPages);
    }

    calculateTotalPagesAmount (allCards){
    this.totalAmountOfPages = Math.ceil(allCards / IMG_PER_PAGE);
    }

    resetPages() {
    this.currentPage = 1;
    this.totalAmountOfPages = '';
    }

    async fetchImages() {
    return await axios.get(
            `?key=${KEY}&q=${
            this.currentQuery
            }&image_type=photo&orientation=horizontal&safesearch=true&page=${
            this.currentPage
            }&per_page=${IMG_PER_PAGE}`)
    }
}