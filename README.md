# 🍊 FreshBite – Online Food Ordering

A frontend-only food ordering website. Browse restaurants, explore menus, add dishes to your cart and place an order. Built for the **Data Alcott Systems Free Web Development Internship** (Task ID: WD-EC-001, Food & Restaurant domain).

**Live demo:** `https://Adityatiwary11.github.io/freshbite/`
**Repository:** `https://github.com/Adityatiwary11/freshbite`

## Features

- Restaurant categories and a restaurant grid with filters (cuisine, rating, price)
- Menu with dietary tags (Veg, Non-Veg, Gluten-Free) and a tag filter
- Dish detail page with description, ingredients and nutrition info
- Cart with quantity adjustment, coupon code (`FRESH10`) and live price calculation
- Checkout with delivery address, payment method and delivery time selection
- Order confirmation, order history, saved addresses and wishlist
- Simulated login and registration (no server)
- Responsive layout, light and dark colour schemes

## Pages

| Page | Route | Description |
|------|-------|-------------|
| Home | `#home` | Hero banner, cuisine categories, featured dishes, special offers |
| Restaurant Listing | `#restaurants` | Grid of restaurants with filters |
| Menu | `#menu-all`, `#menu-<id>` | Dishes with images, descriptions, prices and dietary tags |
| Product Detail | `#dish-<id>` | Description, ingredients, nutrition, add to cart |
| Shopping Cart | `#cart` | Items, quantity buttons, totals, coupon |
| Checkout | `#checkout` | Address, payment, delivery time, order summary |
| User Account | `#account` | Profile, order history, saved addresses, wishlist |
| Login / Register | `#login`, `#register` | Simulated authentication |
| About Us | `#about` | Story, team, awards |
| Contact Us | `#contact` | Map, hours, phone, contact form |

## Tech stack

- **HTML5** for structure
- **CSS3** (custom properties, grid, flexbox, media queries) for styling
- **Vanilla JavaScript** for routing, cart logic and rendering
- No database. Data lives in JavaScript arrays (`js/data.js`) and the browser's `localStorage`.

## Design

| Token | Value |
|-------|-------|
| Warm orange | `#FF6B35` |
| Cream | `#FFF8F0` |
| Dark brown | `#2D1B12` |
| Fonts | Fredoka (headings), Nunito (body) |

## Project structure

```
freshbite/
├── index.html        # Page shell (header, main, footer)
├── css/
│   └── style.css     # All styles and design tokens
├── js/
│   ├── data.js       # Restaurants and dishes (edit this to add food)
│   └── app.js        # State, page templates, router, event handlers
├── .gitignore
└── README.md
```

## How it works

1. `js/data.js` defines the restaurant array `R` and the dish array `D`.
2. `js/app.js` keeps cart, user, orders, addresses and wishlist in a state object `S` and saves it to `localStorage`.
3. Each page is a function in the `P` object that returns an HTML string.
4. The router reads `location.hash` (for example `#dish-4`), calls the matching function and renders it into `<main id="app">`.
5. One click listener, one change listener and one submit listener handle every interaction using `data-*` attributes.

## Run locally

1. Clone the repository:
   ```bash
   git clone https://github.com/Adityatiwary11/freshbite.git
   cd freshbite
   ```
2. Open `index.html` in a browser, or use the **Live Server** extension in VS Code (right-click `index.html`, then **Open with Live Server**).

No build step or dependencies are needed.

## Deploy on GitHub Pages

1. Push the project to a public GitHub repository.
2. Open the repository, then **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **Deploy from a branch**.
4. Choose branch `main` and folder `/ (root)`, then click **Save**.
5. After a minute, the site is live at `https://Adityatiwary11.github.io/<repo-name>/`.

## Add a new dish

Add one row to the `D` array in `js/data.js`:

```js
[13, 3, "Fruit Smoothie", "🥤", 129, "v g", "Fresh seasonal fruit blended with yoghurt.", "Banana, mango, yoghurt", 210, 6, 40, 3]
// id, restaurant id, name, emoji, price, tags, description, ingredients, kcal, protein, carbs, fat
```

Tags: `v` = Veg, `n` = Non-Veg, `g` = Gluten-Free.

## Notes

- Login, payment and orders are **simulated**. Nothing leaves your browser.
- Food images are emoji so the project has no image dependencies. Replace them with `<img>` tags if you want photos.
- Try the coupon code `FRESH10` in the cart. Delivery is free on orders above ₹500.

## Author

Aditya Tiwary, built as part of the Data Alcott Systems web development internship.
