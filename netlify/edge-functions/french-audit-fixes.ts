/*
 * Collision-safe French translation corrections from the completed one-pass audit.
 * Scope is /fr/* only. German source pages and the unfinished FAQ are never changed.
 * Open image/source/render questions and disputed second-episode percentages remain untouched.
 */
const VERSION = "2026-09-07-v2";

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}
function replaceRegex(text: string, pattern: RegExp, replacement: string) {
  return text.replace(pattern, replacement);
}

function commonFixes(html: string) {
  // German navigation says "Lösungsansatz": keep the solution direction, not merely "démarche".
  html = replaceAll(html, '>Ma démarche</a>', '>Ma démarche pour en sortir</a>');
  // Preserve causal strength where German says stress-/medication-induced.
  html = replaceAll(html, 'Acouphènes liés au stress', 'Acouphènes dus au stress');
  html = replaceAll(html, 'Acouphènes liés aux médicaments et aux substances toxiques', 'Acouphènes dus aux médicaments et aux substances toxiques');
  return html;
}

function fixNoise(html: string) {
  // Current German source: no right-ear tinnitus on day 3; the second ear joined only later.
  html = replaceAll(
    html,
    'c’est précisément ainsi que mon état s’est aggravé et que le bip à droite est devenu nettement plus fort.',
    'c’est précisément ainsi que mon état s’est aggravé et que l’oreille droite a été entraînée à son tour.'
  );
  // Restore the general source statement about onset timing instead of a page-local autobiographical rewrite.
  html = replaceAll(
    html,
    'Les acouphènes causés par le bruit peuvent être remarqués immédiatement après l’exposition sonore, ou n’être perçus consciemment que plusieurs heures, voire plusieurs jours plus tard. Dans mon cas, je n’ai remarqué le son que le troisième jour ; je ne sais toujours pas exactement pourquoi. Dans la FAQ, je présenterai explicitement les explications possibles comme des hypothèses.',
    'Chez la plupart des personnes concernées, les acouphènes apparaissent relativement peu de temps après l’exposition sonore — en quelques minutes ou quelques heures. Il existe toutefois aussi des cas où ils n’apparaissent que plusieurs heures, voire plusieurs jours plus tard. J’explique en détail dans la FAQ pourquoi ce délai peut varier et quel rôle certaines structures de l’oreille peuvent jouer.'
  );
  // The image describes local stereocilia misalignment, not a uniformly tilted whole bundle.
  html = replaceAll(
    html,
    'Comparaison de cils sensoriels sains et endommagés dans l’oreille interne : à gauche, des cils parfaitement droits ; à droite, un faisceau incliné avec des tip-links constamment tendus et un canal ionique trop ouvert',
    'Comparaison de cils sensoriels sains et endommagés dans l’oreille interne : à gauche, des cils parfaitement droits ; à droite, certains stéréocils sont localement mal positionnés, avec une tension anormale sur les tip-links et un canal ionique trop ouvert'
  );
  html = replaceAll(
    html,
    'À gauche, l’état normal ; à droite, après un dommage dû au bruit : le faisceau de cils s’incline, les tip-links restent constamment tendus et le canal reste davantage ouvert.',
    'À gauche, l’état normal ; à droite, après un dommage dû au bruit : certains stéréocils sont localement mal positionnés, les tip-links subissent une tension anormale et le canal reste davantage ouvert.'
  );
  // Restore the source's animal-study details; do not add a human-efficacy disclaimer not present in this block.
  html = replaceRegex(
    html,
    /<p>Fait intéressant, des recherches portent elles aussi sur l’augmentation de l’énergie cellulaire \(ATP\), une piste proche de mon modèle explicatif\.[\s\S]*?La thérapie laser de faible intensité \(photobiomodulation\) vise elle aussi cette approche énergétique fondamentale \(<a href="\/fr\/sources-scientifiques">état des recherches sur l’AC102 — voir ma page des sources →<\/a>\)\.<\/p>/,
    '<p>Fait intéressant, ce principe — l’augmentation de l’énergie cellulaire (ATP) — est également étudié dans la recherche pharmaceutique, ce qui soutient mon modèle explicatif (même si l’effet ATP/ROS n’a jusqu’ici été montré qu’en culture cellulaire). Le médicament AC102 cible précisément ce mécanisme : dans un modèle animal chez la gerbille de Mongolie, un comportement de type acouphène a presque entièrement régressé au cours des cinq semaines suivant une seule dose d’AC102 — à la fin, 1 animal sur 15 seulement était encore concerné, contre une grande partie du groupe placebo —, mesuré par le réflexe de sursaut GPIAS, un corrélat comportemental reconnu des acouphènes. Chez l’être humain, une étude clinique de phase 2 est actuellement en cours, avec des résultats attendus en 2026 (<a href="/fr/sources-scientifiques">état des recherches sur l’AC102 — voir ma page des sources →</a>). La thérapie laser de faible intensité (photobiomodulation) vise elle aussi cette approche énergétique fondamentale.</p>'
  );
  // Restore the direct German conclusion instead of an editorial menu of peripheral-source possibilities.
  html = replaceAll(
    html,
    'Dans mon modèle principal, voici ce qu’est, sur le plan physiologique, l’acouphène chronique causé par le bruit : un signal erroné actif issu d’un tissu périphérique encore excitable. Pour mes propres épisodes, je suppose que la source principale se trouvait dans des cellules ciliées internes vivantes, bloquées dans un mode de fonctionnement énergétique d’urgence ; je considère possible une implication du nerf auditif ou de la myéline, mais je ne peux pas l’établir avec certitude dans mon cas. Le cerveau ne crée pas le son à partir d’une absence totale de signal ; il amplifie le signal erroné déjà présent.',
    'Voici ce qu’est réellement, sur le plan physiologique et selon ma conviction, l’acouphène chronique causé par le bruit : une cellule vivante, bloquée dans un mode d’urgence énergétique, dont la réparation reste en grande partie figée en phase 1 parce que l’énergie nécessaire à la phase 2 manque. L’oreille n’est pas « cassée » et le cerveau n’invente pas un signal fantôme. Le son est le résultat d’une véritable lutte périphérique pour la survie, que le cerveau ne fait qu’amplifier.'
  );
  html = replaceAll(html, 'sur la page consacrée à ma démarche,', 'sur la page consacrée à ma démarche pour en sortir,');
  html = replaceAll(html, '>Comment j’y suis arrivé — ma démarche</div>', '>Comment j’y suis arrivé — ma démarche pour en sortir</div>');
  // German says clarify/examine possible organic causes, not exclude them as a foregone endpoint.
  html = replaceAll(html, 'afin d’écarter des causes organiques.', 'afin de faire examiner d’éventuelles causes organiques.');
  html = replaceAll(html, 'en particulier s’ils sont apparus soudainement', 'en particulier s’ils sont apparus de façon aiguë');
  return html;
}

function fixGift(html: string) {
  // Keep the German update date.
  html = replaceAll(html, 'Dernière mise à jour : août 2026', 'Dernière mise à jour : juin 2026');
  // Restore Dustin's own-source framing instead of an added defensive rewrite.
  html = replaceAll(
    html,
    'Moi aussi, à l’époque, j’ai été touché par des acouphènes extrêmes, infernaux. Mes deux épisodes d’acouphènes étaient entièrement dus au bruit ; je n’ai moi-même jamais eu d’acouphènes dus à des médicaments ou à des substances toxiques. Le bruit constant restait malgré tout une attaque permanente contre mes nerfs, mon sommeil et toute ma vie. Cette page présente donc mon modèle de recherche et de mise en relation, ainsi que des éléments issus de la pratique ; ce n’est pas le récit de ma propre guérison d’acouphènes dus à une substance toxique.',
    'Moi aussi, à l’époque, j’étais touché par des acouphènes extrêmes, infernaux. Dans mon cas, ils étaient alors exclusivement dus au bruit (et non déclenchés par un événement médicamenteux aigu), mais ce son permanent était exactement la même attaque continue contre mes nerfs, mon sommeil et toute ma vie. Les médecins me disaient souvent, à moi aussi, que je devais simplement apprendre à vivre avec.'
  );
  html = replaceAll(
    html,
    'J’écris cet article sur les déclencheurs chimiques parce que ce sujet joue depuis 2012 un rôle important dans mes propres recherches, notamment en toxicologie et en médecine environnementale. Des médecins environnementaux comme le Dr Klinghardt ou le Dr Mutter rapportent, à partir de leur pratique, que les bruits dans l’oreille peuvent s’atténuer chez certains patients lorsqu’une charge réellement pertinente en substances toxiques ou en métaux lourds est traitée de façon ciblée. Il s’agit d’observations issues de leur pratique, et non d’un effet généralement démontré ni d’une garantie. Ce que je partage correspond à l’état actuel de mes connaissances et sert de base aux démarches expliquées plus loin sur ce site.',
    'J’écris cet article sur les déclencheurs chimiques parce que ce sujet a joué un rôle important dans mes propres recherches. Depuis 2012, je me suis plongé intensément dans la biochimie cellulaire, y compris la toxicologie et la médecine environnementale. Et c’est précisément ici que la boucle se referme : dans la pratique des médecins environnementaux (comme le Dr Klinghardt ou le Dr Mutter), on observe en effet souvent un phénomène fascinant. Lorsqu’une charge cachée en substances toxiques ou en métaux lourds constitue un facteur déterminant chez des patients souffrant d’acouphènes, une détoxification cellulaire ciblée peut souvent entraîner une diminution nette ou perceptible des bruits dans l’oreille. Ce que je partage ici correspond à l’état actuel de mes connaissances issues de ces recherches, et sert de base aux pistes de solution que nous aborderons plus loin sur ce site à partir de ces recherches.'
  );
  html = replaceAll(
    html,
    'Quand nous pensons aux acouphènes, deux images nous viennent le plus souvent immédiatement à l’esprit : le concert assourdissant (le bruit), ou un stress chronique lié à un conflit non résolu ou à un traumatisme, avec un foyer conflictuel central. Dans mon modèle, le stress ordinaire du quotidien et le stress lié à l’axe HPA ou au cortisol ne sont pas une source centrale directe du son. Mais il existe aussi des déclencheurs chimiques : les acouphènes dus aux médicaments ou aux substances toxiques. À mon sens, ce type d’acouphènes est plutôt rare — mais, par souci d’exhaustivité, je veux également exposer ici mon point de vue. Dans le langage spécialisé, on parle d’<strong>ototoxicité</strong> (littéralement : « toxicité pour l’oreille »).',
    'Quand nous pensons aux acouphènes, deux images nous viennent généralement immédiatement à l’esprit : le concert assourdissant (le bruit) ou un stress massif, voire un stress traumatique intérieur (psychosomatique). Il existe cependant un troisième déclencheur, qui n’est ni mécanique ni émotionnel, mais purement chimique : les acouphènes dus aux médicaments ou aux substances toxiques. À mon sens, ce type d’acouphènes est certes l’un des moins représentés, mais, par souci d’exhaustivité, je veux aussi exposer ici ma vision de ce troisième déclencheur. Dans le langage spécialisé, on parle d’<strong>ototoxicité</strong> (littéralement : « toxicité pour l’oreille »).'
  );
  html = replaceAll(
    html,
    'Cela peut sembler abstrait au premier abord, mais l’oreille interne peut être sensible à certaines substances chimiques. Selon la substance, sa forme chimique et la dose, des médicaments ou des polluants environnementaux peuvent atteindre l’oreille interne par la circulation sanguine et y affecter, de différentes manières, les cellules ciliées, la strie vasculaire ou des structures neurales.',
    'Cela peut sembler abstrait au premier abord, mais notre oreille interne est extrêmement sensible à certaines substances chimiques. Certains médicaments ou polluants environnementaux peuvent atteindre directement l’oreille interne par la circulation sanguine et y irriter, voire endommager, les cellules ciliées sensibles ou le nerf auditif.'
  );
  html = replaceAll(html, 'Comment des agents chimiques peuvent favoriser des signaux erronés', 'Le mécanisme : comment la chimie produit des sons');
  // Restore the German mechanism chain as a personal biochemical model instead of a new catalogue of possible pathways.
  html = replaceRegex(
    html,
    /<p>Dans les acouphènes dus à des médicaments ou à des substances toxiques, le résultat final peut lui aussi être un signal aberrant actif[\s\S]*?<p>La hauteur du son perçu peut être liée à la position tonotopique des structures touchées dans la cochlée ou les voies auditives\.[\s\S]*?<\/p>/,
    '<p>Dans les acouphènes dus à des médicaments ou à des substances toxiques, il se passe souvent quelque chose de très similaire au bout de la chaîne, mais le chemin pour y arriver est différent. Il faut se représenter chaque cellule ciliée de l’oreille comme une petite batterie biologique. Elle maintient un équilibre extrêmement fin entre l’énergie (ATP), les minéraux et la tension électrique.</p>\n\n  <p>Les polluants environnementaux ou des doses toxiques de médicaments peuvent perturber cet équilibre délicat en altérant massivement le fonctionnement des centrales énergétiques de la cellule — les mitochondries. Au niveau cellulaire, voici ce qui se passe ensuite selon ma compréhension de la biochimie :</p>\n\n  <p>Comme les mitochondries sont indispensables à l’approvisionnement énergétique de la cellule, le niveau d’énergie de celle-ci — son niveau d’ATP — diminue. Les minuscules pompes de la membrane cellulaire, qui consomment en permanence de l’ATP pour maintenir l’équilibre chimique, n’arrivent alors tout simplement plus à suivre assez vite. Du calcium s’accumule dans la cellule. Comme le calcium est, en biologie, le déclencheur direct de la transmission du signal, cet excès d’ions force la cellule à émettre en permanence et de manière incontrôlée des « signaux erronés ». Pour moi, ce n’est pas un hasard mystique, mais un automatisme biochimique logique. Ce tir électrique permanent est perçu par le cerveau comme un bruit.</p>\n\n  <p>Le son exact que vous entendez — un sifflement aigu, un chuintement ou un bourdonnement grave — dépend le plus souvent simplement de l’endroit précis de la cochlée où se trouvent les cellules ciliées concernées. À ce moment-là, l’oreille n’est généralement pas détruite physiquement, mais son ordre intérieur très fin se dérègle.</p>'
  );
  html = replaceAll(html, 'Une voie neurale supplémentaire possible (nerf auditif et myéline)', 'Les courts-circuits électriques (le nerf auditif)');
  html = replaceAll(
    html,
    'Selon mon modèle issu de mes recherches, certaines expositions toxiques peuvent aussi endommager le nerf auditif ou sa gaine de myéline. Des lésions de la myéline peuvent perturber la conduction et la précision temporelle des signaux neuronaux. Un nerf encore excitable pourrait alors émettre des signaux aberrants ou développer une diaphonie électrique entre ses fibres. C’est une voie supplémentaire possible, pas une certitude pour chaque substance toxique, et cela ne dit rien sur mes propres épisodes d’acouphènes dus au bruit.',
    'Ce ne sont pas seulement les cellules ciliées qui sont menacées, mais aussi le « câble électrique » lui-même — le nerf auditif. Ce nerf est entouré d’une gaine protectrice, la myéline. Cette couche isolante est extrêmement riche en graisses et en minéraux et réagit donc particulièrement fortement aux substances toxiques qui circulent dans le sang. Si cette gaine est affaiblie ou « amincie » par le stress chimique, le nerf ne transmet plus les signaux proprement. De véritables « courts-circuits » électriques apparaissent.'
  );
  html = replaceAll(html, 'ma démarche — qu’ai-je fait concrètement ?', 'ma démarche pour en sortir — qu’ai-je fait concrètement ?');
  return html;
}

function fixStress(html: string) {
  html = replaceAll(html, 'en particulier s’ils sont apparus soudainement', 'en particulier s’ils sont apparus de façon aiguë');
  html = replaceAll(html, 'afin d’écarter des causes organiques.', 'afin de faire examiner d’éventuelles causes organiques.');
  // Restore the early source sequence: Prgomet first, then gradual dissolution of deep tensions.
  html = replaceAll(
    html,
    '<p>J’étais si désespéré que je ne voulais négliger aucune piste. Ce qui m’a aidé à l’époque, ce n’était ni un médicament ni une thérapie classique, mais le travail avec Michael Prgomet, Heilpraktiker et formateur, qui se consacre depuis plus de 30 ans précisément aux mécanismes dont il est question sur cette page. Son travail m’a alors énormément aidé à résoudre complètement les conflits de ma phase de SFC et de troubles psychosomatiques et à rééquilibrer mon système nerveux autonome.</p>',
    '<p>J’étais si désespéré que je ne voulais négliger aucune piste. Ce qui m’a aidé à l’époque, ce n’était ni un médicament ni une thérapie classique, mais le travail avec Michael Prgomet, Heilpraktiker et formateur, qui se consacre depuis plus de 30 ans précisément aux mécanismes dont il est question sur cette page.</p>\n  <p>Seul son travail m’a alors aidé à dénouer peu à peu ces tensions intérieures profondément enracinées.</p>'
  );
  html = replaceAll(
    html,
    'Selon mon modèle explicatif, des acouphènes dus au stress peuvent apparaître lorsqu’un conflit émotionnel non résolu entretient un foyer central durablement hyperactif qui coactive des voies impliquées dans le traitement auditif. C’est ma synthèse des approches de Prgomet et de Klinghardt, de cas observés chez d’autres personnes et de mes propres recherches — cela ne constitue pas une explication médicale de référence, et ce n’est pas le fruit de l’imagination.',
    'Aujourd’hui, je peux le dire : les acouphènes dus au stress ne sont ni un mystère ni une invention. Ils sont la conséquence audible d’un état électrique permanent dans le cerveau, déclenché par des conflits qui n’ont jamais été réellement clos. Quand on comprend ce qui s’y passe, on comprend aussi pourquoi le son est là — et ce que l’on peut faire soi-même.'
  );
  html = replaceAll(
    html,
    '<p>Je reprends, dans les approches de Michael Prgomet et du Dr Klinghardt, l’idée de petits phénomènes locaux de tension et de champ électrique, que je combine avec mes propres recherches. Je ne prétends pas que l’ensemble de la chaîne « conflit non résolu → champ de tension local → acouphènes » ait été directement démontré par MEG.</p>',
    ''
  );
  // Replace the two added source-inventory paragraphs with the direct German-source author framing.
  html = replaceRegex(
    html,
    /<p>C’est pourquoi je présente également ici son approche des acouphènes d’origine cérébrale\.[\s\S]*?<\/p>\s*<p><strong>Point important pour bien situer les choses :<\/strong>[\s\S]*?<\/p>/,
    '<p>C’est pourquoi je partage ici son approche des acouphènes d’origine cérébrale, sur la base de ma propre expérience, très positive. Il appelle ces phénomènes des <strong>champs de tension électrostatiques</strong> : des centres nerveux hyperactifs et autonomes qui, comme de petites îles d’énergie, consomment en permanence de l’énergie et envoient des stimulations électriques dans les voies nerveuses. Selon les voies touchées, cela se manifeste par des symptômes très différents — de l’estomac à l’oreille. Il ne s’agit pas d’une recommandation générale — je ne fais que partager ce qui m’a personnellement aidé.</p>'
  );
  html = replaceAll(
    html,
    '<p><strong>Quatrièmement, par de faibles effets de champ électrique.</strong> Dans la partie de mon modèle issue de Michael Prgomet et du Dr Klinghardt, de faibles effets locaux bien réels de champ électrique et de charge jouent un rôle. Selon cette conception, des cellules nerveuses actives de manière synchronisée peuvent également stimuler des cellules voisines. Il s’agit d’une hypothèse de modèle explicitement attribuée à ces deux auteurs, et non d’un processus mesuré directement dans les acouphènes dus au stress.</p>',
    '<p><strong>Quatrièmement, par de faibles effets de champ électrique.</strong> Lorsque de nombreuses cellules nerveuses sont actives simultanément et de façon synchronisée dans une petite zone, des champs électriques locaux apparaissent. Ces champs sont faibles — mais réels, et ils peuvent effectivement pousser des cellules voisines au-delà de leur seuil, de sorte qu’elles se mettent elles-mêmes à décharger.</p>'
  );
  html = replaceAll(
    html,
    '<p>La sphère de Van de Graaff et le « petit éclair » illustrent, dans ce modèle, un petit phénomène physique local supposé — et non une haute tension, une étincelle visible ou un processus mesuré directement dans les acouphènes dus au stress. Lorsqu’un déclencheur s’ajoute ou que des facteurs comme le manque de sommeil, l’épuisement et une forte tension intérieure se combinent, le champ supposé peut se renforcer et, selon ce modèle, stimuler également une voie nerveuse voisine et sensible.</p>',
    '<p>On peut se représenter ce mécanisme électrique à peu près comme une petite sphère de Van de Graaff dans le système nerveux (bien sûr seulement comme une image — les tensions réelles sont beaucoup plus faibles que celles d’une véritable sphère à haute tension, mais le principe de fonctionnement est le même) : tant que le conflit n’est que faiblement actif, il ne se passe pas grand-chose. Mais lorsqu’un déclencheur s’ajoute — ou que plusieurs facteurs se combinent, comme le manque de sommeil, l’épuisement et une forte tension intérieure —, le champ continue de se charger. À un moment donné, la tension devient suffisante et se décharge comme un petit éclair sur une voie nerveuse voisine et sensible. Et cette voie se met alors à décharger elle aussi.</p>'
  );
  html = replaceAll(html, 'Ce que peut montrer la stimulation électrique du cerveau', 'La preuve scientifique : la stimulation électrique produit des sons');
  html = replaceAll(
    html,
    'Penfield et Perot ont rapporté en 1963 que la stimulation électrique du cortex provoquait chez certains patients des perceptions auditives sans source sonore extérieure. Cela étaye le point précis selon lequel une stimulation électrique du cerveau peut déclencher des perceptions sonores. Cela ne prouve ni l’existence du foyer conflictuel non résolu ni le trajet supposé du champ et de la décharge.',
    'Dès les années 1950, des chercheurs comme Wilder Penfield, à Montréal, ont mené des expériences au cours desquelles le cerveau de patients était stimulé électriquement. Beaucoup d’entre eux entendaient alors des sons, de la musique ou des voix, alors qu’aucune source acoustique n’était présente. Ces expériences ont apporté la preuve suivante : lorsque certaines régions du cerveau ou des voies auditives sont stimulées électriquement, un son peut apparaître — même sans source sonore.'
  );
  html = replaceAll(
    html,
    'L’application de ce constat aux acouphènes dus au stress fait partie de mon modèle explicatif ; elle ne constitue pas une preuve expérimentale directe. Dans ce modèle, la stimulation ne vient pas de l’extérieur, par des électrodes, mais d’une activité centrale persistante en lien avec des conflits non résolus.',
    'C’est précisément ce principe que j’applique aussi aux acouphènes dus au stress dans mon modèle. Ici, la stimulation ne vient pas de l’extérieur, par des électrodes, mais de l’intérieur, par une activité électrique permanente liée à des conflits non résolus.'
  );
  // Remove the locally added HPA/cortisol excursus.
  html = replaceAll(
    html,
    '<p><strong>Point important pour bien distinguer les mécanismes :</strong> le stress général lié à l’axe HPA et au cortisol ne constitue pas ici une deuxième voie directe vers les acouphènes dus au stress. Le stress chronique peut, par l’activation du système sympathique, réduire la microcirculation cochléaire et resserrer les vaisseaux au niveau de la strie vasculaire. L’oreille interne peut ainsi devenir plus vulnérable au bruit, aux infections ou à d’autres agressions. Il s’agit d’une voie de vulnérabilité, pas d’une source sonore indépendante. Dans mes deux épisodes, cette voie n’a pas non plus joué de rôle causal.</p>',
    ''
  );
  html = replaceAll(
    html,
    'Le fait qu’un symptôme persiste même en l’absence de stress aigu ne permet pas, à lui seul, d’en déterminer la cause. En cas d’acouphènes, les causes organiques doivent faire l’objet d’un bilan médical ; dans le cadre de ce modèle, une activité centrale anormale persistante peut constituer une explication possible.',
    'Un indice décisif est la durée : si un symptôme persiste même en l’absence de stress aigu, il existe généralement une activité électrique anormale chronique dans le système nerveux.'
  );
  html = replaceAll(
    html,
    'Et bien sûr, certaines questions restent encore ouvertes — c’est pourquoi j’ai créé une <a href="/fr/faq">page FAQ</a>, sur laquelle je réponds brièvement et simplement aux questions les plus fréquentes.',
    'Et bien sûr, certaines questions sont sûrement restées ouvertes — c’est pourquoi j’ai créé une <a href="/fr/faq">page FAQ</a>, que je construis actuellement pas à pas.'
  );
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  html = commonFixes(html);
  const p = pathname.replace(/\.html$/, '');
  switch (p) {
    case '/fr/acouphenes-et-bruit': return fixNoise(html);
    case '/fr/acouphenes-et-medicaments': return fixGift(html);
    case '/fr/acouphenes-et-stress': return fixStress(html);
    default: return html;
  }
}

export default async (request: Request, context: any) => {
  const url = new URL(request.url);
  if (url.pathname === '/fr/faq' || url.pathname === '/fr/faq.html') return context.next();
  const response = await context.next();
  // These responses must not be reconstructed with a body.
  if (request.method === 'HEAD' || [204, 205, 304].includes(response.status)) return response;
  const type = response.headers.get('content-type') || '';
  if (!type.includes('text/html')) return response;
  const html = await response.text();
  const fixed = applyPathFixes(url.pathname, html);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  headers.set('x-tbr-fr-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/fr/*' };
export { applyPathFixes };
