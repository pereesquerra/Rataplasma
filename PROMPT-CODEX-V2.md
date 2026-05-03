# PROMPT-CODEX-V2 — Rataplasma des de zero

> **Per Codex.** Tot el codi previ del repo s'ha buidat. Tens un repo net amb només l'esquelet mínim de Vite + React + TypeScript + Tailwind + Cloudflare Pages. La feina és construir **una web nova de cap a peus** seguint aquesta narrativa. **No t'has d'inspirar en el codi anterior.** Aquesta web es farà des del no-res.

---

## QUI ÉS EL PAU

Pau té entre 10 i 13 anys. És el nebot del Pere. Toca **guitarra** (notes, acords, comença a llegir partitura). Té curiositat per la **tecnologia** i el **codi**. Té amics que l'envoltaran a la web; serà ell qui els convidi.

Aquesta web és un **regal del Pere al Pau**. No és per a tothom. És una habitació personal amb el seu nom escrit a la porta. Hi ha d'haver coses divertides, hi ha d'haver coses educatives sense ser-ho explícitament, i hi ha d'haver una mascota que és **seva**: una **rata fantasma** (origen del nom: el crit "ra-ta-plas-ma!" que els personatges de Scooby-Doo fan en veure una rata). El nom de la mascota és l'únic que es manté sense discussió: **Rataplasma**.

A diferència de l'idealització, Pau **no és un nen genèric**. És un nen que té el cap obert, vol coses noves i sap quan una cosa és "de petits". Si la web sembla una app de preescolar, ja l'ha perdut. Si sembla una eina de codi avorrida, també. Hauria d'estar a la frontera entre joc i lloc de creació.

---

## EL QUE VIU EL PAU QUAN ENTRA

1. Posa el seu codi privat (`ADMINPLASMA`) i entra a un lloc que **és seu**. Reconeix el seu nom, el saluda, l'edat dels colors i les formes és la seva.
2. Hi ha una **rata fantasma** que viu allà. Es mou. Té personalitat. Pau pot **parlar amb ella** i la rata respon en català, amb veu pròpia (TTS), exagerada, una mica ximple, com el fantasma d'un dibuix animat però *original* (no Hanna-Barbera, és la nostra). Mai diu coses inadequades per a la seva edat.
3. Hi ha una **secció de música** on Pau, que toca guitarra, pot trastejar amb un teclat virtual, veure pentagrames de cançons reals i compondre-les ell.
4. Hi ha una **secció de codi** on Pau toca paràmetres i veu què canvia visualment al moment, amb fletxes que connecten el codi amb l'efecte. Té diferents nivells de profunditat: del slider simple fins al codi JavaScript real que pot tocar.
5. Hi ha llocs **per fer ell coses**, no només per consumir-les: pot demanar imatges a la IA, pot enviar reptes als seus amics quan li donem accés, pot guardar les seves "creacions".
6. Quan acaba i tanca el navegador, té ganes de tornar demà. **Aquesta és la mètrica única**: tornar.

---

## QUINS APARTATS SI O SI

Aquests cinc són la base. Codex els ha de fer tots, encara que la presentació sigui radicalment diferent del que t'imaginis "típic". Pots inventar nivells de detall i petites sorpreses internes:

### 1. **Habitació principal** (la home)
La porta d'entrada un cop fet login. Aquí viu la mascota, hi ha el botó central que li dispara una "acció signature" (un crit, un ball, una explosió de partícules — tu decideixes), i hi ha les portes a les altres habitacions. Sense menús d'app moderna. Pensa-ho com un **tauler de joc**, una **cartelera**, o una **taula amb objectes** (estil Stardew Valley) on cada objecte porta a una pàgina.

### 2. **Parla amb la Rata** (chat IA)
Conversa lliure amb la mascota. Hi ha un endpoint backend ja muntat: `POST /api/chat` que rep `{messages: [{role, content}]}` i retorna stream de Claude Haiku. Cal usar aquest endpoint, no inventar-ne un de nou.

La rata respon **en català**, amb personalitat: **dramàtica, una mica ximple, exagerada, es distrau parlant de formatge i fantasmes, té un crit signature que repeteix ("rataplasmaaa!")**. Mai grollera. Mai fa coses inapropiades per nens de 11-13. El system prompt ja existeix a `functions/api/chat.ts` però el pots reescriure si vols millorar-lo.

Hi ha **TTS**: la resposta es llegeix en veu alta amb la Web Speech API del navegador, prioritzant veus en català (`ca-ES`, `Montserrat`, `Mónica`). Pitch alt, velocitat 1.0. Botó per silenciar.

A iPhone Safari, **el chat no pot saltar amunt i avall quan apareix el teclat**. Solucions provades anteriorment que han funcionat: `position: fixed` al body, `100svh`, `interactive-widget=resizes-content` al meta viewport. Decideix tu la millor implementació però hi ha de funcionar bé.

### 3. **Música**
Pau toca guitarra. Aquí ha d'aprendre i jugar amb les notes. Mínim:
- Un teclat virtual (8 tecles, escala C-major: Do Re Mi Fa Sol La Si Do agut)
- 4 instruments triables (piano, xilofon, una "rata squeak" graciosa, un synth)
- Pentagrama amb **almenys 3 cançons** que Pau pot tocar i escoltar (suggeriments: "Sol Solet", "Per molts anys" / "Happy Birthday", una cançó signature de la Rata)
- Un mode **gravar i reproduir**: Pau toca una seqüència de fins a 32 notes i la rata les repeteix
- Tot generat amb **Web Audio API**, sense fitxers d'àudio externs

Si vols anar més enllà (record amb tempo, exportar com a fitxer, mode bucle, sintonies pre-fetes per modificar), benvinguda.

### 4. **Codi**
La peça pedagògica. Pau toca paràmetres i veu què canvia.

Implementa **3 nivells progressius**:
- **Nivell 1 — Sliders**: cap codi visible. Sliders que canvien valors visuals d'una demo. Pau veu *l'efecte*, encara no pensa en codi.
- **Nivell 2 — Blocs**: blocs visuals encadenables que el Pau pot reordenar (drag and drop). Cada bloc té un nom llegible: "tocar nota Do", "esperar 0.5 segons", "fer més gran". Pot encadenar-los i pitjar play. Sense Blockly real (massa pesat); fes-ho amb React + drag handlers o amb una llibreria <50kB.
- **Nivell 3 — JS real**: editor de codi amb syntax highlight, mostrant el codi exacte que es fa servir a la demo. Pau pot canviar valors numèrics (no estructura completa) i veure el resultat. Cap dependència gegant tipus Monaco — fes-ho amb un highlighter casolà o Prism.

Demos suggerides (**fes-ne com a mínim 2**): tocar un crit (paràmetres: freqüència, durada, distorsió), moure el fantasma (mida, glow, velocitat), generar formes (radi, costats, color). Tu decideixes.

**Fletxes animades** que connecten les línies de codi amb els controls visuals. Implementació SVG amb `stroke-dasharray` animat. Mòbil pot tenir un fallback més simple (fletxes amagades, layout vertical).

### 5. **Apartat creatiu** — pensa'l tu
Pots inventar la quarta secció. **No copiis de cap web existent**, pensa el que **un Pau de 11 anys voldria fer en aquesta web** que no fa enlloc més. Algunes idees per esperonar (no còpies, inspira't):
- Un generador d'imatges IA (hi ha endpoint `POST /api/imatge` amb Workers AI Flux disponible — pots crear-lo si no existeix)
- Un mural compartit on Pau hi pot deixar coses per quan els amics entrin
- Un mini-laboratori on combina coses: rata + música = videoclip d'un crit musical
- Un sistema de reptes que enviarà als amics quan tinguem usuaris convidats
- Un tracker de la seva pràctica de guitarra
- Una "ràdio Rataplasma" que mescla pistes generades + crits

Trie tu. Documenta per què al `CHANGELOG.md`.

---

## REQUISITS TÈCNICS

### Stack obligatori
- **Vite 6** + **React 18** + **TypeScript strict** + **Tailwind CSS** + **Motion (Framer)** + **React Router**
- Hosting: **Cloudflare Pages** (build dir `dist`)
- Backend: **Cloudflare Pages Functions** (TypeScript, edge)
- Repo: branca `fresh-start` de `github.com/pereesquerra/Rataplasma`

### Endpoints backend disponibles / per crear
- `POST /api/chat` — Claude Haiku 4.5 (`claude-haiku-4-5-20251001`). API key a env var `ANTHROPIC_API_KEY` (ja configurada al projecte Cloudflare). Stream SSE.
- (Opcional) `POST /api/imatge` — Workers AI Flux-1-schnell. Si l'uses, crea-ho amb el binding pertinent.

### Auth
- Codi únic d'admin: **`ADMINPLASMA`** — només pot entrar el Pau (i el Pere).
- Sessió guardada a localStorage (`rataplasma.user.v3` o key nova si vols).
- No cal sistema de convidats encara (el farem en una sessió pròpia).
- Login amb input `type="password"` i `autocomplete="current-password"` perquè el iOS Keychain ho guardi.

### Headers Cloudflare (`public/_headers`)
- `/*.html` i `/`: `Cache-Control: no-store, must-revalidate`
- `/assets/*`: `Cache-Control: public, max-age=31536000, immutable`

### Mòbil
- **Mobile-first**. iPhone és el dispositiu primari del Pau.
- Inputs: `font-size: 16px` mínim per evitar auto-zoom de iOS.
- Cap interacció depèn de hover.
- Touch targets >= 44x44 pt.

### Accessibilitat
- Contrast mínim AAA per text gran, AA per la resta
- Focus visible
- aria-labels al lloc on cal
- Animacions respecten `prefers-reduced-motion`

### Cap dependència gegant
- Cap llibreria > 80 kB gzipped sense justificació al `CHANGELOG.md`
- Sense Lottie players, sense Monaco editor, sense Three.js (a no ser que ho documentis fort)
- Tot SVG inline, no PNGs/JPGs raster generats per IA dins el bundle

---

## CULTURA VISUAL — INSPIRA'T, NO COPIIS

**No reprodueixis l'estètica de la versió anterior** (era cartoon-flat amb gradients neon i un mascot que semblava un emoji).

**No copiis Scooby-Doo** ni cap mascota existent. Per copyright i per personalitat.

**Fes la teva pròpia direcció d'art.** Algunes referències que pots considerar (no copiar — destil·lar):
- **Estètica handmade / craft**: com si la web fos un quadern del Pau on retalla i enganxa coses
- **Ghost mood modern**: cyans i blancs lluminescents, no verds tòxics
- **Animació stop-motion**: 6-8 fps, no 60 fps fluid, dona caràcter
- **Tipografia rica**: barreja de tipus (display per a títols, monospace per a codi, una cursiva manuscrita per a notes de la rata)
- **Sound design lligat al visual**: cada acció té un so propi, generat per Web Audio (no fitxers)
- **Profunditat amb capes**: parallax suau, ombres planes amb intenció (no drop-shadows-blur per defecte)

Vol fugir del look "Tailwind tutorial 2024" — gradients morats sobre cards arrodonits amb glow neon. Vol que sembli **un lloc**, no una **app**.

Si decideixes una direcció concreta, posa-la al `CHANGELOG.md` amb 5-6 línies que justifiquin el perquè. Si dubtes entre dues direccions, fes les dues a `/proves/[nom]` i deixa que el Pere decideixi.

---

## EL MASCOT — RATAPLASMA

Pots dibuixar-lo com vulguis sempre que sigui:
- Una **rata fantasma** (les dues coses: orelles + cua + boca de rata; cos translúcid + flotant + glow + aura del fantasma)
- **Original**, no còpia de cap personatge existent
- **Animat amb personalitat** — no estàtic. Idle expressiu, reacciona a accions, té estats clars (calmat, parlant, sorprès, content, espantat).

Format: **SVG inline** amb Motion/Framer per a les animacions. No fitxers .lottie ni .gif.

Si vols, pots pensar **diverses pose-rats** (un sticker-set complet) i reutilitzar-les a diferents llocs (al chat, al codi, a la música).

---

## LLIURABLES

Treballant a la branca `fresh-start`:

1. Codi nou, complet, build neta (`unset NODE_ENV && npm run build` ha de passar)
2. Servidor local funcionant (`npm run dev`) amb totes les rutes accessibles
3. **CHANGELOG.md** a l'arrel amb:
   - Direcció artística que has triat i per què
   - Decisions tècniques no òbvies
   - Llibreries afegides amb justificació de mida
   - Què s'ha implementat i què queda fora
4. **README.md** actualitzat amb com córrer el projecte i la lògica del rule book
5. Commits petits (mínim 1 per secció gran), missatges en anglès format Angular
6. Push a `origin/fresh-start`
7. **No facis merge a main**. Deixa-ho per al Pere.

---

## QUÈ ES MANTÉ

L'únic que es manté del repo anterior:
- L'API key d'Anthropic configurada a Cloudflare Pages
- El nom del domini i el projecte
- L'arxiu d'àudio del crit del Pau (`public/crit-pau-v4.mp3`) — pots fer-lo servir o deixar-lo
- Les 3 pistes de música de fons (`public/pista-1.m4a`, `public/pista-2.mp3`, `public/pista-3.mp3`) — pots fer-les servir o deixar-les
- El codi `ADMINPLASMA`
- Aquest document i els altres `*.md` informatius

Tot el codi font (`src/`, `functions/api/chat.ts`) **es reescriu**. El Pere ja ha fet `git rm -r src/` i `rm -rf src/` a la branca `fresh-start` abans de passar-te el control.

---

## DUBTES?

Si tens un dubte petit, decideix tu i deixa-ho documentat. Si és gran, escriu-ho al `CHANGELOG.md` amb les opcions i deixa que el Pere triï a la review.

**El Pere prefereix botons de pocs ítems a llistes obertes** — si demanes alguna cosa, dona 2-4 opcions concretes.

**Pere parla en català.** Tota la documentació, comentaris al codi, missatges UI han de ser en català. Excepció: commit messages en anglès Angular.

---

**Fi del prompt.** Ves-hi.
