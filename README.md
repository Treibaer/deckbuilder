# DeckBuilder

DeckBuilder is a web application for creating, managing, and sharing card decks. Inspired by platforms like [Moxfield](https://moxfield.com) and [Archidekt](https://archidekt.com), DeckBuilder utilizes the [Scryfall API](https://scryfall.com/docs/api) for accessing card data, proxied through a custom backend for improved efficiency and performance.

## Features

- **User Authentication**: Secure user login and registration.
- **Deck Management**: Create, edit, and delete decks.
- **Card Search**: Search for cards using the Scryfall API with several UI-friendly filters.
- **Card Details**: View detailed information about each card.
- **Moxfield Decks**: Search existing decks from Moxfields API and search for decks with specific cards and / or formats
- **Share Decks**: Share your decks with others using unique URLs.

## Technologies Used

- **Frontend**: React, React Router (this repository)
- **Backend**: PHP 8, Symfony 6 (not public yet)
- **Database**: MariaDB
- **API**: Scryfall API (proxied through custom backend)
- **Authentication**: Custom Bearer Token

## Installation

### Prerequisites

- Node.js

### Frontend Setup

1. Clone the repository:
    ```bash
    git clone git@github.com:Treibaer/deckbuilder.git
    cd deckbuilder
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Start the frontend development server:
    ```bash
    npm run dev
    ```
4. Adjust the `vite.config.js` - file and set a valid host

5. Open your browser and navigate to `http://localhost:5173`.

### Production build
1. Build app
    ```bash
    npm run build
    ```

2. Start server
    ```bash
    node server.js
    ```


## Usage

- Register a new user (not enabled) or log in with your existing account.
- Use the search bar in the search to find cards and add them to your deck.
- Create a new deck by clicking on "My Decks" in the navigation menu and then "Create".
- Edit your deck and share it with others using the provided share link.
- Search for moxfield decks, clone them and adjust to your needs

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any bugs, features, or improvements.

1. Fork the repository.
2. Create your feature branch: `git checkout -b feature/my-new-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-new-feature`
5. Open a pull request.


## Acknowledgements

- [Scryfall](https://scryfall.com) for providing an amazing API for card data.
- Inspiration from [Moxfield](https://moxfield.com) and [Archidekt](https://archidekt.com).

---

Happy deck building!




## Install react project
### Terminal

`npm create vite@latest tb-react`

### install dependencies
`npm install`

### start webserver

`npm run dev`

### install router
`npm install react-router-dom`
