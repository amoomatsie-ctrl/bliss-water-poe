/* forms.js - client-side validation, enquiry quote (AJAX), contact email builder
   Load on enquiry.html and contact.html, after script.js */

// ---- Settings you can change ----
const CONTACT_EMAIL = "hello@blisswater.co.za";   // recipient for contact.html emails
const FORM_ENDPOINT = "";                         // e.g. a Formspree URL: "https://formspree.io/f/xxxxxxx"
// Price ranges per bottle (rand) taken from product.html
const PRICES = {
  "500ml": { low: 8,  high: 12 },
  "750ml": { low: 10, high: 15 },
  "1.5l":  { low: 12, high: 18 }
};

// ---- Validation rules: each returns "" when valid, or an error message ----
const rules = {
  name(v) {
    if (!v) return "Enter your name.";
    if (v.length < 2 || v.length > 60) return "Your name must be 2 to 60 characters.";
    if (!/^[A-Za-zÀ-ÿ' -]+$/.test(v)) return "Use letters, spaces, hyphens or apostrophes only.";
    return "";
  },
  email(v) {
    if (!v) return "Enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email, like name@example.com.";
    return "";
  },
  phone(v) {                       // optional, but must be a valid SA number if given
    if (!v) return "";
    const digits = v.replace(/[\s-]/g, "");
    if (!/^(\+27|0)[0-9]{9}$/.test(digits)) return "Use a South African number, like 011 446 7590 or +27 11 446 7590.";
    return "";
  },
  reason(v)  { return v ? "" : "Choose a reason for your enquiry."; },
  topic(v)   { return v ? "" : "Choose the type of message."; },
  size(v)    { return v ? "" : "Choose a bottle size."; },
  quantity(v) {
    if (!v) return "Enter how many bottles you need.";
    const n = Number(v);
    if (!Number.isInteger(n) || n < 1 || n > 10000) return "Enter a whole number from 1 to 10 000.";
    return "";
  },
  eventdate(v) {
    if (!v) return "Choose the date of your event.";
    const min = new Date(); min.setHours(0, 0, 0, 0); min.setDate(min.getDate() + 7);
    if (new Date(v) < min) return "Events need at least 7 days notice. Choose a later date.";
    return "";
  },
  message(v, form) {
    const required = form.id === "contact-form";
    if (!v) return required ? "Type your message." : "";
    if (required && v.length < 10) return "Your message must be at least 10 characters.";
    if (v.length > 500) return "Keep your message under 500 characters (currently " + v.length + ").";
    return "";
  }
};

function checkField(field, form) {
  const rule = rules[field.id];
  if (!rule || field.closest("[hidden]")) return true;
  const msg = rule(field.value.trim(), form);
  const out = document.getElementById(field.id + "-error");
  if (out) out.textContent = msg;
  field.setAttribute("aria-invalid", msg ? "true" : "false");
  return !msg;
}

function checkForm(form) {
  let firstBad = null;
  form.querySelectorAll("input, select, textarea").forEach((f) => {
    if (!checkField(f, form) && !firstBad) firstBad = f;
  });
  if (firstBad) firstBad.focus();
  return !firstBad;
}

function wireValidation(form) {
  form.querySelectorAll("input, select, textarea").forEach((f) => {
    f.addEventListener("blur", () => checkField(f, form));
    f.addEventListener("input", () => { if (f.getAttribute("aria-invalid") === "true") checkField(f, form); });
  });
}

// ---- Enquiry form: validate -> show quote -> send via AJAX ----
function initEnquiry() {
  const form = document.getElementById("enquiry-form");
  if (!form) return;
  wireValidation(form);

  const reason = form.querySelector("#reason");
  const orderFields = form.querySelector("#order-fields");
  const dateWrap = form.querySelector("#eventdate-wrap");
  const status = document.getElementById("form-status");
  const button = form.querySelector("button[type=submit]");

  function toggleFields() {   // show order details only when relevant
    const needsOrder = reason.value === "bulk" || reason.value === "event";
    orderFields.hidden = !needsOrder;
    dateWrap.hidden = reason.value !== "event";
  }
  reason.addEventListener("change", toggleFields);
  toggleFields();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.replaceChildren();
    if (!checkForm(form)) return;

    const data = Object.fromEntries(new FormData(form).entries());
    status.replaceChildren(buildResponse(data));   // instant on-page response

    if (FORM_ENDPOINT) {                           // AJAX submission (no page reload)
      button.disabled = true;
      try {
        const res = await fetch(FORM_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error("HTTP " + res.status);
        status.append(note("Your enquiry has been sent. We will contact you within 1 business day."));
        form.reset(); toggleFields();
      } catch (err) {
        status.append(note("We could not send your enquiry. Check your connection and try again, or email " + CONTACT_EMAIL + ".", true));
      } finally { button.disabled = false; }
    }
  });
}

function note(text, isError) {
  const p = document.createElement("p");
  p.textContent = text;
  if (isError) p.style.color = "#b3261e";
  return p;
}

// Builds the quote / availability response (all text set with textContent, so input is never run as HTML)
function buildResponse(d) {
  const box = document.createElement("div");
  box.className = "result-box";
  box.setAttribute("role", "status");
  const h = document.createElement("h3");
  h.textContent = "Thank you, " + d.name.split(" ")[0];
  box.append(h);

  if (d.reason === "bulk" || d.reason === "event") {
    const p = PRICES[d.size], qty = Number(d.quantity);
    let discount = 0;
    if (qty >= 500) discount = 0.10; else if (qty >= 100) discount = 0.05;   // placeholder bulk discounts
    const low = qty * p.low * (1 - discount), high = qty * p.high * (1 - discount);
    const fmt = (n) => "R" + n.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    box.append(
      note("Estimated cost for " + qty + " x " + d.size.toUpperCase() + " bottles: " + fmt(low) + " to " + fmt(high) +
           (discount ? " (includes a " + discount * 100 + "% bulk discount)." : ".")),
      note(d.reason === "event"
        ? "Availability: we can deliver in Johannesburg on " + new Date(d.eventdate).toLocaleDateString("en-ZA", { dateStyle: "long" }) + ". Please confirm 3 days before the event."
        : "Availability: bulk orders are usually ready within 3 business days."),
      note("This is an estimate. We will send a final quote to " + d.email + ".")
    );
  } else if (d.reason === "stocklist") {
    box.append(note("Our sales team will email retail stocklist pricing and minimum order sizes to " + d.email + "."));
  } else {
    box.append(note("We have received your question and will reply to " + d.email + " within 1 business day."));
  }
  return box;
}

// ---- Contact form: validate -> compile email -> mailto link to the recipient ----
function initContact() {
  const form = document.getElementById("contact-form");
  if (!form) return;
  wireValidation(form);
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    status.replaceChildren();
    if (!checkForm(form)) return;

    const d = Object.fromEntries(new FormData(form).entries());
    const topicText = form.querySelector("#topic").selectedOptions[0].textContent;
    const subject = "Website message: " + topicText;
    const body = ["Name: " + d.name, "Email: " + d.email, "Phone: " + (d.phone || "Not provided"),
                  "Type of message: " + topicText, "", d.message].join("\r\n");

    const box = document.createElement("div");
    box.className = "result-box";
    box.setAttribute("role", "status");
    const h = document.createElement("h3"); h.textContent = "Your email is ready";
    const pre = document.createElement("pre"); pre.textContent = "To: " + CONTACT_EMAIL + "\nSubject: " + subject + "\n\n" + body.replace(/\r\n/g, "\n");
    const a = document.createElement("a");
    a.className = "cta-button";
    a.textContent = "Open in your email app";
    a.href = "mailto:" + CONTACT_EMAIL + "?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(body);
    box.append(h, pre, a);
    status.replaceChildren(box);
    a.focus();
  });
}

document.addEventListener("DOMContentLoaded", () => { initEnquiry(); initContact(); });
