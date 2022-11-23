import { initializeApp } from 'firebase/app';
import { collection, addDoc, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore/lite';
import { getFirestore } from 'firebase/firestore/lite';
import uniqid from 'uniqid';
import './style.css';

let myLibrary = [];

const firebaseConfig = {
    apiKey: "AIzaSyBHA47HvEa6l9_vmHEDPt03fgXdCVdmFvM",
    authDomain: "library-865f5.firebaseapp.com",
    projectId: "library-865f5",
    storageBucket: "library-865f5.appspot.com",
    messagingSenderId: "509387894414",
    appId: "1:509387894414:web:30e2a8831b7e69f72ba3df"
};

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

async function saveBook(title, author, pages, read, id) {
    try {
      await addDoc(collection(db, 'books'), {
        title: title,
        author: author,
        pages: pages,
        read: read,
        id: id
      });
    }
    catch(error) {
      console.error('Error writing new book to Firebase Database', error);
    }
}

async function changeStatus (id, text) {
    const booksCol = collection(db, 'books');
    const bookSnapshot = await getDocs(booksCol);
    let docId;
    bookSnapshot.docs.map((doc) => {
        let book = doc.data();
        if (book.id === id) {
            docId = doc.id;
        }
    });
    const bookRef = doc(db, 'books', docId);
    setDoc(bookRef, {read: text}, {merge: true});
}

async function deleteBook (id) {
    const booksCol = collection(db, 'books');
    const bookSnapshot = await getDocs(booksCol);
    let docId;
    bookSnapshot.docs.map((doc) => {
        let book = doc.data();
        if (book.id === id) {
            docId = doc.id;
            const div = document.getElementById(book.id);
            div.remove();
        }
    });
    await deleteDoc(doc(db, 'books', docId));
}

async function getBooks(db) {
    const booksCol = collection(db, 'books');
    const bookSnapshot = await getDocs(booksCol);
    const bookList = bookSnapshot.docs.map(doc => doc.data());
    return bookList;
}


window.onload = getBooks(db).then((result) => rerenderBooks(result));

function rerenderBooks (bookList) {
    myLibrary = [...bookList];
    bookList.forEach((book) => {
        createDiv(book);
    });
}

const main = document.querySelector('main');
const addButton = document.querySelector('#add');
const popup = document.querySelector('#popup');
const closePopup = document.querySelector('#close');
const submit = document.querySelector('#submitBtn');
const title = document.getElementById('title');
const author = document.getElementById('author');
const pages = document.getElementById('pages');

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


function addBookToLibrary() {
    const radioResult = document.querySelector('input[name="yes-no"]:checked');
    if ((title.value != "" && author.value != "") && (pages.value != "")) {
        let obj = {
            title: title.value,
            author: author.value,
            pages: pages.value,
            read: radioResult.value,
            id: uniqid()
        }
        console.log(radioResult.value);
        clear();
        saveBook(obj.title, obj.author, obj.pages, obj.read, obj.id);
        myLibrary.push(obj);
        createDiv(myLibrary[myLibrary.length - 1]);
        popup.setAttribute('style', 'display: none');
        addButton.setAttribute('style', 'display: block');
    }
}
 ///////checkpoint/////
function createDiv(book) {
    
    let div = document.createElement('div');
    div.id = book.id;
    div.classList.add('divs');
    let topDiv = document.createElement('div');
    let middleDiv = document.createElement('div');
    let bottomDiv = document.createElement('div');
    topDiv.classList.add('bookInfo');
    middleDiv.classList.add('book');
    bottomDiv.classList.add('radBtns');
    let bookTitle = `${book.title}`;
    topDiv.innerText = `${bookTitle}
    by
    ${book.author}
    ${book.pages} pages`;
    let readBtn = document.createElement('button');
    readBtn.classList.add('radio-btns');
    if (book.read == 'yes') {
        readBtn.classList.add('read');
        readBtn.innerText = 'Read';
    } else {
        readBtn.classList.add('notRead');
        readBtn.innerText = 'Not Read';
    }
    readBtn.addEventListener('click', () => {
        if (readBtn.classList.contains('read')) {
            readBtn.classList.remove('read');
            readBtn.classList.add('notRead');
            readBtn.innerText = 'Not Read';
            changeStatus(book.id, 'no');
        }
        else {
            readBtn.classList.remove('notRead');
            readBtn.classList.add('read');
            readBtn.innerText = 'Read';
            changeStatus(book.id, 'yes');
        }
    });
    let deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete');
    deleteBtn.innerText = 'Delete';
    deleteBtn.addEventListener('click', () => {
        deleteBook(book.id);
    });
    bottomDiv.append(readBtn, deleteBtn);
    div.append(topDiv, middleDiv, bottomDiv);
    main.appendChild(div);
    clear();
}

function clear() {
    title.value = null;
    author.value = null;
    pages.value = null;
}

submit.addEventListener('click', (e) => {
    e.preventDefault();
    addBookToLibrary();
});
