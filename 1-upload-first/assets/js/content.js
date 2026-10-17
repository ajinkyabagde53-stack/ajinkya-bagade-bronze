/* ============================================================
   CONTENT. Edit copy, numbers and lists here; site.js renders them.
   Internal paths are relative to the site root.
   ============================================================ */

/* The fly-through: "Six signals", one stop per discipline */
window.SIGNALS = [
  { id:"writer", label:"Writer", line:"Where it started: how one line stops a scroll." },
  { id:"performance", label:"Performance", line:"₹89L+ across Google and Meta, read for decisions." },
  { id:"social", label:"Social", line:"53K+ organic views, with zero paid spend." },
  { id:"email", label:"Email", line:"Lifecycle flows where no enquiry slips through." },
  { id:"design", label:"Design", line:"Collateral for luxury homes, brief to final file." },
  { id:"ai", label:"AI & tools", line:"Agents and tools built from scratch, live in the browser." }
];
/* [signal, image or "card", caption or card title, width factor or card line] */
window.PLANES = [
  ["writer","img/wanderwitty.jpg","WanderWitty · personal blog",.9],
  ["writer","card","Agentic AI vs traditional SEO","WanderWitty · June 2025"],
  ["writer","img/meta-awareness-2.jpg","Novel Office · brand voice",1],
  ["performance","img/google-ads.jpg","Google Ads · ₹82.5L managed",1.5],
  ["performance","img/orra-dash.jpg","ORRA · funnel-stage KPIs",1.1],
  ["performance","img/meta-retargeting.jpg","Meta · retargeting",.9],
  ["social","img/render-3.jpg","NSH · chef's kitchen",1],
  ["social","img/render-1.jpg","NSH · al fresco",.9],
  ["social","img/render-4.jpg","NSH · bath & vanity",.9],
  ["email","card","Pine Chase · Delivered","Property announcement email"],
  ["email","card","Heatherglen · Listing","Premium positioning, direct enquiries"],
  ["design","img/brochure-whiteoak.jpg","2436 White Oak Drive",1.4],
  ["design","img/orra-tofu.jpg","ORRA · top of funnel",.7],
  ["design","img/brochure-amherst.jpg","3224 Amherst",1.3],
  ["design","img/brochure-potomac.jpg","The Potomac Collection",1.2],
  ["ai","img/cockpit.jpg","Performance Cockpit",1.5],
  ["ai","img/waypoint.jpg","Waypoint · QR studio",.8],
  ["ai","card","Overseer","Autonomous YouTube agent · in development"]
];
/* Brochures. kind "book" turns pages on a spine; "trifold" unfolds panel by panel.
   pages live in brochures/pages/<id>/01.jpg ... ; stacked = both sheets on one page, outside on top */
window.BROCHURES = [
  { id:"whiteoak", title:"2436 White Oak Drive", kind:"book", n:11, ar:1123/794, cover:"img/brochure-whiteoak.jpg",
    type:"Residence book · 11 pages", note:"The residence book for a 4,718 sq ft craftsman in Woodland Heights, Houston." },
  { id:"amherst", title:"3224 Amherst", kind:"book", n:6, ar:842/595, cover:"img/brochure-amherst.jpg",
    type:"Listing book · 6 pages", note:"A listing in University Park, Dallas, offered at $4,894,000." },
  { id:"potomac", title:"The Potomac Collection", kind:"book", n:11, ar:842/595, cover:"img/brochure-potomac.jpg",
    type:"Collection book · 11 pages", note:"Contemporary residences on Potomac Drive, Westhaven Estates, Houston." },
  { id:"nsh-trifold", title:"Novel Signature Homes", kind:"trifold", stacked:true, ar:1124/810, cover:"brochures/pages/nsh-trifold/01.jpg",
    type:"Tri-fold · 6 panels", note:"Three new residences in Houston, plus the homes already delivered." },
  { id:"novelgroup", title:"Novel Group 2026", kind:"trifold", ar:1126/796, cover:"img/brochure-novelgroup.jpg",
    type:"Tri-fold · 6 panels", note:"Move-in-ready homes across Virginia, Pennsylvania and Maryland." },
  { id:"pinnacle", title:"Renovated Property Collection", kind:"trifold", ar:3508/2480, cover:"img/brochure-pinnacle.jpg",
    type:"Tri-fold · 6 panels", note:"Three renovated homes across Plano and North Dallas." },
  { id:"marwick", title:"3605 Marwick Drive", kind:"book", n:4, ar:1200/1697, cover:"brochures/pages/marwick/01.jpg",
    type:"Listing booklet · 4 pages", note:"A renovated single-story home in Plano's Silverwood neighbourhood." },
  { id:"nsh-guidelines", hidden:true, title:"Novel Signature Homes brand guidelines", kind:"book", n:27, ar:16/9, cover:"brochures/pages/nsh-guidelines/01.jpg",
    type:"Brand guidelines · FY 2024 · 27 pages", note:"Brand overview, logo, colour, typography and applications, in one document the whole team works from." },
  { id:"genstar", title:"6527 Genstar Lane", kind:"book", n:4, ar:1200/1697, cover:"brochures/pages/genstar/01.jpg",
    type:"Listing booklet · 4 pages", note:"A renovated one-story home with a pool in Preston Highlands, North Dallas." }
];

window.CASES = {
  orra:{ title:"Selling a €30,000 motorcycle nobody has heard of", type:"Paid media · Google & Meta · landing page",
    full:"case-studies/electric-motorcycle-paid-acquisition/",
    problem:"A long, offline, high-consideration sale that early ROAS can't see. So the whole account is built around cost per qualified lead, not clicks.",
    body:["A 90-day paid acquisition plan for a hand-built premium electric motorcycle across Germany, Belgium, the Netherlands and France, where the click is only the beginning and the sale happens in a showroom, months later.","Budget architecture, funnel-stage KPIs, a localised search account, three funnel-stage creatives and a live landing page built as the brand's own site."],
    figs:[["€10K","monthly plan"],["€6K / €4K","Google / Meta split"],["4","markets"],["3","funnel-stage creatives"]],
    disc:"Speculative concept brand. No live spend and no results claimed.",
    gal:[["img/orra-tofu.jpg",9/16],["img/orra-mofu.jpg",9/16],["img/orra-bofu.jpg",9/16]], wide:"img/orra-landing.jpg",
    panels:[["Read the full case study","page","case-studies/electric-motorcycle-paid-acquisition/","ORRA · full case study"],["Open the landing page","page","paid-ads/electric-motorcycle/","ORRA · landing page"]] },
  cockpit:{ title:"The Performance Cockpit", type:"Decision tool · built and live",
    problem:"Ad platforms report what happened, never what to do next. So the real decisions stayed manual and easy to get wrong.",
    body:["Running paid media across Microsoft, Google and Meta, I spent the first days of every month exporting reports and hunting for the story the averages hid: a campaign with a respectable cost per lead quietly burning budget on zero-lead ad groups, two of my own keywords bidding against each other, search terms I never chose draining spend.","So I built the decision layer the platforms don't give you. The Cockpit reads the same exports in the browser, diagnoses where the funnel breaks, and ranks the moves worth making by the rupees at stake. Every campaign gets a verdict: feed it, tighten it, cut it, or investigate it."],
    steps:["Measure: read platform exports in the browser","Diagnose: find exactly where the funnel breaks","Rank: order moves by rupees at stake"],
    figs:[["₹1,902","CPL in the sample period"],["3.8×","over the ₹500 target"],["₹26,331","top move: reallocate"]],
    disc:"Figures are from the tool's sample Microsoft Ads period.", wide:"live:performance-cockpit/|1280|560",
    chips:["Microsoft Ads","Google Ads","Meta Ads","JavaScript","Funnel analysis","Decision design"],
    panels:[["Open the live cockpit","tool","cockpit"]] },
  collateral:{ title:"Luxury real estate marketing materials", type:"Design · brochures, decks, digital assets",
    problem:"Luxury developments were reaching buyers through inconsistent, off-brand sales materials.",
    body:["I designed and produced the collateral for luxury residential developments across Texas, Virginia, Pennsylvania and Maryland: brochures, presentations, sales decks and digital assets, from brief to final delivery.","Formats run from four-page listing booklets and three tri-folds to an eleven-page residence book for a 4,718 sq ft craftsman in Houston's Woodland Heights, and a listing offered at $4,894,000 in University Park, Dallas. Pick any piece below to turn its pages."],
    figs:[["8","pieces in the suite"],["11","pages, White Oak"],["$4.89M","top listing"]],
    brochures:true },
  nsh:{ title:"A content engine from zero · Novel Signature Homes", type:"Social · work in progress",
    problem:"The channels ran on loose, unengaging renders and no video at all. The assets existed; nothing made a scrolling buyer stop.",
    body:["I rebuilt the channels into a content engine: researching and ideating stronger renders, collaborating on property showreels, and writing the social plans that gave all three platforms a rhythm. Grown entirely through organic content. Paid search is launching now."],
    steps:["Elevate and plan: MLS renders repurposed for social, with a content calendar","Pivot to video: after Meta's Andromeda update, a drone, directed shoots and vendor sessions","Staging and scale: property staging unlocking premium content"],
    figs:[["37.6K","Instagram views · 4.3K reach"],["9.8K","YouTube views · 23.6 hrs watched"],["5.8K","Facebook views"],["53K+","total organic views"]],
    gal:[["img/render-1.jpg",1],["img/render-2.jpg",1],["img/render-3.jpg",1],["img/render-4.jpg",1],["img/render-5.jpg",1]] },
  paid:{ title:"Paid acquisition across Google and Meta", type:"Performance · Jun 2025 to Jun 2026",
    problem:"Two platforms, two jobs: Google for high-intent demand, Meta for efficient reach and lead capture.",
    body:["Full-funnel paid acquisition across Google Search, Display and Video, and Meta awareness, retargeting and lead-gen campaigns: account structure, audience strategy, creative testing and reporting."],
    figs:[["₹82.5L","Google spend · 11 campaigns"],["5,280","Google conversions · ₹1,562 CPA"],["₹6.71L","Meta spend"],["1,237","Meta leads · ₹542 CPL"],["₹329","best single-campaign CPL"],["4.2×","Meta frequency"]],
    gal:[["img/meta-awareness-1.jpg",1],["img/meta-awareness-3.jpg",1],["img/meta-retargeting.jpg",1],["img/meta-leadgen.jpg",1]], wide:"img/google-ads.jpg" },
  nshbrand:{ title:"The Novel Signature Homes brand foundation", type:"Brand guidelines · voice · FY 2024",
    problem:"Luxury homes are bought on feeling and on trust. The brand needed one look and one voice that carried both, on every brochure, post and sign.",
    body:["The brand guidelines set out how Novel Signature Homes looks and sounds across digital and print: a brand overview with the story, mission, vision, values and personality; the primary and secondary logos with usage rules, do's and don'ts and variations; the colour palette; the type system; and the brand applied to stationery and social media.",
      "The palette is deliberately short: White, Light Beige and Charcoal Black, so every piece reads as the same house. The type pairs Luxia, an art deco-inspired serif with sharp lines for luxury and editorial moments, with Albert Sans, a clean sans-serif that keeps body copy readable in print and on screen.",
      "The voice came from working through all twelve brand archetypes against how the company designs, builds and sells. The Creator leads: homes as carefully crafted experiences, told in a warm, refined, story-led voice. The Ruler is the secondary shade: quiet confidence and white-glove reassurance for buyers making a high-value decision in Houston's luxury market."],
    steps:["Brand overview: story, mission, vision, values, personality","Logo: primary and secondary, usage, do's and don'ts, variations","Colour: White #FEFEFE, Light Beige #DFCBB6, Charcoal Black #1A1A1A","Typography: Luxia for display, Albert Sans for text","Voice: The Creator, with The Ruler as the secondary shade","Applications: stationery and social media"], stepsTitle:"What the foundation covers",
    figs:[["27","pages of guidelines"],["3","colours in the palette"],["2","typefaces"],["12","archetypes assessed for the voice"]],
    gal:[["brochures/pages/nsh-guidelines/06.jpg",16/9],["brochures/pages/nsh-guidelines/15.jpg",16/9],["brochures/pages/nsh-guidelines/17.jpg",16/9],["brochures/pages/nsh-guidelines/23.jpg",16/9]],
    chips:["Brand guidelines","Logo system","Colour and type","Brand archetypes","Voice and tone"],
    panels:[["Turn the pages of the guidelines","flip","nsh-guidelines"],["See the brand in print: the NSH tri-fold","flip","nsh-trifold"]] },
  lifecycle:{ title:"A lifecycle marketing system", type:"Automation · lead management",
    problem:"Enquiries arrived from forms and email with no defined path. Some waited days; some slipped through entirely.",
    body:["A structured lead management system that handles every enquiry, from a website form or a direct email through to full team notification and follow-up. Every step is defined and every person knows their role.","On contact, a thank-you email goes out automatically, alongside onboarding, re-engagement and retention flows with segmentation and A/B testing."],
    steps:["Admin filter","ERP entry","Marketing handoff","Engagement summary","Full team briefing"], stepsTitle:"Enquiry pipeline", chips:["Mailchimp","ERP","Segmentation","A/B testing"],
    emails:true },
  waypoint:{ title:"Waypoint · a dynamic QR studio", type:"Product · edge / serverless",
    problem:"A printed QR is permanent, but the link behind it isn't. And a contact QR that makes people retype your details usually gets ignored.",
    body:["Waypoint runs on a single Cloudflare Worker. Dynamic codes point at a redirect I can re-target anytime without reprinting; hosted vCards save to contacts in one tap; instant static codes cover URL, text and Wi-Fi. No server to babysit."],
    wide:"live:waypoint/|1100|760", chips:["Cloudflare Workers","KV store","Dynamic QR","vCard"], panels:[["Open Waypoint","tool","waypoint"]] },
  overseer:{ title:"Overseer · an autonomous YouTube agent", type:"AI agent · in development",
    problem:"Most content ideas start from a hunch. Overseer starts from what the evidence on YouTube says is missing.",
    body:["An AI content operating system for a YouTube channel. It researches a topic or reference channels, infers the territory, maps winners and gaps, and ranks opportunities by audience demand and commercial intent, scored separately. Ideas without supporting videos are labelled hypotheses.","Picked opportunities become a brief, script, production plan, thumbnail concepts and a QA report, and published results feed the next round.","The B2B content intelligence work is the same project: the research foundation Overseer was built on, from expert analysis, LinkedIn posts, transcripts and gap identification."],
    steps:["Channel intelligence or prompt-to-brief","Territory inference with evidence","Wider YouTube validation","Landscape: winners, breakouts, gaps","Ranked opportunities","Production assets and QA","Learning loop from analytics"],
    chips:["Python","YouTube Data & Analytics APIs","Anthropic API"] }
};

/* Live tools that open in the side panel */
window.TOOLS = {
  cockpit:{ title:"Performance Cockpit", src:"performance-cockpit/", width:1320 },
  waypoint:{ title:"Waypoint · QR studio", src:"waypoint/", width:1100 }
};

window.MORE = [
  ["nshbrand","Novel Signature Homes brand foundation","Brand guidelines · voice","brochures/pages/nsh-guidelines/01.jpg"],
  ["waypoint","Waypoint · dynamic QR studio","Product · Cloudflare Workers","live:waypoint/|1100"],
  ["overseer","Overseer · autonomous YouTube agent","AI agent · in development","img/overseer-concept.svg"]
];

/* MORE's 4th field is the hover preview: an image path, or live:<page>|<render width> for a live, scaled page */
/* [image, label, filter, aspect ratio, brochure id to open as a flipbook] */
window.ARCHIVE = [
  ["img/brochure-whiteoak.jpg","2436 White Oak Drive · residence book","brochures",1715/1213,"whiteoak"],
  ["img/render-3.jpg","NSH · chef's kitchen render","renders",1],
  ["img/meta-awareness-1.jpg","Novel Office · awareness","ads",1],
  ["img/brochure-amherst.jpg","3224 Amherst · listing book","brochures",1121/791,"amherst"],
  ["img/orra-tofu.jpg","ORRA · top of funnel","ads",720/1280],
  ["img/render-1.jpg","NSH · al fresco dining","renders",1],
  ["img/brochure-potomac.jpg","The Potomac Collection","brochures",1118/790,"potomac"],
  ["img/meta-retargeting.jpg","Novel Office · retargeting","ads",1],
  ["img/render-2.jpg","NSH · primary suite","renders",1],
  ["img/orra-mofu.jpg","ORRA · middle of funnel","ads",720/1280],
  ["img/brochure-marwick.jpg","3605 Marwick Drive · listing booklet","brochures",1118/790,"marwick"],
  ["img/meta-leadgen.jpg","Novel Office · lead generation","ads",1],
  ["img/render-4.jpg","NSH · bath & vanity","renders",1],
  ["img/brochure-pinnacle.jpg","Renovated Property Collection · tri-fold","brochures",1118/790,"pinnacle"],
  ["img/orra-bofu.jpg","ORRA · bottom of funnel","ads",720/1279],
  ["img/meta-awareness-2.jpg","Novel Office · awareness","ads",1],
  ["img/render-5.jpg","NSH · game room","renders",1],
  ["img/brochure-novelgroup.jpg","Novel Group 2026 · tri-fold","brochures",1721/1217,"novelgroup"],
  ["img/meta-awareness-3.jpg","Novel Office · awareness","ads",1],
  ["img/brochure-genstar.jpg","6527 Genstar Lane · listing booklet","brochures",1118/790,"genstar"],
  ["img/orra-landing.jpg","ORRA · landing page","ads",1200/630]
];

window.EMAILS = [["Pine Chase","emails/pine-chase.html"],["1001 E","emails/1001-e.html"],["Heatherglen","emails/heatherglen.html"],["Marwick","emails/marwick.html"],["Genstar","emails/genstar.html"]];

/* WanderWitty, the personal blog */
window.POSTS = [
  ["Why agentic AI could end traditional search marketing","Jun 2025","https://wanderwitty.wordpress.com/2025/06/15/agentic-ai-vs-traditional-seo/"],
  ["Ethical marketing and sustainability: Nestlé India","May 2025","https://wanderwitty.wordpress.com/2025/05/14/nestle-india-ethical-marketing-sustainability/"],
  ["International business strategy amid global high-risk events: Airtel, Tata, COVID-19 and Brexit","May 2025","https://wanderwitty.wordpress.com/2025/05/14/airtel-covid19-tata-brexit-strategy-case/"],
  ["IKEA's success in glocalising its marketing strategy in China","May 2025","https://wanderwitty.wordpress.com/2025/05/13/ikeas-success-in-glocalizing-its-marketing-strategy-in-china/"]
];
window.ELSEWHERE = [
  ["Buying a home in Texas: 6 things to keep in mind","Novel Dream Homes · Mar 2026","https://noveldreamhomes.com/blog/buying-a-home-in-texas-guide/"],
  ["Woodland Heights, Houston: the neighborhood that rewards the right buyer","Novel Signature Homes","https://novelsignaturehomes.com/blog/woodland-heights-houston-the-neighborhood-that-rewards-the-right-buyer/"]
];
