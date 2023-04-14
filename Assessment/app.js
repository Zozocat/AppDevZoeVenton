//NAV BAR
const dictionaryNav = document.querySelector('#dictionary-nav');
const dictionaryPage = document.querySelector('#dictionary-page');
dictionaryNav.root = dictionaryPage;

const newsNav = document.querySelector('#news-nav');
const newsPage = document.querySelector('#news-page');
newsNav.root = newsPage;

const favouritesNav = document.querySelector('#favourites-nav');
const favouritesPage = document.querySelector('#favourites-page');
favouritesNav.root = favouritesPage;

//DICTIONARY
const searchButton = document.querySelector('#search-button');
const searchInput = document.querySelector('#search-input');
const definitionCardTitle = document.querySelector('#definition-card');
const definitionList = document.querySelector('#definition-card');

searchButton.addEventListener('click', () => {
  const word = searchInput.value.trim();
  if (word) {
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`) //api + searched word
      .then(response => response.json())
      .then(data => {
        const [entry] = data;
        const { word, meanings } = entry;
        definitionCardTitle.textContent = word;
        definitionList.innerHTML = meanings.map(meaning =>
          `<ion-item>
            <ion-label id = "fix-text"><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</ion-label>
          </ion-item>

          <ion-item>
            <ion-label id = "fix-text"><strong>Definition:</strong> ${meaning.definitions[0].definition}</ion-label>
          </ion-item>

          <ion-item>
            <ion-label id = "fix-text"><strong>Example:</strong> ${meaning.definitions[0].example}</ion-label>
          </ion-item>`).join('');
      })
      .catch(error => {
        console.error(error);
        definitionCardTitle.textContent = 'Error';
        definitionList.innerHTML = '<ion-item><ion-label>There was an error fetching the definition.</ion-label></ion-item>';
      });
  }
});

//SAVE WORDS
const saveButton = document.querySelector('#save');
const getButton = document.querySelector('#get-button');
const inputText = document.querySelector('#search-input');
const favouritesList = document.querySelector('#favourites-list');
const savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];

saveButton.addEventListener('click', () => {
  const word = inputText.value.trim();
  if (word) {
    // fetch data from API
    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)
      .then(response => response.json())
      .then(data => {
        // save word and data to local storage
        const savedWords = JSON.parse(localStorage.getItem('savedWords')) || [];
        const savedWord = { word, data };
        savedWords.push(savedWord);
        localStorage.setItem('savedWords', JSON.stringify(savedWords));
        console.log(`Saved: ${word}`);
        inputText.value = '';

        // add word to favorites list
        const savedWordItem = document.createElement('ion-item');
        savedWordItem.textContent = word;
        favouritesList.appendChild(savedWordItem);
      })
      .catch(error => {
        console.error(error);
        console.log('Error fetching data for word:', word);
      });
  } else {
    console.log('No word entered');
  }
});


savedWords.forEach(word => {
  const savedWordItem = document.createElement('ion-item');
  savedWordItem.textContent = word;
});

function displaySavedWords() {

  savedWords.forEach(savedWord => {
    const savedWordItem = document.createElement('ion-item');
    savedWordItem.textContent = savedWord.word;

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${savedWord.word}`)
      .then(response => response.json())
      .then(data => {
        const [entry] = data;
        const { word, meanings } = entry;
        let cardHeader = `<ion-item>
                          <ion-label id="fix-text"><strong>${savedWord.word}</strong> </ion-label>
                        </ion-item>`;
        let cardContent = '';
        meanings.forEach(meaning => {
          cardContent += `<ion-item>
                          <ion-label id="fix-text"><strong>Part of Speech:</strong> ${meaning.partOfSpeech}</ion-label>
                        </ion-item>
                        <ion-item>
                          <ion-label id="fix-text"><strong>Definition:</strong> ${meaning.definitions[0].definition}</ion-label>
                        </ion-item>
                        <ion-item>
                          <ion-label id="fix-text"><strong>Example:</strong> ${meaning.definitions[0].example}</ion-label>
                        </ion-item>
                        </br>`;
        });
        const savedWordHTML = `<ion-card>
                                <ion-card-header>${cardHeader}</ion-card-header>
                                <ion-card-content>
                                  <ion-list>${cardContent}</ion-list>
                                </ion-card-content>
                              </ion-card>`;

        favouritesList.innerHTML += savedWordHTML;
      })
      .catch(error => {
        console.error(error);
        console.log('Error fetching data for word:', savedWord.word);
      });
  });
}

displaySavedWords();


//NEWS
const apiKey = '34b069890cef4729ba08d5aa50dc00a5';
const url = `https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=${apiKey}`;
const newsList = document.querySelector('#news-list');

fetch(url)
  .then(response => response.json())
  .then(data => {
    const articles = data.articles;
    articles.forEach(article => {
      const articleHTML = `
        <ion-card>
          <ion-card-content>
            <ion-item>
              <ion-label>
                  <ion-label id = "fix-text"><strong><a href="${article.url}">${article.title}</a></strong></ion-label>
                
                  <ion-label id = "fix-text">${article.author}</ion-label>            
                
                  <ion-label id = "fix-text">Published Date: ${new Date(article.publishedAt).toLocaleDateString()}</ion-label>
                </ion-label>   
              </ion-item>
          </ion-card-content>
        </ion-card>`;
      newsList.innerHTML += articleHTML;
    });
  })
  .catch(error => {
    console.error(error);
    newsList.innerHTML = '<li>There was an error fetching the news.</li>';
  });