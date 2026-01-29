# Delta – Excellence Through Transformation

**Website:** Premium Fashion Brand – Elevate Your Standard  

This is the frontend project for **Delta**, a modern e-commerce website showcasing premium apparel. The site focuses on design, sustainability, and user experience.

---

## Table of Contents

- [Project Overview](#project-overview)  
- [Features](#features)  
- [Technologies](#technologies)  
- [Functionality](#functionality)  

---

## Project Overview

Delta is an e-commerce website presenting premium apparel.  
The goal is to combine a modern, engaging design with:

- Interactive product galleries  
- Mobile-friendly navigation  
- Shopping cart functionality  
- Testimonials and CTA sections  

The site is fully responsive and user-friendly.

---

## Features

### Navigation & Layout

- Header with logo and navigation  
- Mobile menu with toggle button  
- Sticky cart button with slide-out drawer  

### Product Gallery

- Multiple products with front, back, and side views  
- Color variants per product  
- Dynamic thumbnail preview on hover or click  

### Shopping Cart

- Add, remove, and update product quantities  
- Automatic calculation of total price  
- Checkout simulation with toast notifications  

### Interactive Sections

- Hero section with CTA buttons  
- Vision section highlighting brand values (Integrity, Purpose, Innovation, Sustainability)  
- Collection section with product cards  
- Models section showing products in action  
- Excellence section emphasizing quality and craftsmanship  
- Testimonials section for user feedback  
- CTA section for conversions  
- Contact section with form and company info  

### Extras

- Toast notifications for actions  
- Intersection Observer animations on scroll  
- Smooth-scroll navigation  

---

## Technologies

- **HTML5** – Page structure  
- **CSS3** – Styling (`mainpage.css`)  
- **JavaScript (ES6)** – Interactivity (`mainpage.js`)  
- **Google Fonts** – `Inter` & `Space Mono`  
- **SVG & Images** – Logos, icons, and product images  

---

## Functionality

### Product Gallery
- Dynamically switch between views (front/back/left/right)  
- Change product colors via radio buttons  
- Hover or click thumbnails to update main image  

### Shopping Cart
- `addToCart(name, price, color)` – Add product  
- `removeFromCart(itemId)` – Remove product  
- `updateQuantity(itemId, newQuantity)` – Update quantity  
- UI automatically updates item count, individual prices, and total  

### Toast Notifications
```javascript
showToast('Message', 'success|info|warning');
