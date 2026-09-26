/* ============================================================
   BACK LOT PRINTING — PRODUCTS
   To ADD a product: copy one line, paste it, change the details.
   To REMOVE a product: delete its line.
   To CHANGE a price: edit the number after price:

   Fields:
     id     unique short code, no spaces (e.g. "d8")
     name   product name
     price  number, no $ sign
     unit   "flat" = per item, "ea" = each (bulk item), "from" = starting at
     cat    drink | pets | tags | edc | gifts | awards | biz
            (jewelry is hidden for now — add a line with cat: "jewelry" to bring it back)
     kind   picture: tumbler flask bottle dogtag keychain card knife jewelry
            board coaster award patch tool ornament lighter photo
     byo    true if the customer brings the item
     feat   true to show it first / as popular
     min    (optional) minimum quantity
     tiers  (optional) cheaper price at quantity, e.g. [[5, 15]] = $15 each for 5+
     desc   short description
   ============================================================ */
window.BACKLOT_PRODUCTS = [
  { id: "d1", name: "Tumbler Engraving", price: 20, unit: "flat", cat: "drink", kind: "tumbler", byo: true, feat: true, tiers: [[5, 15]], desc: "Bring any stainless or powder-coated tumbler. Name, initials or logo on one side. $15 each when you bring 5 or more." },
  { id: "d2", name: "Custom Engraved Flask", price: 28, unit: "flat", cat: "drink", kind: "flask", feat: true, desc: "Stainless hip flask included, engraved with your name, date or logo. A classic groomsmen gift." },
  { id: "d7", name: "Flask Engraving", price: 18, unit: "flat", cat: "drink", kind: "flask", byo: true, desc: "Bring your own stainless flask. Name, monogram or date on the front." },
  { id: "d3", name: "20 oz Tumbler", price: 38, unit: "flat", cat: "drink", kind: "tumbler", desc: "We supply a powder-coated stainless tumbler with lid, engraved through to the steel." },
  { id: "d4", name: "Water Bottle", price: 36, unit: "flat", cat: "drink", kind: "bottle", desc: "Insulated stainless bottle with a big flat engraving area." },
  { id: "d5", name: "Stainless Pint Cup", price: 24, unit: "flat", cat: "drink", kind: "tumbler", desc: "Unbreakable stainless pint, engraved on one side. Cabin, boat or bar." },
  { id: "d6", name: "Bottle Engraving", price: 20, unit: "flat", cat: "drink", kind: "bottle", byo: true, tiers: [[5, 15]], desc: "Your own stainless or powder-coated bottle, marked on one side so it never goes missing." },

  { id: "p1", name: "Pet ID Tag", price: 18, unit: "flat", cat: "pets", kind: "dogtag", feat: true, desc: "Name and phone number deep-engraved on both sides of a stainless tag. Won't wear off." },
  { id: "p2", name: "Pet Memorial Slate", price: 40, unit: "flat", cat: "pets", kind: "coaster", desc: "Natural slate with your pet's name, dates and photo. A gentle keepsake." },
  { id: "p3", name: "Collar Nameplate", price: 20, unit: "flat", cat: "pets", kind: "card", desc: "Slide-on brass or steel plate for leather collars. No jingling tag." },

  { id: "t1", name: "Dog Tags", price: 15, unit: "flat", cat: "tags", kind: "dogtag", feat: true, desc: "Military-style stainless tag with chain. Names, dates, quotes or coordinates." },
  { id: "t6", name: "Dog Tag Necklace", price: 22, unit: "flat", cat: "tags", kind: "dogtag", desc: "We supply a stainless tag on a necklace chain. Names, a date or coordinates, front and back." },
  { id: "t2", name: "Keychain", price: 14, unit: "flat", cat: "tags", kind: "keychain", desc: "Stainless, aluminum or genuine leather. Engraved on one or both sides." },
  { id: "t3", name: "Bottle Opener Keychain", price: 16, unit: "flat", cat: "tags", kind: "keychain", desc: "Solid steel opener with your name or logo." },
  { id: "t4", name: "Luggage Tag", price: 18, unit: "flat", cat: "tags", kind: "card", desc: "Aluminum or genuine leather tag with your details on the back." },
  { id: "t5", name: "Hockey Bag Tags", price: 12, unit: "flat", cat: "tags", kind: "dogtag", desc: "Player name and number. Order for the whole team and save." },

  { id: "e1", name: "Pocket Knife", price: 32, unit: "flat", cat: "edc", kind: "knife", desc: "We supply the knife, engraved on the blade or a flat metal handle." },
  { id: "e2", name: "Knife Engraving", price: 20, unit: "flat", cat: "edc", kind: "knife", byo: true, desc: "Your knife or blade — name, initials or a logo." },
  { id: "e3", name: "Engraved Lighter", price: 30, unit: "flat", cat: "edc", kind: "lighter", desc: "Flip-top brass or chrome lighter with a custom design." },
  { id: "e4", name: "Money Clip", price: 22, unit: "flat", cat: "edc", kind: "card", desc: "Stainless money clip with initials. A clean, simple gift." },
  { id: "e5", name: "Golf Divot Tool & Ball Marker", price: 20, unit: "flat", cat: "edc", kind: "tool", desc: "Metal divot tool with a matching ball marker, engraved with initials or a logo." },
  { id: "e6", name: "Multitool Engraving", price: 20, unit: "flat", cat: "edc", kind: "tool", byo: true, desc: "Your multitool, marked so it comes home with you." },

  { id: "g1", name: "Cutting Board", price: 45, unit: "flat", cat: "gifts", kind: "board", desc: "Bamboo or maple board with names or a date. Design area up to 8.5 × 8.5 in." },
  { id: "g2", name: "Slate Coasters (set of 4)", price: 36, unit: "flat", cat: "gifts", kind: "coaster", desc: "Natural slate with felt feet. Logos and monograms come out crisp." },
  { id: "g3", name: "Photo on Metal", price: 40, unit: "flat", cat: "gifts", kind: "photo", desc: "Send a photo and we engrave it onto aluminum or stainless." },
  { id: "g4", name: "Christmas Ornament", price: 15, unit: "flat", cat: "gifts", kind: "ornament", desc: "Wood or metal ornament with names and the year." },
  { id: "g5", name: "Leather Hat Patch", price: 10, unit: "ea", cat: "gifts", kind: "patch", tiers: [[25, 6]], desc: "Genuine leather patch, ready to sew or stick on a hat. $6 each for 25 or more." },
  { id: "g6", name: "Leather Wallet", price: 42, unit: "flat", cat: "gifts", kind: "patch", desc: "Genuine leather wallet with initials or a brand on the front." },

  { id: "a1", name: "Black Acrylic Award", price: 55, unit: "flat", cat: "awards", kind: "award", desc: "Black or coloured acrylic, engraved in crisp contrast. Tournaments, banquets, staff awards." },
  { id: "a2", name: "Metal Plaque", price: 50, unit: "flat", cat: "awards", kind: "card", desc: "Engraved aluminum or brass plate on a wood backer." },
  { id: "a3", name: "Challenge Coin", price: 20, unit: "flat", cat: "awards", kind: "coaster", desc: "Solid brass coin engraved both sides. Crews, teams, first responders." },

  { id: "b1", name: "Metal Business Cards", price: 8, unit: "ea", cat: "biz", kind: "card", feat: true, min: 25, tiers: [[50, 6], [100, 4.5]], desc: "Stainless or black anodized aluminum. Minimum 25. $6 each at 50, $4.50 at 100+." },
  { id: "b2", name: "Equipment & Asset Tags", price: 4, unit: "ea", cat: "biz", kind: "card", min: 10, tiers: [[50, 3.2]], desc: "Serial numbers, QR codes and company info on aluminum or steel. $40 minimum order." },
  { id: "b3", name: "Tool Marking", price: 3, unit: "ea", cat: "biz", kind: "tool", min: 14, tiers: [[50, 2.4]], desc: "Your company name on the metal of each hand tool. $40 minimum order." },
  { id: "b4", name: "QR Code Tags", price: 5, unit: "ea", cat: "biz", kind: "card", min: 8, tiers: [[50, 4]], desc: "Scannable QR codes for manuals, menus, reviews or inventory. $40 minimum order." },
  { id: "b5", name: "Name Badges", price: 15, unit: "flat", cat: "biz", kind: "card", tiers: [[50, 12]], desc: "Magnetic or pin-back metal badges for staff." },
  { id: "b6", name: "Branded Bottle Openers", price: 7, unit: "ea", cat: "biz", kind: "keychain", min: 25, tiers: [[50, 5.6]], desc: "Steel openers with your logo. Minimum 25 — great client and trade-show handouts." }
];
