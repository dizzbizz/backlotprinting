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
     cat    drink | pets | tags | edc | gifts | kids | print | apparel | awards | biz
            (jewelry is hidden for now — add a line with cat: "jewelry" to bring it back)
     kind   picture: tumbler flask bottle dogtag keychain card knife jewelry
            board coaster award patch tool ornament lighter photo print3d
            tshirt transfer tote
     byo    true if the customer brings the item
     feat   true to show it first / as popular
     min    (optional) minimum quantity
     tiers  (optional) cheaper price at quantity, e.g. [[5, 15]] = $15 each for 5+
     img    (optional) a real photo, e.g. "images/my-photo.jpg" — put the file in the images folder
     desc   short description
   ============================================================ */
window.BACKLOT_PRODUCTS = [
  { id: "d1", name: "Tumbler Engraving", price: 20, unit: "flat", cat: "drink", kind: "tumbler", byo: true, feat: true, tiers: [[5, 15]], img: "images/witches-brew-tumbler-front.jpg", desc: "Bring any stainless or powder-coated tumbler. Name, initials or logo on one side. $15 each when you bring 5 or more. Want both sides? Pick Tumbler Engraving, Both Sides ($30)." },
  { id: "d8", name: "Tumbler Engraving, Both Sides", price: 30, unit: "flat", cat: "drink", kind: "tumbler", byo: true, img: "images/witches-brew-tumbler-both-sides.jpg", desc: "Bring your own stainless or powder-coated tumbler and we engrave the front and the back. A name on one side and a logo or design on the other, like our Witches' Brew tumbler." },
  { id: "d2", name: "Custom Engraved Flask", price: 28, unit: "flat", cat: "drink", kind: "flask", feat: true, desc: "Stainless hip flask included, engraved with your name, date or logo. A classic groomsmen gift." },
  { id: "d7", name: "Flask Engraving", price: 18, unit: "flat", cat: "drink", kind: "flask", byo: true, desc: "Bring your own stainless flask. Name, monogram or date on the front." },
  { id: "d3", name: "20 oz Tumbler", price: 38, unit: "flat", cat: "drink", kind: "tumbler", desc: "We supply a powder-coated stainless tumbler with lid, engraved through to the steel." },
  { id: "d4", name: "Water Bottle", price: 36, unit: "flat", cat: "drink", kind: "bottle", desc: "Insulated stainless bottle with a big flat engraving area." },
  { id: "d5", name: "Stainless Pint Cup", price: 24, unit: "flat", cat: "drink", kind: "tumbler", desc: "Unbreakable stainless pint, engraved on one side. Cabin, boat or bar." },
  { id: "d6", name: "Bottle Engraving", price: 20, unit: "flat", cat: "drink", kind: "bottle", byo: true, tiers: [[5, 15]], desc: "Your own stainless or powder-coated bottle, marked on one side so it never goes missing." },

  { id: "p1", name: "Pet ID Tag", price: 18, unit: "flat", cat: "pets", kind: "dogtag", feat: true, img: "images/pet-tag-luigi.jpg", desc: "Name and phone number deep-engraved on both sides of a stainless tag. Won't wear off." },
  { id: "p2", name: "Pet Memorial Slate", price: 40, unit: "flat", cat: "pets", kind: "coaster", desc: "Natural slate with your pet's name, dates and photo. A gentle keepsake." },
  { id: "p4", name: "Wood Dog Portrait", price: 25, unit: "flat", cat: "pets", kind: "board", img: "images/whippet-head.jpg", desc: "Laser-cut basswood profile of your dog's breed with engraved details. Add their name on the collar. Pictured: our whippet." },
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
  { id: "e7", name: "Earbud Case Engraving", price: 20, unit: "flat", cat: "edc", kind: "card", byo: true, feat: true, img: "images/airpods-case-eagle.jpg", desc: "Bring your AirPods or hard earbud case and we'll engrave a name, logo or design on the front. Light surface mark, tested first." },

  { id: "g1", name: "Cutting Board", price: 45, unit: "flat", cat: "gifts", kind: "board", desc: "Bamboo or maple board with names or a date. Design area up to 8.5 × 8.5 in." },
  { id: "g2", name: "Slate Coasters (set of 4)", price: 36, unit: "flat", cat: "gifts", kind: "coaster", desc: "Natural slate with felt feet. Logos and monograms come out crisp." },
  { id: "g3", name: "Photo on Metal", price: 40, unit: "flat", cat: "gifts", kind: "photo", desc: "Send a photo and we engrave it onto aluminum or stainless." },
  { id: "w1", name: "Custom Wood Cut-outs & Ornaments", price: 8, unit: "from", cat: "kids", kind: "ornament", feat: true, img: "images/rotary-rotor-braap.jpg", desc: "Laser-cut basswood made to order: Halloween jack-o'-lanterns, Christmas ornaments with names and the year, paint-your-own turtles (designed and coloured by kids!), rotary rotors and more. Paint them or leave them natural. Turtles from $8, ornaments $12–15, larger pieces from $20. Tell us your idea and we'll quote it." },
  { id: "g8", name: "Engraved Golf Balls", price: 5, unit: "ea", cat: "gifts", kind: "coaster", byo: true, feat: true, tiers: [[6, 4]], img: "images/golf-ball-best-dad.jpg", desc: "Bring your own golf balls and we'll engrave names, initials, a logo or our Best Dad By Par design. $4 each for 6 or more. Want us to supply the balls? Just ask." },
  { id: "g5", name: "Leather Hat Patch", price: 10, unit: "ea", cat: "gifts", kind: "patch", tiers: [[25, 6]], desc: "Genuine leather patch, ready to sew or stick on a hat. $6 each for 25 or more." },
  { id: "g6", name: "Leather Wallet", price: 42, unit: "flat", cat: "gifts", kind: "patch", desc: "Genuine leather wallet with initials or a brand on the front." },


  /* ---- 3D printing ---- */
  { id: "x1", name: "Custom Name Keychain", price: 10, unit: "flat", cat: "print", kind: "print3d", feat: true, tiers: [[10, 8]], desc: "3D-printed keychain with a raised name in two colours. Pick your colours. $8 each for 10 or more — great for teams and party favours." },
  { id: "x5", name: "Personalized 3D Printed Toys", price: 15, unit: "from", cat: "print", kind: "print3d", feat: true, desc: "Our own toy designs — fidget toys, flexi critters and clickers — printed in your colours with a name printed in or laser-engraved after. Great for birthdays and stocking stuffers. Small parts: not for under 3." },
  { id: "x2", name: "Custom Jigs & Organizers", price: 15, unit: "from", cat: "print", kind: "print3d", img: "images/3d-printed-golf-jig.jpg", desc: "Holders, trays and organizers designed to fit your exact items — like our 6-ball golf jig. Tell us what it needs to hold and we'll quote it." },
  { id: "x3", name: "Printed + Engraved Combo", price: 25, unit: "from", cat: "print", kind: "print3d", desc: "A 3D-printed piece paired with laser engraving: a display stand for a coin, a gift box for engraved golf balls, a keychain with an engraved metal tag. Ask for ideas." },
  { id: "x4", name: "Custom 3D Print", price: 10, unit: "from", cat: "print", kind: "print3d", desc: "Have an idea, a sketch or a part you need? We design and print it. Priced by size and print time — send us the details for a quote." },
  { id: "s1", name: "Custom Printed T-Shirt", price: 25, unit: "from", cat: "apparel", kind: "tshirt", feat: true, tiers: [[12, 20], [24, 17]], img: "images/custom-tee-leo-black.jpg", desc: "Soft cotton tee in your size and colour with your design, name or logo printed in full colour (DTF). Looks great on light and dark shirts. $20 each for 12+, $17 each for 24+." },
  { id: "s2", name: "Shirt Printing — Bring Your Own", price: 15, unit: "from", cat: "apparel", kind: "tshirt", byo: true, tiers: [[12, 11]], desc: "Bring your own tee, hoodie, jacket, apron or tote and we press your design on. Cotton, polyester, blends, canvas and denim. Front print from $15, $11 each for 12+." },
  { id: "s3", name: "Team & Event Shirts", price: 18, unit: "ea", cat: "apparel", kind: "tshirt", min: 12, feat: true, tiers: [[24, 15], [50, 13]], img: "images/custom-tee-your-logo-white.jpg", desc: "Business and staff logo shirts, hockey and ball teams, family reunions, stags and stagettes. Front print included; add names or numbers on the back. Minimum 12. $15 each at 24+, $13 each at 50+." },
  { id: "s4", name: "Custom Hoodie", price: 45, unit: "from", cat: "apparel", kind: "tshirt", tiers: [[12, 38]], desc: "Pullover hoodie with your design on the front, back or both. Team names and numbers welcome. $38 each for 12+." },
  { id: "s8", name: "Custom DTF on Anything", price: 15, unit: "from", cat: "apparel", kind: "transfer", byo: true, feat: true, desc: "If it's fabric and can take the heat, we can press it: hoodies, jackets, work shirts, aprons, tote and duffel bags, pillow covers, blankets, pet bandanas and more. Bring it in or we'll source it. Caps: ask first. Priced by print size." },
  { id: "s5", name: "Custom Tote Bag", price: 18, unit: "flat", cat: "apparel", kind: "tote", tiers: [[12, 14]], desc: "Heavy cotton tote printed in full colour. Markets, teachers, gifts and giveaways. $14 each for 12+." },
  { id: "s6", name: "DTF Transfers — Press Them Yourself", price: 4, unit: "from", cat: "apparel", kind: "transfer", feat: true, desc: "Ready-to-press transfers of your design for your own heat press. Pocket or left-chest size from $4, full front (up to 11 in) from $10. Pressing instructions included." },
  { id: "s7", name: "DTF Gang Sheet (13 × 19 in)", price: 25, unit: "flat", cat: "apparel", kind: "transfer", tiers: [[5, 22]], desc: "Fill a 13 × 19 in sheet with as many designs as fit, printed and powdered, ready to press. Send your files and we'll help with the layout. $22 each for 5+." },

  { id: "a1", name: "Black Acrylic Award", price: 55, unit: "flat", cat: "awards", kind: "award", desc: "Black or coloured acrylic, engraved in crisp contrast. Tournaments, banquets, staff awards." },
  { id: "a2", name: "Metal Plaque", price: 50, unit: "flat", cat: "awards", kind: "card", desc: "Engraved aluminum or brass plate on a wood backer." },
  { id: "a3", name: "Challenge Coin", price: 20, unit: "flat", cat: "awards", kind: "coaster", img: "images/skull-coin.jpg", desc: "Heavy 4 mm coin with your design engraved in warm gold tones on silver. Crews, teams, clubs and keepsakes." },

  { id: "b1", name: "Metal Business Cards", price: 4, unit: "ea", cat: "biz", kind: "card", feat: true, img: "images/metal-business-card.jpg", min: 25, tiers: [[50, 3.5], [100, 3]], desc: "Black anodized aluminum, engraved both sides. 25 for $100 ($4 each), $3.50 each at 50, $3 each at 100+. Free logo setup." },
  { id: "b2", name: "Equipment & Asset Tags", price: 4, unit: "ea", cat: "biz", kind: "card", min: 10, tiers: [[50, 3.2]], desc: "Serial numbers, QR codes and company info on aluminum or steel. $40 minimum order." },
  { id: "b3", name: "Tool Marking", price: 3, unit: "ea", cat: "biz", kind: "tool", min: 14, tiers: [[50, 2.4]], img: "images/tool-marking-wrench.jpg", desc: "Your company name on the metal of each hand tool. $40 minimum order." },
  { id: "b4", name: "QR Code Tags", price: 5, unit: "ea", cat: "biz", kind: "card", min: 8, tiers: [[50, 4]], desc: "Scannable QR codes for manuals, menus, reviews or inventory. $40 minimum order." },
  { id: "b5", name: "Name Badges", price: 15, unit: "flat", cat: "biz", kind: "card", tiers: [[50, 12]], desc: "Magnetic or pin-back metal badges for staff." },
  { id: "b6", name: "Branded Bottle Openers", price: 7, unit: "ea", cat: "biz", kind: "keychain", min: 25, tiers: [[50, 5.6]], desc: "Steel openers with your logo. Minimum 25 — great client and trade-show handouts." }
];
