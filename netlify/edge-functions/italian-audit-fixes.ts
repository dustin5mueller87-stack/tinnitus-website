/*
 * Collision-safe Italian corrections from the completed one-pass translation audit.
 * Scope is /it/* only. FAQ, open source/research questions, visual/runtime remnants,
 * style-only options remain untouched. The second-episode value is 75%, confirmed by the author.
 */
const VERSION = "2026-09-07-v2";

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}
function replaceRegex(text: string, pattern: RegExp, replacement: string) {
  return text.replace(pattern, replacement);
}

function fixShortBio(html: string) {
  // The author confirmed a faint right-ear tone from the beginning; preserve the reviewed HTML.



  // IHHT was cancelled before the treatment began.
  html = replaceAll(
    html,
    `Ho provato un allenamento simulato in quota (IHHT), che ho dovuto interrompere per il panico,`,
    `Avevo in programma un allenamento simulato in quota (IHHT), ma ho rinunciato prima ancora di iniziare, per il panico,`
  );

  // Keep the intensity of the short biography: no extra "quasi" here.
  html = replaceAll(html, `dall'altra una fascinazione quasi delirante.`, `dall'altra una fascinazione delirante.`);

  // Doctors recommend white-noise masking as a method, not Dustin's extreme test conditions.
  html = replaceAll(
    html,
    `(esattamente quello che i medici consigliano per il mascheramento)`,
    `(il rumore bianco, cioè il tipo di suono che i medici consigliano per il mascheramento)`
  );

  // "Physically dead" means temporarily functionally silent/energetically depleted, not biological cell death.
  html = replaceAll(
    html,
    `per qualche secondo la cellula è fisicamente morta e «muta» (periodo refrattario)`,
    `per qualche secondo la cellula è completamente fuori uso e «muta» (periodo refrattario)`
  );

  // Preserve the spatial reaction in the suction episode, not only immediacy.
  html = replaceAll(
    html,
    `Proprio in quell'istante il mio acufene è esploso, come risposta fisica e immediata a quello stimolo sonoro!`,
    `Proprio in quell'istante il mio acufene è esploso, reagendo fisicamente e proprio in quel punto a quello stimolo sonoro!`
  );

  // German says the body could repair, not that repairs specifically began that night.
  html = replaceAll(
    html,
    `e durante la notte il mio corpo ha potuto avviare le riparazioni.`,
    `e durante la notte il mio corpo ha potuto ripararsi.`
  );
  return html;
}

function fixApproach(html: string) {
  // Keep the already correct fixed title "Il mio approccio alla soluzione".
  // Remove the locally added audiogram improvement clause from the noise conclusion.
  html = replaceAll(
    html,
    `; gli audiogrammi del mio primo episodio ne confermano il miglioramento`,
    ``
  );
  html = replaceAll(
    html,
    `, gli audiogrammi del mio primo episodio ne confermano il miglioramento`,
    ``
  );
  return html;
}

function fixProducts(html: string) {
  // Current local Person description does not include the older additional full-conflict-resolution clause.
  html = replaceAll(
    html,
    `e come un lavoro mirato sui conflitti lo abbia aiutato a risolvere completamente questi conflitti e a riportare in equilibrio il proprio sistema nervoso autonomo.`,
    `e come un lavoro mirato sui conflitti lo abbia aiutato a riportare in equilibrio il proprio sistema nervoso autonomo.`
  );

  // Author meaning: no surcharge through Dustin's link, not a general market-price guarantee.
  html = replaceAll(
    html,
    `Per te il prezzo resta esattamente lo stesso – tramite il mio link i prodotti costano esattamente quanto tramite qualsiasi altro canale ufficiale.`,
    `Per te il prezzo resta esattamente lo stesso: acquistando tramite il mio link non paghi alcun sovrapprezzo.`
  );

  // Historical 3 mg routine, not a verified current dose.
  html = replaceAll(
    html,
    `Da anni assumo regolarmente 3 mg di melatonina la sera, in aggiunta al complesso di minerali.`,
    `Per anni ho assunto regolarmente 3 mg di melatonina la sera, in aggiunta al complesso di minerali.`
  );
  return html;
}

function fixTestimonials(html: string) {
  // Restore the current German introduction: independent people worldwide, without turning every card into a tinnitus cure claim.
  const oldIntro = `Qui raccolgo testimonianze accessibili al pubblico che ho trovato durante le mie ricerche in varie lingue e su forum e piattaforme differenti. Nel loro insieme, le testimonianze raccolte sull'acufene mostrano cambiamenti positivi in relazione a un approccio basato sui nutrienti; tuttavia, non tutte le schede raccontano un caso di acufene, perché la raccolta contiene anche contributi di approfondimento e testimonianze relative ad altri disturbi. A distanza non si può valutare quale effetto abbia avuto, nel singolo caso, l'approccio descritto di volta in volta — devi decidere tu che cosa pensarne.`;
  const newIntro = `Qui raccolgo testimonianze accessibili al pubblico che ho trovato durante le mie ricerche in varie lingue, su forum e piattaforme differenti. Mostrano che persone di tutto il mondo, indipendentemente le une dalle altre e senza conoscersi, raccontano esperienze simili con l'acufene e con un approccio basato sui nutrienti. Quale effetto abbiano esattamente questi contributi nel singolo caso non si può valutare a distanza: sta a te decidere che cosa pensarne.`;
  html = replaceAll(html, oldIntro, newIntro);
  return html;
}

function fixContact(html: string) {
  // Exactly three description fields lose the solution orientation in the audit.
  html = replaceAll(
    html,
    `Contatti di Dustin Müller: scrivimi pure se hai domande sulla mia storia o sui miei approcci.`,
    `Contatti di Dustin Müller: scrivimi pure se hai domande sulla mia storia o sui miei approcci alla soluzione.`
  );
  return html;
}

function fixNoise(html: string) {
  // The author confirmed a faint right-ear tone from the beginning; preserve the reviewed HTML.



  // Local geometry: individual stereocilia become misaligned, not the whole bundle uniformly tilting.
  html = replaceAll(
    html,
    `Confronto tra ciglia sensoriali sane e danneggiate nell'orecchio interno: a sinistra ciglia dritte come candele, a destra un fascio inclinato con i tip-link tesi in permanenza e il canale ionico troppo aperto`,
    `Confronto tra ciglia sensoriali sane e danneggiate nell'orecchio interno: a sinistra ciglia dritte come candele, a destra singole stereociglia localmente disallineate, con una tensione anomala sui tip-link e il canale ionico troppo aperto`
  );
  html = replaceAll(
    html,
    `A sinistra, la situazione normale; a destra, dopo un danno da rumore: il fascio di ciglia si inclina, i tip-link restano costantemente in tensione e il canale rimane più aperto.`,
    `A sinistra, la situazione normale; a destra, dopo un danno da rumore: singole stereociglia sono localmente disallineate, i tip-link sono sottoposti a una tensione anomala e il canale rimane più aperto.`
  );

  // Restore the current general onset statement instead of a page-local autobiographical rewrite.
  html = replaceAll(
    html,
    `Un acufene da rumore può farsi notare subito dopo l'evento sonoro, ma può anche essere percepito consapevolmente solo ore o giorni più tardi. Nel mio caso il suono si è fatto notare soltanto il terzo giorno; ancora oggi non so con certezza perché. Nelle domande frequenti descriverò espressamente le possibili spiegazioni come ipotesi.`,
    `Nella maggior parte delle persone colpite l'acufene compare relativamente presto dopo l'evento sonoro — nel giro di minuti o di poche ore. Esistono però anche casi in cui compare solo dopo diverse ore o perfino giorni. Nelle domande frequenti spiego in dettaglio perché questa tempistica può variare e quale ruolo possono avere determinate strutture dell'orecchio.`
  );
  return html;
}

function fixMedication(html: string) {
  // Preserve the rate relationship: the pumps cannot remove calcium quickly enough, not necessarily stop completely.

  // Restore the lay gloss already present in German.

  return html;
}

function fixStress(html: string) {
  // Current local opening: gradual release of deep internal tensions.
  html = replaceAll(
    html,
    `Soltanto il suo lavoro mi ha aiutato moltissimo a risolvere completamente i conflitti della mia fase di CFS e psicosomatica e a riportare in equilibrio il mio sistema nervoso autonomo.`,
    `Solo il suo lavoro mi ha aiutato allora a sciogliere poco a poco quelle tensioni interiori così radicate.`
  );

  // Restore the locally decided strong author statement before the table of contents.
  html = replaceAll(
    html,
    `Secondo il mio modello esplicativo, l'acufene da stress può insorgere quando un conflitto emotivo irrisolto mantiene costantemente iperattivo un focolaio centrale del conflitto e attiva anche le vie che elaborano i suoni. È la mia sintesi dell'approccio di Prgomet e Klinghardt, di casi altrui e delle mie ricerche — non è immaginazione.`,
    `Oggi posso dirlo: l'acufene da stress non è un mistero e non è nemmeno immaginazione. È la conseguenza udibile di uno stato elettrico persistente nel cervello, provocato da conflitti che non sono mai stati davvero risolti. Quando si capisce che cosa succede, si capisce anche perché quel suono c'è e che cosa si può fare in prima persona.`
  );

  // Restore the local field-threshold sequence while preserving the author-model framing.
  html = replaceRegex(
    html,
    /<p><strong>Quarto, attraverso piccoli effetti di campo elettrico\.<\/strong>[^<]*?<\/p>/,
    `<p><strong>Quarto, attraverso piccoli effetti di campo elettrico.</strong> Quando molte cellule nervose in una piccola area sono attive contemporaneamente e in modo sincronizzato, si formano campi elettrici locali. Sono piccoli, ma reali, e possono effettivamente spingere le cellule vicine oltre la soglia, facendo sì che inizino a scaricare a loro volta.</p>`
  );

  // The removed German HPA paragraph should not survive only in Italian at this local point.
  html = replaceRegex(
    html,
    /\s*<p><strong>Importante per distinguere bene i meccanismi:<\/strong> l[^<]*asse HPA[^<]*<\/p>/,
    ''
  );

  // Duration is a decisive clue in the current local German source.
  html = replaceAll(
    html,
    `Il fatto che un sintomo persista anche in assenza di stress acuto non indica, di per sé, una causa specifica; nell'ambito di questo modello, un'attività centrale anomala persistente può rappresentare una possibile spiegazione.`,
    `Un indizio decisivo è la durata: se un sintomo persiste anche in assenza di stress acuto, di solito è presente un'attività elettrica anomala cronica nel sistema nervoso.`
  );
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  const p = pathname.replace(/\.html$/, '').replace(/\/$/, '');
  switch (p) {
    case '/it/acufene-la-mia-esperienza': return fixShortBio(html);
    case '/it/acufene-il-mio-approccio': return fixApproach(html);
    case '/it/prodotti': return fixProducts(html);
    case '/it/testimonianze': return fixTestimonials(html);
    case '/it/contatti': return fixContact(html);
    case '/it/acufene-da-trauma-acustico': return fixNoise(html);
    case '/it/acufene-da-farmaci-ototossici': return fixMedication(html);
    case '/it/acufene-da-stress': return fixStress(html);
    default: return html;
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  const response = await context.next();
  const type = response.headers.get('content-type') || '';
  if (!type.toLowerCase().includes('text/html')) return response;
  const original = await response.text();
  const fixed = applyPathFixes(url.pathname, original);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-it-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/it/*' };
export { applyPathFixes };
