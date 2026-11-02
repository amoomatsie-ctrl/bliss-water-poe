# Bliss Water

A multi-page website for Bliss Water, an affordable-premium filtered bottled water brand based in Johannesburg, South Africa.

- **Repository:** https://github.com/amoomatsie-ctrl/bliss-water-poe
- **Live site:** *(add your Netlify / GitHub Pages link here)*
- **Module:** *(add module name and code)*
- **Student:** *(add your name and student number)*

## Pages

| Page | Purpose |
|---|---|
| `index.html` | Home page and brand introduction |
| `about.html` | Brand story and the six-step water process |
| `product.html` | The 500ml, 750ml and 1.5L products and pricing strategy |
| `enquiry.html` | Enquiry form: bulk, event, stocklist and general questions, with a cost and availability response |
| `contact.html` | Locations, map and a general message form that compiles an email |

## Part 3: What was added

### JavaScript functionality
- **Form validation** (`js/forms.js`): client-side checks for name, email, South African phone numbers, quantity, event date and message length, with error messages shown beside each field.
- **Enquiry response** (`js/forms.js`): estimates cost from the product price ranges and gives availability information. The enquiry is sent using AJAX (`fetch`) when a form endpoint is configured.
- **Contact email** (`js/forms.js`): validated details are compiled into an email addressed to hello@blisswater.co.za.
- *(Add here as you complete them: accordion, lightbox gallery, animations, search/filter/sort, Leaflet map.)*

### SEO
*(Complete as you go: keywords, title tags, meta descriptions, heading structure, image file names and alt text, internal links, mobile-friendliness, `robots.txt`, `sitemap.xml`, page speed, security.)*

### Deployment
*(Add the platform used and the steps taken.)*

## Running the project locally

1. Clone the repository: `git clone https://github.com/amoomatsie-ctrl/bliss-water-poe.git`
2. Open the folder in VS Code.
3. Start it with the Live Server extension (right-click `index.html`, then Open with Live Server). A local server is needed so that `fetch` requests work.

## Changelog

### Part 3

| Date | File(s) | Change |
|---|---|---|
| *(date)* | `enquiry.html`, `contact.html`, `js/forms.js`, `css/forms.css` | Added client-side validation with error messages to both forms. Added bottle size, quantity and event date fields to the enquiry form, shown only for bulk and event orders. Added a cost estimate and availability response to the enquiry form, and an email builder with a `mailto:` link to the contact form. |
| *(date)* | `enquiry.html` | Fixed the "reseverd" spelling error in the footer. Added the Google Fonts links that the other pages already had. Fixed the page title spacing. |
| *(date)* | `contact.html` | Added a "type of message" field. Added a title attribute to the map iframe for accessibility. |

#### Changes made from Part 2 feedback

| Feedback received | What was changed | File(s) |
|---|---|---|
| *(copy the lecturer's comment)* | *(describe exactly what you did)* | *(files)* |

### Part 2 and earlier
*(Add or link your earlier changelog entries here, if you have them.)*

## References

Use the Harvard Style Referencing Guide, adapted for the IIE. Complete the access dates and add anything else you used.

- Agafonkin, V. (n.d.) *Leaflet: an open-source JavaScript library for interactive maps*. Available at: https://leafletjs.com (Accessed: *add date*).
- Google (n.d.) *Google Fonts: Fraunces and Work Sans*. Available at: https://fonts.google.com (Accessed: *add date*).
- *(Add any tutorial, code snippet, image or text you adapted. Include the author, year, title, URL and access date.)*

### Images
*(List the source and licence of every image you did not create yourself.)*
