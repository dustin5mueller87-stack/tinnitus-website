/*
 * Collision-safe Polish corrections from the completed one-pass translation audit.
 * Scope is /pl/* only. FAQ, open visual/runtime/source questions, style-only options,
 * and the disputed 50/75 second-episode value remain untouched.
 */
const VERSION = "2026-09-07-v1";

function replaceAll(text: string, from: string, to: string) {
  if (!from || from === to) return text;
  return text.split(from).join(to);
}
function replaceRegex(text: string, pattern: RegExp, replacement: string) {
  return text.replace(pattern, replacement);
}

function fixBio1(html: string) {
  // Dustin's own B12 value was still within the normal range, very low and just above deficiency.
  html = replaceAll(
    html,
    'Wegetarianin od piętnastego roku życia plus przewlekłe zapalenie błony śluzowej żołądka — idealny wzorzec niedoboru B12. Badanie krwi potwierdziło: dolna granica normy.',
    'Wegetarianin od piętnastego roku życia plus przewlekłe zapalenie błony śluzowej żołądka — idealny układ ryzyka niskiego poziomu B12. Badanie krwi pokazało: wynik wciąż mieścił się w normie, ale był bardzo niski — tuż nad granicą niedoboru.'
  );
  html = replaceAll(
    html,
    'Zrobiłem badanie krwi u lekarza rodzinnego: niedobór potwierdzony, najniższy zakres normy. Lekarz odmówił mi jednak zastrzyków — „wciąż w normie”. Wyszedłem z gabinetu przybity.',
    'Zrobiłem badanie krwi u lekarza rodzinnego: wynik wciąż mieścił się w normie, ale był bardzo niski — tuż nad granicą niedoboru. Lekarz odmówił mi jednak zastrzyków — „wciąż w normie”. Wyszedłem z gabinetu przybity.'
  );
  return html;
}

function fixBio2(html: string) {
  // Binding chronology for the CFS/FitLine period: 2013, and the earlier dismissal was only "some time before".
  html = replaceAll(html, 'W chwili absolutnego dna, latem 2014 roku,', 'W chwili absolutnego dna w 2013 roku,');
  html = replaceAll(html, 'te same „modne soczki”, które pół roku wcześniej odrzuciłem', 'te same „modne soczki”, które jakiś czas wcześniej odrzuciłem');

  // Remove unsupported calendar precision around the deliberate second experiment.
  html = replaceAll(
    html,
    'Mijały lata. Był już koniec 2016 roku. Prowadziłem całkowicie normalne życie, mój słuch był idealny, a codzienna rutyna składników odżywczych stale ładowała mój komórkowy zbiornik ATP do 200% pojemności. Często wracałem myślami do swojej teorii szumów usznych.',
    'Mijały lata. Prowadziłem już znowu całkowicie normalne życie, mój słuch był idealny, a codzienna rutyna składników odżywczych stale ładowała mój komórkowy zbiornik ATP do 200% pojemności. Często wracałem myślami do swojej teorii szumów usznych.'
  );
  html = replaceAll(
    html,
    'Logika nie dawała mi spokoju: w tamtym momencie, pod koniec 2016 roku, czułem, że mam trzy razy więcej energii niż przy pierwszych szumach usznych.',
    'Logika nie dawała mi spokoju: w tamtym momencie czułem, że mam trzy razy więcej energii niż przy pierwszych szumach usznych.'
  );
  html = replaceAll(html, 'Świadoma prowokacja w noc sylwestrową', 'Świadoma prowokacja');
  html = replaceAll(
    html,
    'Był koniec 2016 roku, okres sylwestrowy. Zbiegły się tutaj dwie rzeczy. Z jednej strony wciąż miałem ogromny głód życia, ponieważ niespełna dwa lata wcześniej pokonałem CFS. Z drugiej moja teoria szumów usznych tkwiła mi głęboko w głowie i rozpaczliwie chciałem poznać odpowiedź. Ponieważ Sylwester sam w sobie wiąże się ze znacznym obciążeniem hałasem, całkowicie porzuciłem dawną ochronną ostrożność. Wyjątkowo hucznie świętowałem noc sylwestrową i celowo w pełni wystawiłem się na głośne wybuchy fajerwerków.',
    'Kilka lat po wyzdrowieniu z CFS zbiegły się dwie rzeczy. Z jednej strony wciąż miałem ogromny głód życia. Z drugiej moja teoria szumów usznych tkwiła mi głęboko w głowie i rozpaczliwie chciałem poznać odpowiedź. Podczas i tak już bardzo głośnej imprezy całkowicie porzuciłem dawną ochronną ostrożność. Bawiłem się wyjątkowo hucznie i celowo w pełni wystawiłem się na silne obciążenie hałasem.'
  );
  html = replaceAll(
    html,
    'Jeszcze tej samej nocy chwilami zauważałem konsekwencje:',
    'Jeszcze podczas tej imprezy chwilami zauważałem konsekwencje:'
  );
  html = replaceAll(
    html,
    'Od zwycięstwa nad CFS minęło już około dwóch i pół roku.',
    'Od wyzdrowienia z CFS minęło już kilka lat.'
  );

  // Doctors recommend white-noise masking as a method, not Dustin's extreme test settings.
  html = replaceAll(
    html,
    'Po trzech minutach białego szumu: kilka sekund martwej ciszy, a potem powrót z dwukrotną głośnością. Dokładnie ta „terapia”, którą zalecają lekarze.',
    'Po trzech minutach skrajnie głośnego białego szumu: kilka sekund martwej ciszy, a potem powrót z dwukrotną głośnością. Biały szum to rodzaj dźwięku stosowany przez lekarzy do maskowania.'
  );
  html = replaceAll(
    html,
    'Mój lodowaty dowód na własnym ciele: lekarze zalecają biały szum do maskowania.',
    'Mój lodowaty dowód na własnym ciele: biały szum to rodzaj dźwięku, który lekarze zalecają do maskowania.'
  );

  // "Physically dead" here means temporarily functionally unavailable/energetically depleted.
  html = replaceAll(
    html,
    'Przez kilka sekund była fizycznie martwa i „niema”.',
    'Przez kilka sekund była całkowicie wyłączona z działania i „niema” z powodu energetycznego wyczerpania.'
  );

  // Healing clock starts with the restarted routine after the experiment; no unsupported winter/spring calendar.
  html = replaceAll(
    html,
    'Proces zdrowienia ciągnął się od zimy do wiosny — łącznie trwał od około trzech i pół do niespełna czterech i pół miesiąca. Szumy uszne nie zniknęły jednak za jednym zamachem. Było to systematyczne wyłączanie kolejnych częstotliwości:',
    'Proces zdrowienia trwał mniej więcej trzy do czterech miesięcy od chwili, gdy po zakończeniu eksperymentu ponownie konsekwentnie rozpocząłem swoją rutynę. Szumy uszne nie zniknęły jednak za jednym zamachem. Było to systematyczne wyłączanie kolejnych częstotliwości:'
  );
  return html;
}

function fixShortBio(html: string) {
  // Binding chronology: day 3 left only; right first perceived days later after more sound.
  html = replaceAll(
    html,
    'Ale trzeciego dnia obudził się prawdziwy potwór: nagle usłyszałem ten piekielny pisk i szum — przede wszystkim w lewym uchu; po prawej stronie był już wtedy słaby pisk. Mój system ostatecznie się zawalił.',
    'Ale trzeciego dnia obudził się prawdziwy potwór: nagle usłyszałem ten piekielny pisk i szum w lewym uchu. Po prawej stronie w tym momencie nie odbierałem jeszcze żadnych szumów usznych. Mój system ostatecznie się zawalił.'
  );
  html = replaceAll(
    html,
    'Dopiero kiedy posłuchałem tej rady i nadal bombardowałem się muzyką oraz szumem, kilka dni później szumy uszne znacznie nasiliły się także w prawym uchu.',
    'Kiedy posłuchałem tej rady i nadal bombardowałem się muzyką oraz szumem, kilka dni później, po dalszej ekspozycji na dźwięk, po raz pierwszy zacząłem odbierać słaby ton także w prawym uchu.'
  );

  // CFS was a separate destructive chain, not the price of tinnitus healing.
  html = replaceAll(
    html,
    'Mój organizm pędził prosto ku przepaści, uwięziony w podstępnym biologicznym paradoksie: żyłem skrajnie i bez przerwy podkręcałem własny organizm na „najwyższe obroty”. Właśnie tę nadwyżkę energii organizm wykorzystał do skutecznego wyleczenia szumów usznych — ale cena była fatalna. Nieświadomie wypalałem przy tym swój ostatni komórkowy akumulator.',
    'Mój organizm pędził prosto ku przepaści, uwięziony w podstępnym biologicznym paradoksie: żyłem skrajnie i bez przerwy podkręcałem własny organizm na „najwyższe obroty”. Krótkoterminowo dawało mi to mnóstwo energii i pozwalało wiele zrobić, podczas gdy moje rezerwy w tle coraz bardziej się wyczerpywały. Nie zdawałem sobie sprawy, jak bardzo długofalowo wyczerpuję swój organizm.'
  );

  // IHHT was cancelled before treatment actually began.
  html = replaceAll(
    html,
    'Próbowałem symulowanego treningu wysokogórskiego (IHHT), który musiałem przerwać z powodu paniki,',
    'Próbowałem rozpocząć symulowany trening wysokogórski (IHHT), ale z powodu paniki zrezygnowałem jeszcze przed rozpoczęciem zabiegu,'
  );

  html = replaceAll(
    html,
    'przez 2–3 minuty bombardowałem się ekstremalnie głośnym białym szumem (dokładnie tym, co lekarze zalecają do maskowania).',
    'przez 2–3 minuty bombardowałem się ekstremalnie głośnym białym szumem (biały szum to rodzaj dźwięku, który lekarze zalecają do maskowania).'
  );
  html = replaceAll(
    html,
    'przez kilka sekund komórka jest fizycznie martwa i „niema” (okres refrakcji).',
    'przez kilka sekund komórka jest całkowicie wyłączona z działania i „niema” wskutek energetycznego wyczerpania (okres refrakcji).'
  );
  html = replaceAll(
    html,
    'alt="Portret z najtrudniejszego etapu mojej historii szumów usznych — test wytrzymałości"',
    'alt="Portret z najtrudniejszego etapu mojej historii — upadku w CFS"'
  );
  return html;
}

function fixApproach(html: string) {
  // "Lösungsansatz" needs an explicit solution direction on the page surfaces that carry that title.
  html = replaceAll(html, '<div class="eyebrow">Moje podejście</div>', '<div class="eyebrow">Moje podejście do rozwiązania</div>');
  html = replaceAll(
    html,
    '<h1>Moje podejście: co konkretnie zrobiłem, gdy zmagałem się z przewlekłymi szumami usznymi?</h1>',
    '<h1>Moje podejście do rozwiązania: co konkretnie zrobiłem, gdy zmagałem się z przewlekłymi szumami usznymi?</h1>'
  );
  html = replaceAll(html, '>Moje podejście</a>', '>Moje podejście do rozwiązania</a>');

  // Explicit author deletion: remove exactly the old causal CFS bracket in the first-episode comparison.
  html = replaceAll(
    html,
    ' (nie bez powodu mniej więcej rok później rozwinął się u mnie ciężki zespół przewlekłego zmęczenia)',
    ''
  );
  html = replaceAll(html, ' (2016/17)', '');

  // The second episode was deliberate and occurred years later; do not anchor it to 2016/17 here.
  html = replaceAll(html, 'podczas drugiego epizodu szumów usznych (2016/17)', 'podczas drugiego epizodu szumów usznych');

  // Heavy-metal support starts with elimination, not only after it is complete.
  html = replaceAll(
    html,
    'po usunięciu metali ciężkich ponownie uzupełnić wyparte pierwiastki śladowe',
    'ponownie uzupełniać wyparte pierwiastki śladowe, gdy tylko rozpoczyna się usuwanie metali ciężkich'
  );
  html = replaceAll(
    html,
    'po wyprowadzeniu metali ciężkich ponownie uzupełnić wyparte pierwiastki śladowe',
    'ponownie uzupełniać wyparte pierwiastki śladowe, gdy tylko rozpoczyna się usuwanie metali ciężkich'
  );

  // Remove the locally added audiogram-improvement rider if present in the 3–4 month result box.
  html = replaceRegex(html, /,?\s*audiogramy z mojego pierwszego epizodu[^<]*?potwierdzają[^<]*?popraw[^<]*?(?=[,.])/i, '');
  return html;
}

function fixProducts(html: string) {
  // Do not strengthen regular personal use into an explicit uninterrupted-use claim.
  html = replaceAll(html, 'Osobiście przyjmuję te produkty nieprzerwanie od 2013 roku', 'Osobiście regularnie przyjmuję te produkty od 2013 roku');

  // Restore the local German Person description: explicit CFS recovery; audiograms belong to episode 1; no extra ATP biography here.
  html = replaceAll(
    html,
    '"description": "Dustin Müller jest niezależnym autorem i pisze o swoich osobistych doświadczeniach z szumami usznymi. Dwa razy miał przewlekłe szumy uszne wywołane hałasem, które w obu przypadkach całkowicie ustąpiły. Audiogramy opublikowane obecnie na tej stronie dokumentują przebieg pierwszego epizodu szumów usznych oraz poprawę podczas zdrowienia; w raporcie z badania ATP udokumentowano wartość 0,37 w okresie CFS. W innym okresie, gdy zmagał się z CFS i objawami psychosomatycznymi, sam przekonał się, jak silnie długotrwały stres i nierozwiązane konflikty mogą obciążać układ nerwowy — oraz jak przepracowanie tych konfliktów pomogło mu przywrócić równowagę autonomicznego układu nerwowego. Nie jest lekarzem i dzieli się wyłącznie osobistym doświadczeniem oraz informacjami zdobytymi podczas własnych poszukiwań."',
    '"description": "Osoba bezpośrednio dotknięta problemem i autor publikujący we własnym zakresie. Dwukrotnie całkowicie pokonał przewlekłe szumy uszne wywołane hałasem — poprawa pierwszego epizodu jest udokumentowana kilkoma audiogramami — a także ma za sobą ciężką chorobę z zespołem przewlekłego zmęczenia (CFS). Ponadto na własnej skórze przekonał się, jak silnie długotrwały stres wewnętrzny i nierozwiązane konflikty mogą obciążać układ nerwowy — oraz jak ukierunkowana praca nad konfliktami pomogła mu przywrócić równowagę autonomicznego układu nerwowego. Nie jest lekarzem i dzieli się wyłącznie swoim osobistym doświadczeniem oraz informacjami zdobytymi podczas własnych poszukiwań."'
  );

  // Source describes taking the measured amount, not only dissolving it.
  html = replaceAll(
    html,
    'Krótko po wstaniu, zazwyczaj na czczo, rozpuszczam trzy miarki proszku w szklance wody',
    'Krótko po wstaniu, zazwyczaj na czczo, przyjmuję trzy miarki proszku w szklance wody'
  );

  html = replaceAll(html, '<a href="/pl/moje-podejscie">Moje podejście</a>', '<a href="/pl/moje-podejscie">Moje podejście do rozwiązania</a>');
  html = replaceAll(html, 'na stronie poświęconej mojemu podejściu.', 'na stronie poświęconej mojemu podejściu do rozwiązania.');
  html = replaceAll(html, '→ Przejdź do strony „Moje podejście” →', '→ Przejdź do strony „Moje podejście do rozwiązania” →');
  return html;
}

function fixNoise(html: string) {
  html = replaceAll(html, 'Ostatnia aktualizacja: czerwiec 2026', 'Ostatnia aktualizacja: sierpień 2026');

  // Audiograms document the first episode, not both episodes.
  html = replaceAll(
    html,
    'Dwukrotnie całkowicie pokonał przewlekłe szumy uszne wywołane hałasem — w obu przypadkach udokumentowane audiometrycznie — a także ma za sobą ciężką chorobę z zespołem przewlekłego zmęczenia (CFS).',
    html.includes('Dwukrotnie całkowicie pokonał przewlekłe szumy uszne wywołane hałasem — w obu przypadkach udokumentowane audiometrycznie')
      ? 'Dwukrotnie całkowicie pokonał przewlekłe szumy uszne wywołane hałasem — poprawa pierwszego epizodu jest udokumentowana kilkoma audiogramami — a także ma za sobą ciężką chorobę z zespołem przewlekłego zmęczenia (CFS).'
      : 'Dwukrotnie całkowicie pokonał przewlekłe szumy uszne wywołane hałasem — poprawa pierwszego epizodu jest udokumentowana kilkoma audiogramami — a także ma za sobą ciężką chorobę z zespołem przewlekłego zmęczenia (CFS).'
  );

  // Binding chronology: no perceived right-ear tinnitus on day 3.
  html = replaceAll(
    html,
    'Jakby tego było mało, trzeciego dnia w prawym uchu był już obecny także cichy ton. Późniejsze zalecenia lekarzy — które w moim przypadku okazały się kompletnie błędne — wyraźnie nasiliły ten ton.',
    'Jakby tego było mało, dopiero kilka dni później, po dalszej ekspozycji na dźwięk, po raz pierwszy zacząłem odbierać cichy ton także w prawym uchu. Niedługo potem późniejsze zalecenia lekarzy — które w moim przypadku okazały się kompletnie błędne — wyraźnie go nasiliły.'
  );
  html = replaceAll(
    html,
    'bo właśnie przez to mój stan się pogorszył, a cichy ton w prawym uchu stał się wyraźnie silniejszy.',
    'bo właśnie przez to mój stan się pogorszył i do problemu dołączyło także prawe ucho.'
  );

  // FAQ target is still under construction; do not present its content as already complete.
  html = replaceAll(
    html,
    'Dla wszystkich, którzy chcą zgłębić temat: w <a href="/pl/najczestsze-pytania">sekcji FAQ</a> można znaleźć dalsze ciekawe zagadnienia związane z szumami usznymi wywołanymi hałasem — na przykład wyjaśnienie, dlaczego ich głośność może się zmieniać, dlaczego na krótko cichną po zagłuszeniu i dlaczego niedługo później znowu stają się głośniejsze. Te codzienne zjawiska są tam wyjaśnione w zrozumiały sposób — na podstawie tych samych mechanizmów fizjologicznych, które zostały opisane tutaj.',
    'Dla wszystkich, którzy chcą zgłębić temat: w <a href="/pl/najczestsze-pytania">sekcji FAQ</a> będę omawiał dalsze zagadnienia związane z szumami usznymi wywołanymi hałasem — na przykład dlaczego ich głośność może się zmieniać, dlaczego na krótko cichną po zagłuszeniu i dlaczego niedługo później znowu stają się głośniejsze. Stronę FAQ tworzę obecnie krok po kroku.'
  );
  return html;
}

function fixMedication(html: string) {
  // Dustin's own two tinnitus episodes were exclusively noise-induced.
  html = replaceAll(
    html,
    'W moim przypadku wywołał je hałas (a nie nagła reakcja na lek),',
    'W moim przypadku były one wtedy wywołane wyłącznie przez hałas (a nie nagłą reakcję na lek),'
  );

  // The enzyme in this local thiol example IS the ATP-driven calcium pump, not an alternative object.
  html = replaceAll(
    html,
    'atom rtęci łączy się z zawierającym siarkę miejscem wiązania w enzymie lub pompie wapniowej zależnej od ATP i odkształca strukturę białka, przez co enzym lub pompa traci swoją funkcję',
    'atom rtęci łączy się z zawierającym siarkę miejscem wiązania w enzymie, czyli pompie wapniowej zależnej od ATP, i odkształca strukturę białka, przez co pompa traci swoją funkcję'
  );
  return html;
}

function fixStress(html: string) {
  // On this page the source is causal, not merely associative.
  html = replaceAll(html, 'Szumy uszne związane ze stresem', 'Szumy uszne wywołane stresem');
  html = replaceAll(html, 'szumy uszne związane ze stresem', 'szumy uszne wywołane stresem');
  html = replaceAll(html, 'Ostatnia aktualizacja: czerwiec 2026', 'Ostatnia aktualizacja: sierpień 2026');

  // Restore the explicit CFS/psychosomatic scope and the fact that Dustin did not heal his own stress tinnitus.
  html = replaceAll(
    html,
    'To <strong>moje własne wyjaśnienie</strong>, oparte na latach zgłębiania tematu i osobistym doświadczeniu ciężkiego stanu wyczerpania i przeciążenia układu nerwowego, przezwyciężonego dzięki pracy nad konfliktami — nie jest to standard medyczny.',
    'To <strong>moje własne wyjaśnienie</strong>, oparte na latach zgłębiania tematu i osobistym doświadczeniu ciężkiego stanu wyczerpania oraz przeciążenia układu nerwowego w okresie CFS i dolegliwości psychosomatycznych, który przezwyciężyłem dzięki pracy nad konfliktami — nie na własnym doświadczeniu z szumami usznymi wywołanymi stresem; nie jest to standard medyczny.'
  );

  // The later Prgomet passage carries the completed conflict-resolution result.
  html = replaceAll(
    html,
    'Dopiero jego praca pomogła mi wtedy rozładować te głęboko zakorzenione napięcia.',
    'Dopiero jego praca pomogła mi wtedy całkowicie rozwiązać te głęboko zakorzenione konflikty i ponownie przywrócić równowagę autonomicznego układu nerwowego.'
  );

  // Conflict work remains the main lever; physical stability supports it rather than becoming an equal foundation.
  html = replaceAll(
    html,
    'Główny nacisk powinien być położony na możliwie największe ograniczenie lub całkowite rozwiązanie konfliktów wewnętrznych, aby w ten sposób zmniejszyć szumy uszne wywołane stresem, które stanowią sedno problemu. To, w jakim stopniu uda się to w konkretnym przypadku, jest wysoce indywidualne i zależy od wielu czynników. U mnie ta droga pomogła w okresie CFS i dolegliwości psychosomatycznych w dużej mierze rozładować głęboko zakorzenione napięcia wewnętrzne; sam nie miałem szumów usznych wywołanych stresem. Równie ważne jest jednak, by sam organizm znajdował się w stabilnym stanie — stanowi bowiem fundament, na którym zachodzą te procesy psychiczne. Wyczerpany lub rozregulowany układ nerwowy reaguje silniej na napięcia wewnętrzne, podczas gdy dobrze odżywiony organizm potrafi lepiej je regulować.',
    'Główny nacisk powinien być położony na możliwie największe ograniczenie lub całkowite rozwiązanie konfliktów wewnętrznych, aby w ten sposób zmniejszyć wynikające z nich szumy uszne wywołane stresem. To, w jakim stopniu uda się to w konkretnym przypadku, jest wysoce indywidualne i zależy od wielu czynników. U mnie ta droga całkowicie rozwiązała głęboko zakorzenione konflikty z okresu CFS i dolegliwości psychosomatycznych oraz ponownie przywróciła równowagę autonomicznego układu nerwowego; moje szumy uszne nie miały komponentu stresowego. W tym modelu praca nad konfliktami pozostaje główną dźwignią centralnej drogi szumów usznych wywołanych stresem; sen, odpowiednie zaopatrzenie w składniki odżywcze i stabilność fizyczna mogą ten proces wspierać. Wyczerpany lub rozregulowany układ nerwowy reaguje silniej na napięcia wewnętrzne, podczas gdy dobrze odżywiony organizm potrafi lepiej je regulować.'
  );

  html = replaceAll(
    html,
    'według mojego doświadczenia i opinii — przełącznikiem włącz/wyłącz',
    'według mojego modelu i oceny — przełącznikiem włącz/wyłącz'
  );

  // Restore the central/peripheral distinction and keep vulnerability/perception separate from the source.
  html = replaceAll(
    html,
    'Obie główne postacie — szumy uszne pochodzące z ucha wewnętrznego i te wywołane stresem — prowadzą ostatecznie do tego samego: przewlekłego nadmiernego pobudzenia nerwów słuchowych. W pierwszym przypadku przyczyna jest fizyczna (na przykład nadmiar wapnia w komórkach rzęsatych), w drugim emocjonalna (nieprawidłowa aktywność elektryczna wywołana konfliktami wewnętrznymi).',
    'Według mojego modelu obie główne drogi prowadzą ostatecznie do nadmiernej aktywności elektrycznej w strukturach przetwarzających słuch. W drodze ucha wewnętrznego pochodzi ona z aktywnego błędnego sygnału obwodowego; w drodze stresowej — z centralnego ogniska konfliktu.'
  );
  html = replaceAll(
    html,
    'Podsumowując: szumy uszne wywołane stresem nie są urojeniem, lecz realnym procesem neurofizjologicznym. Źródło pobudzenia znajduje się w mózgu — uruchamiają je nierozwiązane napięcia emocjonalne, a nasilają niedobór energii, niedobór snu i niedobór składników odżywczych.',
    'Podsumowując: według mojego modelu szumy uszne wywołane stresem nie są urojeniem, lecz realnym zjawiskiem neurofizjologicznym. Ich centralne źródło znajduje się w nierozwiązanym ognisku konfliktu emocjonalnego w mózgu, które współaktywuje drogi przetwarzające bodźce słuchowe. Niedobór energii, brak snu i niedobory składników odżywczych mogą zwiększać podatność układu nerwowego i nasilać odczuwanie, ale nie są właściwym źródłem tej drogi szumów usznych.'
  );

  // Conflict resolution and trauma resolution are two names for the same process; processing happens mainly during sleep/dreams.
  html = replaceAll(
    html,
    'Jedną z możliwych dróg poprawy jest uświadomienie sobie tych konfliktów i rozwiązanie ich u źródła (na przykład metodą Michaela Prgometa). Sam przeszedłem tę drogę, korzystając z metody Prgometa w okresie CFS i dolegliwości psychosomatycznych, ale nie w ramach leczenia własnych szumów usznych wywołanych stresem. Z doświadczenia mojego Heilpraktikera wynika bowiem, że takie pole napięcia nie powstaje po prostu z niczego. Za każdym z tych nierozwiązanych konfliktów stoi z reguły bardzo konkretna sytuacja z przeszłości, która pierwotnie uruchomiła ten program. Jeśli ta sytuacja pierwotna zostaje na nowo przetworzona w układzie nerwowym — a więc ponownie przetworzony zostaje właściwy czynnik wyzwalający — mózg może ponownie ograniczyć trwały prąd elektrostatyczny.',
    'Według tego modelu jedną z możliwych dróg poprawy jest uświadomienie sobie konfliktu leżącego u podstaw problemu i zajęcie się nim u źródła, na przykład metodą Michaela Prgometa. Sam przeszedłem tę drogę w okresie CFS i dolegliwości psychosomatycznych, ale nie w ramach leczenia własnych szumów usznych wywołanych stresem. Prgomet nazywa ten sam proces <strong>rozwiązaniem konfliktu</strong> albo <strong>rozwiązaniem traumy</strong>; zgodnie z jego podejściem właściwe przetwarzanie zachodzi przede wszystkim podczas snu i marzeń sennych. Takie pole napięcia nie powstaje po prostu z niczego: za każdym nierozwiązanym konfliktem stoi z reguły konkretna sytuacja z przeszłości, która pierwotnie uruchomiła ten program. Gdy ta sytuacja źródłowa zostaje ponownie przetworzona w układzie nerwowym, mózg może ograniczyć trwałą aktywność elektryczną.'
  );

  html = replaceAll(
    html,
    '<div class="cta-card-sub">Kroki, które mi wtedy pomogły — osobista relacja z doświadczeń.</div>',
    '<div class="cta-card-sub">Moje kompletne podejście — wszystkie kroki i całe tło.</div>'
  );
  html = replaceAll(
    html,
    'Oczywiście pozostało jeszcze kilka pytań — dlatego przygotowałem <a href="/pl/najczestsze-pytania">podstronę FAQ</a>, na której krótko i zrozumiale odpowiadam na najczęstsze z nich.',
    'Oczywiście pozostało jeszcze kilka pytań — dlatego przygotowałem <a href="/pl/najczestsze-pytania">podstronę FAQ</a>, którą obecnie tworzę krok po kroku.'
  );
  return html;
}

function applyPathFixes(pathname: string, html: string) {
  const p = pathname.replace(/\.html$/, '').replace(/\/$/, '');
  switch (p) {
    case '/pl/moja-historia-czesc-1': return fixBio1(html);
    case '/pl/moja-historia-czesc-2': return fixBio2(html);
    case '/pl/szumy-uszne-moja-historia': return fixShortBio(html);
    case '/pl/moje-podejscie': return fixApproach(html);
    case '/pl/produkty': return fixProducts(html);
    case '/pl/szumy-uszne-od-halasu': return fixNoise(html);
    case '/pl/szumy-uszne-po-lekach-i-toksynach': return fixMedication(html);
    case '/pl/szumy-uszne-od-stresu': return fixStress(html);
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
  headers.set('x-tbr-pl-audit-fixes', VERSION);
  return new Response(fixed, { status: response.status, statusText: response.statusText, headers });
};

export const config = { path: '/pl/*' };
export { applyPathFixes };
