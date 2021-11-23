const main = document.querySelector('main');
const addButton = document.querySelector('#add');
const popup = document.querySelector('#popup');
const form = document.querySelector('form');
const closePopup = document.querySelector('#close');
const formGroup1 = document.querySelectorAll('.form-group1');
const formGroup2 = document.querySelectorAll('.form-group2');
const submit = document.querySelector('#submitBtn');
const title = document.getElementById('title');
const author = document.getElementById('author');
const pages = document.getElementById('pages');
const radioBtns = document.querySelector('input[name="yes-no"]:checked');

addButton.addEventListener('click', () => {
    addButton.setAttribute('style', 'display: none');
    popup.setAttribute('style', 'display: flex');
});
closePopup.addEventListener('click', () => {
    popup.setAttribute('style', 'display: none');
    addButton.setAttribute('style', 'display: block');
    title.value = null;
    author.value = null;
    pages.value = null;
});
let myLibrary = [];

function Book(title, author, pages, status) {
    this.title = title,
    this.author = author,
    this.pages = pages,
    this.status = status
}

function addBookToLibrary() {
    if ((title.value != "" && author.value != "") && (pages.value != "")) {
    myLibrary.push(new Book(title.value, author.value, pages.value, radioBtns.value));
    createDiv();
    popup.setAttribute('style', 'display: none');
    addButton.setAttribute('style', 'display: block');
    }
}
function createDiv() {
    let div = document.createElement('div');
    div.classList.add('divs');
    let topDiv = document.createElement('div');
    let middleDiv = document.createElement('div');
    let bottomDiv = document.createElement('div');
    topDiv.classList.add('bookInfo');
    middleDiv.classList.add('book');
    bottomDiv.classList.add('radBtns');
    let bookTitle = `${myLibrary[myLibrary.length-1].title}`;
    topDiv.innerText = `${bookTitle}
    by 
    ${myLibrary[myLibrary.length-1].author}
    ${myLibrary[myLibrary.length-1].pages} pages`;
    let readBtn = document.createElement('button');
    readBtn.classList.add('read');
    readBtn.innerText = 'Read';
    readBtn.addEventListener('click', () => {
        if (readBtn.innerText == 'Read') {
            readBtn.classList.toggle('notRead');
            readBtn.innerText = 'Not Read';
        }
        else {
            readBtn.classList.toggle('notRead');
            readBtn.innerText = 'Read';
        }
    });
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', () => {
        for (i = 0; i < myLibrary.length; i++) {
            if (bookTitle == myLibrary[i].title) {
                myLibrary.splice(i, 1);
                div.remove();
            }
        }
    });
    bottomDiv.append(readBtn, deleteBtn);
    div.append(topDiv, middleDiv, bottomDiv);
    main.appendChild(div);
}
submit.addEventListener('click', () => {
    addBookToLibrary();
});
