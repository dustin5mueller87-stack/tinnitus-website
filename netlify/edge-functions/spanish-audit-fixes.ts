/*
 * Collision-safe Spanish translation corrections from the completed one-pass audit.
 *
 * Why this is an Edge Function instead of direct page rewrites:
 * - It layers Spanish-only, audited text corrections on top of the newest main branch.
 * - It does not replace recently published source files from other language work.
 * - It deliberately excludes the unfinished FAQ and leaves unresolved author/source,
 *   optional style, visual and live-browser questions untouched.
 */

const VERSION = "2026-09-07-v1";

function replaceAll(text, from, to) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}

function replaceRegex(text, pattern, replacement) {
  return text.replace(pattern, replacement);
}

function commonFixes(html) {
  html = replaceRegex(
    html,
    /(<a href="\/es\/mi-enfoque"(?: class="active" aria-current="page")?>)Mi enfoque(<\/a>)/g,
    "$1Mi enfoque para encontrar una solución$2"
  );
  html = replaceAll(
    html,
    '<span class="page-nav-title">Mi enfoque</span>',
    '<span class="page-nav-title">Mi enfoque para encontrar una solución</span>'
  );
  html = replaceAll(
    html,
    'Biografía extensa, parte 2: la prueba más dura',
    'Biografía extensa, parte 2: la prueba de fuego'
  );
  return html;
}

function fixHome(html) {
  html = replaceAll(
    html,
    '<a href="/es/mi-enfoque">mi enfoque</a>, o simplemente seguir leyendo aquí.',
    '<a href="/es/mi-enfoque">mi enfoque para encontrar una solución</a>, o simplemente seguir leyendo aquí.'
  );
  html = replaceAll(
    html,
    'Mi enfoque concreto, paso a paso y con documentación.',
    'Mi enfoque concreto para encontrar una solución, paso a paso y con documentación.'
  );
  html = replaceAll(
    html,
    '<h2 class="section-title" id="mi-enfoque" style="margin-top:48px;">Mi enfoque concreto</h2>',
    '<h2 class="section-title" id="mi-enfoque" style="margin-top:48px;">Mi enfoque concreto para encontrar una solución</h2>'
  );
  html = replaceAll(
    html,
    '→ Ir a mi enfoque: lo que hice en concreto →',
    '→ Ir a mi enfoque para encontrar una solución: lo que hice en concreto →'
  );
  html = replaceAll(
    html,
    'Discoteca, concierto, trauma acústico, exposición crónica al ruido:',
    'Discoteca, concierto, trauma acústico por impulso, exposición crónica al ruido:'
  );
  html = replaceAll(
    html,
    '<div class="preview-block">\n    <h3>Acúfenos por estrés o de origen psicosomático</h3>',
    '<div class="preview-block" data-nosnippet>\n    <h3>Acúfenos por estrés o de origen psicosomático</h3>'
  );
  html = replaceAll(
    html,
    'El impreso no ofrece junto a ellas una tabla numérica; para evitar cifras inventadas, se preservan como información gráfica en la imagen original.',
    'El impreso no ofrece junto a ellas una tabla numérica; se preservan como información gráfica en la imagen original.'
  );
  return html;
}

function fixBio1(html) {
  html = replaceAll(
    html,
    'En ese momento ya percibía también un pitido débil en el derecho.',
    'En ese momento todavía no percibía ningún acúfeno en el oído derecho.'
  );
  html = replaceAll(
    html,
    'La mañana de mi segunda consulta, los acúfenos se habían intensificado de forma masiva de repente; también el débil pitido que ya existía en el oído derecho era ahora claramente más fuerte. (Hoy sé que la exposición adicional a sonidos por consejo médico —con música y, por la noche, con ruido blanco— había vuelto a poner de rodillas a mis células y había intensificado de forma masiva el tono ya presente en el oído derecho).',
    'La mañana de mi segunda consulta, los acúfenos se habían intensificado de forma masiva de repente y, pocos días después del primer tono izquierdo, empecé a percibir también un pitido en el oído derecho. (Hoy sé que la exposición adicional a sonidos por consejo médico —con música y, por la noche, con ruido blanco— había vuelto a poner de rodillas a mis células y había hecho que el segundo oído también se viera afectado).'
  );
  html = replaceAll(
    html,
    'El sistema había capitulado y me había puesto la etiqueta de «loco».',
    'El sistema había capitulado y me había echado la culpa.'
  );
  html = replaceAll(
    html,
    '<h2 class="section-title">El salvaje oeste de las soluciones</h2>',
    '<h2 class="section-title">El salvaje oeste de las propuestas de solución</h2>'
  );
  html = replaceAll(
    html,
    'Un ruido fantasma no reacciona en tiempo real a un estímulo de ruido.',
    'Un ruido fantasma no reacciona en tiempo real a un estímulo mecánico.'
  );
  html = replaceAll(
    html,
    'psilio, una mezcla de arcillas minerales y probióticos para mi gastritis crónica',
    'cáscaras de semillas de psilio, una mezcla de tierras minerales y probióticos para mi gastritis crónica'
  );
  html = replaceAll(
    html,
    '<h2 class="section-title" id="b12">Vitamina B12: la experiencia clave absoluta (fortuita)</h2>',
    '<h2 class="section-title" id="b12">Vitamina B12: la experiencia clave más importante (fortuita)</h2>'
  );
  return html;
}

function fixBio2(html) {
  html = replaceAll(html, 'El colapso al 75 %', 'El colapso alrededor del 50 %');
  html = replaceAll(
    html,
    'hasta un brutal 75 % de la intensidad de mi primerísimo episodio de acúfenos',
    'hasta un brutal nivel de aproximadamente el 50 % de la intensidad de mi primerísimo episodio de acúfenos'
  );
  html = replaceAll(
    html,
    'El colapso definitivo: el 75 % y el caos sonoro',
    'El colapso definitivo: aproximadamente el 50 % y el caos sonoro'
  );
  html = replaceAll(
    html,
    'alcanzaban sin duda tres cuartas partes —el 75 %— de la intensidad que habían tenido durante mi primerísimo episodio de acúfenos',
    'alcanzaban aproximadamente la mitad —el 50 %— de la intensidad que habían tenido durante mi primerísimo episodio de acúfenos'
  );
  html = replaceAll(
    html,
    'estaba postrado en cama al 98 %',
    'pasaba el 98 % del tiempo postrado en cama'
  );
  html = replaceAll(
    html,
    'entré en una suspensión total de nutrientes (abstinencia)',
    'dejé por completo de tomar suplementos'
  );
  html = replaceAll(html, 'omega-3 DHA/EPA y Q10', 'omega-3 con Q10');
  html = replaceAll(
    html,
    'Los audiogramas disponibles documentan exclusivamente el primer episodio; no existe un audiograma del segundo.',
    'Los audiogramas disponibles documentan exclusivamente el primer episodio.'
  );
  html = replaceAll(
    html,
    'las masivas caídas de frecuencia',
    'las marcadas caídas de audición en determinadas frecuencias'
  );
  html = replaceAll(html, 'Parte 2: la prueba más dura', 'Parte 2: la prueba de fuego');
  return html;
}

function fixShortBio(html) {
  html = replaceAll(
    html,
    'y un pitido tenue en el derecho',
    'y todavía ningún acúfeno perceptible en el derecho'
  );
  html = replaceAll(
    html,
    'el tono tenue que ya tenía en el oído derecho empeoró claramente',
    'pocos días después empecé a percibir también un pitido en el oído derecho'
  );
  html = replaceAll(
    html,
    'con un brutal 75 % del volumen de mi primerísimo episodio de acúfenos',
    'con un nivel brutal, de aproximadamente el 50 % del volumen de mi primerísimo episodio de acúfenos'
  );
  html = replaceAll(
    html,
    'Quité FitLine de la pantalla de un manotazo a los 4 segundos',
    'Cerré la página de FitLine con arrogancia a los cuatro segundos'
  );
  html = replaceAll(
    html,
    'el mismo conjunto de productos FitLine que yo había cerrado con arrogancia de un clic',
    'los mismos productos FitLine cuya página había cerrado antes con arrogancia de un clic'
  );
  html = replaceAll(
    html,
    'Probé un entrenamiento de altitud simulado (IHHT), que tuve que interrumpir por el pánico',
    'Intenté iniciar un entrenamiento de altitud simulado (IHHT), pero lo aborté por el pánico antes de que comenzara el tratamiento'
  );
  html = replaceAll(
    html,
    'Mi proceso de curación se prolongó de tres a cuatro meses.',
    'Mi proceso de curación duró aproximadamente entre tres y cuatro meses.'
  );
  html = replaceAll(html, 'arcilla mineral', 'tierra mineral');
  html = replaceAll(
    html,
    'las masivas caídas de frecuencia',
    'las marcadas caídas de audición en determinadas frecuencias'
  );
  html = replaceAll(
    html,
    'estaba postrado en cama al 98 %',
    'pasaba el 98 % del tiempo postrado en cama'
  );
  return html;
}

function fixApproach(html) {
  html = replaceAll(
    html,
    'Para este experimento había dejado deliberadamente de tomar los nutrientes después de que apareciera el primer tono tenue. No retomé el protocolo completo hasta que este segundo episodio alcanzó aproximadamente el 75 % de la intensidad de mi primer episodio de acúfenos y puse fin al experimento.',
    'Tras poner fin al experimento, retomé de inmediato mi protocolo completo.'
  );
  html = replaceAll(
    html,
    ', los audiogramas de mi primer episodio confirman la mejoría de ese episodio',
    ''
  );
  html = replaceAll(
    html,
    'En segundo lugar, conocí casos y vi y escuché testimonios, todos procedentes de la consulta de Prgomet, sobre pacientes que mejoraron claramente',
    'En segundo lugar, presencié en la práctica cómo otros pacientes mejoraban claramente'
  );
  html = replaceAll(
    html,
    'me ayudó entonces muchísimo a resolver por completo esos conflictos profundamente arraigados y a devolver el equilibrio a mi sistema nervioso autónomo',
    'me ayudó entonces a liberar esas tensiones profundamente arraigadas'
  );
  html = replaceAll(
    html,
    'lo ayudó a resolverlos por completo y a devolver el equilibrio a su sistema nervioso autónomo',
    'lo ayudó a devolver el equilibrio a su sistema nervioso autónomo'
  );
  html = replaceAll(
    html,
    'dejar que la resolución de conflictos o traumas propiamente dicha ocurra sobre todo por la noche, durante el sueño y los sueños',
    'dejar que la curación propiamente dicha ocurra por la noche durante el procesamiento de los sueños'
  );
  html = replaceAll(
    html,
    'dejar de evitar la emoción, activarla conscientemente y permitir que la resolución posterior ocurra principalmente por la noche, mientras se duerme y se sueña',
    'activar y resolver conscientemente la emoción en lugar de seguir evitándola'
  );
  html = replaceAll(
    html,
    'resolución de conflictos o resolución de traumas',
    'resolución de conflictos, también llamada resolución de traumas'
  );
  html = replaceAll(
    html,
    'Así llegan a la sangre o la orina y pueden detectarse mediante pruebas de laboratorio.',
    'Así llegan a la sangre, a la orina o a ambas y pueden detectarse mediante pruebas de laboratorio.'
  );
  html = replaceAll(html, 'por sí solo y por completo', 'por sí solo');
  html = replaceAll(html, 'más bien el menos frecuente', 'más bien un caso menos frecuente');
  html = replaceAll(html, 'casi siempre junto con otros factores', 'la mayoría de las veces, también junto con otros factores');
  html = replaceAll(
    html,
    'sin un agente quelante que actúe a la vez en la sangre',
    'sin un agente ligante que actúe a la vez en la sangre'
  );
  html = replaceAll(
    html,
    '<h1>Mi enfoque: ¿qué hice exactamente para abordar los acúfenos crónicos?</h1>',
    '<h1>Mi enfoque para encontrar una solución: ¿qué hice exactamente para abordar los acúfenos crónicos?</h1>'
  );
  html = replaceAll(
    html,
    '"headline": "Mi enfoque: ¿qué hice exactamente para abordar los acúfenos crónicos?"',
    '"headline": "Mi enfoque para encontrar una solución: ¿qué hice exactamente para abordar los acúfenos crónicos?"'
  );
  return html;
}

function fixSources(html) {
  html = replaceAll(
    html,
    '; la documentación audiométrica disponible corresponde exclusivamente al primer episodio',
    ''
  );
  html = replaceAll(
    html,
    'La documentación audiométrica disponible corresponde exclusivamente al primer episodio; no existen documentos equivalentes del segundo. ',
    ''
  );
  html = replaceAll(
    html,
    'todo ello documentado en un estudio doble ciego',
    'todo ello documentado en condiciones de doble ciego'
  );
  html = replaceRegex(
    html,
    /<h2 id="sektion-14" class="section-title" data-num="14">[^<]*<\/h2>\s*<p>En mi <a href="\/es\/acufenos-por-estres">página sobre los acúfenos por estrés<\/a> explico cómo el <strong>método de Michael Prgomet<\/strong> me ayudó en 2013 a resolver graves cargas psicosomáticas que habían llevado mi sistema nervioso a un estado de sobreexcitación crónica\.[\s\S]*?<\/p>/,
    '<h2 id="sektion-14" class="section-title" data-num="14">Michael Prgomet — resolución kinesiológica del estrés</h2>\n  <p>En mi <a href="/es/acufenos-por-estres">página sobre los acúfenos por estrés</a> explico cómo el <strong>método de Michael Prgomet</strong> me ayudó en 2013 a resolver graves cargas psicosomáticas que habían llevado mi sistema nervioso a un estado de sobreexcitación crónica. Su enfoque trabaja con el concepto de <strong>«campos de tensión electrostática»</strong> en el cerebro: centros nerviosos hiperactivos que, debido a conflictos emocionales no resueltos, permanecen en un flujo eléctrico continuo y pueden descargarse en forma de síntomas físicos según las vías afectadas.</p>'
  );
  return html;
}

function fixTestimonials(html) {
  html = replaceRegex(
    html,
    /<p>Aquí recopilo testimonios de acceso público que he encontrado al investigar en foros y plataformas en distintos idiomas\.[\s\S]*?tú mismo tienes que decidir qué pensar de todo ello\.<\/p>/,
    '<p>Aquí recopilo testimonios de acceso público que he encontrado al investigar en distintos idiomas, foros y plataformas. Muestran que personas de todo el mundo, de forma independiente y sin conocerse entre sí, cuentan experiencias similares con los acúfenos y con un enfoque basado en nutrientes. No es posible evaluar a distancia qué efecto tuvo en cada caso lo descrito; tú mismo tienes que decidir qué pensar de todo ello.</p>'
  );
  return html;
}

function fixProducts(html) {
  html = replaceAll(
    html,
    'Desde hace años tomo regularmente 3 mg de melatonina por la noche como complemento del complejo de minerales.',
    'Durante años tomé regularmente 3 mg de melatonina por la noche como complemento del complejo de minerales.'
  );
  html = replaceAll(
    html,
    'lo ayudó a resolverlos por completo y a devolver el equilibrio a su sistema nervioso autónomo',
    'lo ayudó a devolver el equilibrio a su sistema nervioso autónomo'
  );
  return html;
}

function fixImprint(html) {
  html = replaceAll(
    html,
    'En ese momento no se detectaron contenidos ilícitos.',
    'En el momento de enlazarlas no se apreciaban contenidos ilícitos.'
  );
  return html;
}

function fixPrivacy(html) {
  html = replaceAll(
    html,
    '<title>Política de privacidad – Tinnitus Bioregulation</title>',
    '<title>Política de privacidad</title>'
  );
  return html;
}

function fixNoise(html) {
  html = replaceAll(
    html,
    'Discoteca, concierto, trauma acústico:',
    'Discoteca, concierto, trauma acústico por impulso:'
  );
  html = replaceAll(
    html,
    'y, para colmo, poco después se intensificó claramente el pitido débil que ya había aparecido en el oído derecho el tercer día, como consecuencia directa de unas indicaciones de los médicos que, en mi caso personal, resultaron ser del todo equivocadas.',
    'y, para colmo, poco después se sumó también el oído derecho, como consecuencia directa de unas indicaciones de los médicos que, en mi caso personal, resultaron ser del todo equivocadas.'
  );
  html = replaceAll(
    html,
    'porque precisamente eso empeoró mi estado e intensificó claramente el tono débil que ya había en el oído derecho.',
    'porque precisamente eso empeoró mi estado e hizo que el segundo oído también se viera afectado.'
  );
  html = replaceAll(
    html,
    '<p><strong>Importante para la cadena de señal:</strong> cuando describo la liberación de glutamato en la sinapsis y la señal que llega al nervio auditivo, me refiero expresamente a la <strong>célula ciliada interna</strong>.</p>\n\n',
    ''
  );
  html = replaceRegex(
    html,
    /<div class="callout">\s*<p>Antes de ver qué ocurre cuando este sistema se sobrecarga, una idea importante:[\s\S]*?El tejido completamente muerto, en cambio, ya no envía ninguna señal\.<\/p>\s*<\/div>/,
    '<div class="callout">\n    <p>Antes de ver qué ocurre cuando este sistema se sobrecarga, una idea importante: cuando aparecen acúfenos crónicos después de un trauma acústico, muchas personas afectadas piensan —y muchos médicos también transmiten esa impresión— que las células ciliadas del oído han quedado destruidas de forma irreversible y que ahora el cerebro produce el tono por sí solo, a partir del recuerdo. Estoy convencido de que esa explicación se queda corta. Una célula ciliada muerta ya no envía ninguna señal: está en silencio. Precisamente porque el tono ESTÁ ahí, la célula todavía tiene que estar viva. Los acúfenos no son la señal de una célula muerta, sino de una célula que está luchando por sobrevivir. Puede ocurrir que algunas células ciliadas se pierdan definitivamente con un daño por ruido, pero, según mi comprensión, esas células no participan en el fenómeno de los acúfenos porque ya no envían ninguna señal. El tono procede de las células que siguen ahí y luchan, atrapadas en una pérdida funcional energética.</p>\n  </div>'
  );
  html = replaceRegex(
    html,
    /<p>Los acúfenos por ruido pueden notarse justo después del evento sonoro, pero también percibirse conscientemente solo horas o días después\.[\s\S]*?expresamente como hipótesis\.<\/p>/,
    '<p>En la mayoría de las personas afectadas, los acúfenos aparecen relativamente poco después del episodio de ruido: en cuestión de minutos o de unas pocas horas. Sin embargo, también hay casos en los que aparecen solo horas o incluso días más tarde. Por qué puede variar tanto ese intervalo y qué papel desempeñan determinadas estructuras del oído lo explico con detalle en la sección de preguntas frecuentes.</p>'
  );
  html = replaceRegex(
    html,
    /<h2 class="section-title" id="fazit">La conclusión<\/h2>\s*<p>Lo que es fisiológicamente el acúfeno crónico por ruido en mi modelo principal:[\s\S]*?El cerebro no crea el tono a partir de una ausencia total de señal, sino que amplifica la señal errónea existente\.<\/p>/,
    '<h2 class="section-title" id="fazit">La conclusión</h2>\n  <p>Lo que, según mi convicción, es fisiológicamente el acúfeno crónico provocado por ruido: una célula viva atrapada en un modo energético de emergencia, cuya reparación permanece en gran parte congelada en la fase 1 porque falta la energía para la fase 2. El oído no está «roto» y el cerebro no se inventa una señal fantasma. El tono es el resultado de una lucha periférica real por sobrevivir que el cerebro únicamente amplifica.</p>'
  );
  return html;
}

function fixToxins(html) {
  html = replaceAll(
    html,
    'de una enzima o de una bomba de calcio impulsada por ATP',
    'de una enzima, concretamente una bomba de calcio impulsada por ATP'
  );
  html = replaceAll(
    html,
    'las bombas de calcio funcionan ya más bien cerca de su límite, o las células trabajan justo al límite de su capacidad.',
    'las bombas de calcio funcionan ya más bien cerca de su límite y, en conjunto, las células trabajan justo al límite de su capacidad.'
  );
  html = replaceAll(html, 'fallos de encendido', 'descargas eléctricas erróneas');
  return html;
}

function fixStress(html) {
  html = replaceAll(
    html,
    'Según mi modelo explicativo, los acúfenos por estrés pueden surgir cuando un conflicto emocional no resuelto mantiene un foco de conflicto central persistentemente hiperactivo que activa también las vías que procesan la audición. Es mi síntesis del enfoque de Prgomet y Klinghardt, de casos ajenos y de mi propia investigación; no es imaginación.',
    'Hoy puedo decir: los acúfenos por estrés no son ningún misterio ni algo imaginario. Son la consecuencia audible de un estado eléctrico permanente en el cerebro, desencadenado por conflictos que nunca llegaron a cerrarse de verdad. Cuando se entiende lo que ocurre, también se entiende por qué está ahí el tono y qué puede hacer uno mismo.'
  );
  html = replaceAll(
    html,
    'Fue su trabajo lo que me ayudó muchísimo a resolver por completo los conflictos de mi etapa de SFC y problemas psicosomáticos y a devolver el equilibrio a mi sistema nervioso autónomo.</p>\n  <p>Y escribo este artículo precisamente desde esa experiencia propia: no porque esté citando un manual de medicina, sino porque sentí en mi propio cuerpo cuánta presión interna hay alojada en el sistema nervioso sin que uno sea consciente de ello en la vida diaria.',
    'Fue su trabajo lo que me ayudó entonces a ir resolviendo poco a poco esas profundas tensiones internas.</p>\n  <p>Y escribo este artículo precisamente desde esa experiencia propia: no porque cite un manual de medicina, sino porque sentí en mi propio cuerpo cuánta presión interior puede quedar alojada en el sistema nervioso sin que uno sea consciente de ello en la vida diaria.'
  );
  html = replaceRegex(
    html,
    /<p><strong>Importante para situarlo:<\/strong> mis dos episodios de acúfenos fueron provocados por ruido;[\s\S]*?mi propia investigación y síntesis\.<\/p>\s*/,
    ''
  );
  html = replaceRegex(
    html,
    /<p>Por eso presento aquí también su enfoque sobre los acúfenos de origen cerebral\.[\s\S]*?No es una recomendación general, sino la exposición de mi modelo y de la base de experiencia mencionada\.<\/p>/,
    '<p>Por eso comparto aquí su enfoque sobre los acúfenos de origen cerebral basándome en mi propia experiencia, muy positiva, con su trabajo durante mi etapa de SFC. Él denomina estos fenómenos <strong>campos de tensión electrostática</strong>: centros nerviosos hiperactivos y autónomos que, como pequeñas islas de energía, consumen energía eléctrica de forma permanente y envían estímulos eléctricos a las vías nerviosas. Según las vías afectadas, esto se manifiesta en síntomas completamente distintos, desde el estómago hasta el oído. No es una recomendación general: solo comparto lo que me ayudó personalmente.</p>'
  );
  html = replaceAll(
    html,
    '<p>La idea de pequeños procesos locales de tensión y de campo la tomo de los enfoques de Michael Prgomet y del Dr. Klinghardt y la combino con mi propia investigación. No afirmo aquí que exista una prueba directa por MEG de la cadena completa «conflicto no resuelto → campo de tensión local → acúfenos».</p>',
    '<p>Mucha gente sabe que el cerebro funciona con electricidad. Pero casi nadie piensa en la vida diaria en cómo se relacionan esas actividades eléctricas con fenómenos como los acúfenos. Este conocimiento no es en absoluto nuevo: ya en la década de 1990, investigadores de centros especializados en epilepsia pudieron hacer visible precisamente esto mediante aparatos de medición extremadamente raros y complejos, como los llamados escáneres MEG. Allí, las mediciones muestran campos de tensión claramente activos en determinadas regiones cerebrales cuando existen conflictos no resueltos.</p>'
  );
  html = replaceAll(
    html,
    '<p><strong>En cuarto lugar, mediante pequeños efectos de campo eléctrico.</strong> En la parte de mi modelo que tomo de Michael Prgomet y del Dr. Klinghardt intervienen pequeños efectos reales y locales de campo y de carga. Según esta idea, las células nerviosas activas de forma sincronizada pueden irritar a las células vecinas. Es una suposición del modelo, atribuida a ellos, no un proceso medido directamente en los acúfenos por estrés.</p>',
    '<p><strong>En cuarto lugar, mediante pequeños efectos de campo eléctrico.</strong> Cuando muchas células nerviosas de una zona pequeña están activas de forma simultánea y sincronizada, se generan campos eléctricos locales. Estos campos son pequeños, pero son reales y pueden empujar a las células vecinas por encima del umbral, haciendo que ellas mismas disparen.</p>'
  );
  html = replaceAll(
    html,
    '<p>La esfera de Van de Graaff y el «pequeño relámpago» ilustran en este modelo un pequeño proceso físico supuesto: ni alta tensión, ni chispa visible, ni un proceso medido directamente en los acúfenos por estrés. Si se añade un desencadenante o coinciden factores como falta de sueño, agotamiento y gran tensión interna, el campo supuesto puede intensificarse y, según este modelo, irritar también una vía nerviosa vecina y sensible.</p>',
    '<p>Este mecanismo eléctrico puede imaginarse aproximadamente como una pequeña esfera de Van de Graaff en el sistema nervioso (por supuesto, solo como imagen: las tensiones reales son muchísimo menores que en una bola de alta tensión, pero el principio funcional es el mismo). Mientras el conflicto esté solo ligeramente activo, no ocurre gran cosa. Pero si se añade un desencadenante, o coinciden varios factores como falta de sueño, agotamiento o una gran tensión interna, el campo sigue cargándose. En algún momento la tensión es suficiente y se descarga como un pequeño relámpago sobre una vía nerviosa vecina y sensible. Y entonces esa vía también dispara.</p>'
  );
  html = replaceAll(
    html,
    '<h2 class="section-title" id="beweis">Lo que puede mostrar la estimulación eléctrica del cerebro</h2>',
    '<h2 class="section-title" id="beweis">La prueba científica: la estimulación eléctrica genera tonos</h2>'
  );
  html = replaceRegex(
    html,
    /<h3>Experimentos históricos<\/h3>\s*<p>Penfield y Perot informaron en 1963[\s\S]*?<\/p>\s*<p>La transferencia a los acúfenos por estrés[\s\S]*?<\/p>/,
    '<h3>Experimentos históricos</h3>\n  <p>Ya en la década de 1950, investigadores como Wilder Penfield en Montreal realizaron experimentos en los que estimulaban eléctricamente el cerebro de pacientes. Muchos de ellos oyeron tonos, música o voces aunque no hubiera ninguna fuente acústica. Estos experimentos aportaron la prueba de que, cuando determinadas zonas cerebrales o nervios auditivos se estimulan eléctricamente, puede surgir un tono incluso sin una fuente sonora.</p>\n\n  <p>Ese mismo principio interviene también, según mi modelo, en los acúfenos por estrés. Solo que aquí la estimulación no viene de fuera mediante electrodos, sino de una actividad eléctrica persistente originada internamente por conflictos no resueltos.</p>'
  );
  html = replaceRegex(
    html,
    /\s*<p><strong>Importante para delimitarlo:<\/strong> el estrés general del eje HHS\/cortisol[\s\S]*?En mis dos episodios, esta vía tampoco intervino como causa\.<\/p>/,
    ''
  );
  html = replaceAll(
    html,
    'Que un síntoma persista incluso sin estrés agudo no indica por sí solo ninguna causa concreta; dentro de este modelo, una actividad central anómala y persistente puede ser una explicación posible.',
    'Un indicio decisivo es la duración: si un síntoma permanece incluso sin estrés agudo, suele existir una actividad eléctrica anómala crónica en el sistema nervioso.'
  );
  html = replaceAll(
    html,
    'resolución de conflictos</strong> o <strong>resolución de traumas',
    'resolución de conflictos</strong>, también llamada <strong>resolución de traumas'
  );
  html = replaceAll(
    html,
    '<p>Una posible vía de mejoría consiste en hacer conscientes esos conflictos y resolverlos de raíz',
    '<p>Una posible vía de mejoría consiste, según este modelo, en hacer conscientes esos conflictos y resolverlos de raíz'
  );
  html = replaceAll(
    html,
    'especialmente si son ruidos agudos en el oído',
    'especialmente si los ruidos en el oído han aparecido de forma aguda'
  );
  return html;
}

function applyPathFixes(pathname, html) {
  html = commonFixes(html);
  switch (pathname) {
    case '/es':
    case '/es/':
    case '/es/index.html':
      return fixHome(html);
    case '/es/mi-historia-parte-1':
    case '/es/mi-historia-parte-1.html':
      return fixBio1(html);
    case '/es/mi-historia-parte-2':
    case '/es/mi-historia-parte-2.html':
      return fixBio2(html);
    case '/es/mi-historia-con-los-acufenos':
    case '/es/mi-historia-con-los-acufenos.html':
      return fixShortBio(html);
    case '/es/mi-enfoque':
    case '/es/mi-enfoque.html':
      return fixApproach(html);
    case '/es/fuentes-cientificas':
    case '/es/fuentes-cientificas.html':
      return fixSources(html);
    case '/es/testimonios':
    case '/es/testimonios.html':
      return fixTestimonials(html);
    case '/es/productos':
    case '/es/productos.html':
      return fixProducts(html);
    case '/es/aviso-legal':
    case '/es/aviso-legal.html':
      return fixImprint(html);
    case '/es/politica-de-privacidad':
    case '/es/politica-de-privacidad.html':
      return fixPrivacy(html);
    case '/es/acufenos-por-ruido':
    case '/es/acufenos-por-ruido.html':
      return fixNoise(html);
    case '/es/acufenos-por-medicamentos-y-toxicos':
    case '/es/acufenos-por-medicamentos-y-toxicos.html':
      return fixToxins(html);
    case '/es/acufenos-por-estres':
    case '/es/acufenos-por-estres.html':
      return fixStress(html);
    case '/es/contacto':
    case '/es/contacto.html':
      return html;
    default:
      return html;
  }
}

export default async (request, context) => {
  const url = new URL(request.url);
  if (url.pathname === '/es/preguntas-frecuentes' || url.pathname === '/es/preguntas-frecuentes.html') {
    return context.next();
  }
  const response = await context.next();
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.toLowerCase().includes('text/html')) return response;
  const original = await response.text();
  const corrected = applyPathFixes(url.pathname, original);
  const headers = new Headers(response.headers);
  headers.delete('content-length');
  if (corrected !== original) headers.set('x-spanish-audit-fixes', VERSION);
  return new Response(corrected, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
};

export const config = {
  path: '/es/*',
};

export { applyPathFixes };
