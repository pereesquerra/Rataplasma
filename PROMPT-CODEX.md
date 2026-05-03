# PROMPT PER A CODEX — Redisseny visual de Rataplasma

> Document a passar a Codex (OpenAI) per redissenyar tota la web amb una estètica nova de l'estil Scooby-Doo / Hanna-Barbera dels anys 70.

---

## CONTEXT: Què és Rataplasma

`rataplasma.com` és una web personal i privada feta pel Pere per al seu nebot Pau (10-13 anys) i amics. Hi ha xat amb IA (Claude Haiku 4.5), música amb teclat virtual i pentagrama, una pàgina de codi educatiu amb 3 nivells, i una mascota central: una rata fantasma anomenada **Rataplasma** (un crit típic dels personatges de Scooby-Doo davant d'una rata fantasma).

Stack: Vite 6 + React 18 + TypeScript + Tailwind CSS + Motion/Framer + Cloudflare Pages.

## REPO

`https://github.com/pereesquerra/Rataplasma` — branca `main`, treballa en una branca nova `codex-redesign`.

Path local: `/Users/pereesquerra24/Documents/Projectes/rataplasma/`

## OBJECTIU GENERAL

**Redissenya tota la web visualment i animacionalment amb estètica Scooby-Doo / Hanna-Barbera 70s.**

L'estructura tècnica i les rutes existents no canvien. La lògica de chat, login, audio engine, instruments, cançons, etc. no es toca a fons — només s'integra amb la nova capa visual. El que canvia és:

- L'aspecte de cada element (mascot, botons, cards, pentagrama, teclat, stickers)
- Les animacions i transicions
- La paleta general
- El sentiment global de la web (passar de "ràdio pirata fantasma 80s + neon" a **"capítol de Scooby-Doo amb una rata fantasma com a vilà còmic"**)

## ESTÈTICA OBJECTIU — Scooby-Doo

Pensa als capítols originals dels 70s: traços negres marcats, colors plans (no gradients HDR moderns), formes orgàniques arrodonides, ombra única plana amb deformació exagerada, fons amb texture/grain de paper antic, lletres amb tipografia de còmic Hanna-Barbera, expressions facials amb molt rang dramàtic.

### Paleta proposada (modificable)

```
Hanna-Barbera 70s color story:
- mustard      #f4c542  (groc taronja-pàl·lid, color saturat 70s)
- pumpkin      #e8772e  (taronja calabassa)
- avocado      #8aa83b  (verd alvocat 70s)
- mint-cream   #d6e9d3  (verd menta-crema, fons llum)
- harvest      #b94e2c  (vermell calabaça d'hivern)
- midnight     #1a1f3a  (blau nit profund, contorn)
- moonbeam     #f0eada  (paper antic, fons neutre)
- ghost-glow   #bce0ff  (cel·lurar suau pels efectes fantasma)
```

Tipografies:
- **Body**: cap Sans-Serif divertida (Fredoka, Quicksand, o Sniglet)
- **Títols**: una display tipus còmic Hanna-Barbera (Bagel Fat One, Lilita One, o Modak)
- **Detalls de codi**: monospace clàssica (mantén Atkinson per accessibilitat al chat)

Eliminar les fonts pixel-art i terminal actuals (Silkscreen, VT323) — no encaixen amb l'estil. Substituir per les noves.

### Trets visuals clau Scooby-Doo

1. **Contorn negre marcat** a tots els elements (1.5-3px stroke)
2. **Ombres planes desplaçades** (drop-shadow simple, no gradient — `5px 5px 0 var(--midnight)`)
3. **Formes arrodonides organiques** — res angular, tot amb curves
4. **Splashes de color rotats** com en còmics — taques fons amb -3deg de rotació
5. **Línies de moviment** quan els personatges es mouen ràpid (3 línies negres horitzontals al voltant)
6. **Núvols de sospita** ("?!", "👻", estrelles de surprise) com bombolles de còmic
7. **Texture de paper** subtil al fons (grain noise)
8. **No hi ha gradients HDR** — màxim un gradient de 2 colors plans amb corona dura
9. **Glow només per a fantasmes**, no per a UI — el fantasma té un halo blau pàl·lid `ghost-glow`, els botons no
10. **Tot pot vibrar** — quan el mascot crida, l'escena sencera fa una vibració còmica de 3-4 frames stop-motion

## EL MASCOT — RATAPLASMA RAT GHOST

### Estat actual (què canviar)

`src/components/home/MascotV4.tsx` — SVG inline amb forma de "patata vertical", verd intens (que el Pere va demanar canviar a blanc/blau però segueix sent simple). Ulls grans rodons, orelles ovals roses, cua petita. Hi ha 3 estats: idle (respira, pestanyeja), leap (pugit + rotació), screaming (boca oberta gegant amb dents).

Problema: massa "pla" i "senzill". Sembla un emoji-mascot. Cap volum visual ni caràcter.

### Què volem

Un personatge dibuixat com els personatges de Scooby-Doo (Velma, Shaggy, però en versió rata fantasma):

- **Forma**: perita amb cap molt més gros que el cos (proporcions de Scooby), no rodoneta uniforme
- **Bigotis llargs i marcats**, no els 3 traços actuals
- **Orelles rosades grans** com l'estil clàssic de rata animada — amb interior diferenciat
- **Ulls expressius enormes** amb iris color avocat o pumpkin (no negre puro), pupil·les amb forma elíptica vertical, brillet blanc grossot
- **Boca expressiva** amb dents superiors visibles tipus rateta (no només dents de scream)
- **Cua llarga** que es mou orgànicament (curve animation)
- **Aura fantasmal** estil Casper — fons translúcid blau pàl·lid sota el mascot, no del cos sencer (només la part baixa, com si flotés)
- **Ombra plana** desplaçada a baix i a la dreta (Hanna-Barbera signature)
- **Posa idle** lleugerament inclinat 5° amb gesto pícar/curiosa (no centrat-rígid)

### Animacions noves del mascot (Motion/Framer)

- **idle**: respiració més suau (2.5s cycle, scale 1.0 → 1.04 → 1.0), cua oscil·la 3° dret-esquerra (4s), pestanyeig cada 5-7s
- **hover** (cursor a sobre): orelles s'aixequen una mica, ulls segueixen el cursor (parallax sutil però menys exagerat que ara)
- **scream** (clica botó): 4 frames stop-motion (com Hanna-Barbera als 70s no animaven a 24fps sinó a 6-8): boca oberta, ulls bells, mans aixecades, cua eriçada — cada 250ms canvia. Línies de moviment al voltant. La pantalla sencera vibra 3 frames.
- **happy** (resposta del chat): salta amb sonriure, dansa lleu
- **think** (esperant resposta): mà a la barbeta, cella aixecada, mira amunt

Implementa-ho amb Motion/Framer (`motion.svg` i `<motion.path>` keyframes).

## REDISSENY DE CADA PÀGINA

### Home (`/`)

#### Estat actual
- Header: nom + ADMIN + Surt
- Mascot gegant central
- Botó RATAPLASMAAAA central (gran, lila gradient)
- 4 cards principals (Parla, Imatge, Duel, Codi) — només Parla i Codi actius
- 3 mini-cards (Música, Bicis, Puzles) — només Música activa
- 8 stickers clicables al voltant
- Reproductor de música a sota a l'esquerra (3 pistes amb prev/play/next)

#### Què canvia
- Fons amb textura paper antic + splash mustard rotat
- Mascot reemplaçat pel nou disseny
- Botó: forma de bombolla de còmic, lletra display gran, contorn negre 3px, ombra desplaçada plana
- Cards: estil "polaroid" girades lleugerament, contorn negre, ombra plana. Cada card té un color sòlid distintiu (mustard, pumpkin, avocado, harvest)
- Stickers: més artesanals, com retallats de paper amb taca de pegament — algunes bordes irregulars (com si fossin trencats). Ja són clicables, mantenir-ho.
- Reproductor: rotllo de cinta de cassette estilitzat amb els 3 títols visibles, no una píndola moderna
- Topbar: tira de paper estretxa amb nom + admin pill com a placa policial dibuixada

### Chat (`/parla`)

Actualment xat estàndard amb bombolletes verdes (usuari) i grogues (rata), input a baix, header amb mascot petit i toggle de veu.

Nou:
- **Marc**: tota la conversa en un quadre estil còmic — bombolletes diferents per cada parlant, col·locades a esquerra/dreta com tira còmica
- **Bombolles còmic**: les del usuari estil pensament arrodonit amb cua, les de la rata estil bombolla normal de diàleg amb cua. Contorn negre, ombra plana, color avocat per usuari, mustard per la rata
- **Mascot petit fantasmal** flotant a la dreta del chat (no al header) que reacciona als missatges: feliç al rebre, pensa esperant resposta
- **Onomatopeies** al fons quan la rata parla: petites paraules tipus "ZOINKS!", "JINKIES!", "RATAPLASMA!" en lletres grosses i rotades, esvaint
- **Input style**: no caixa rectangular plana — un pergamí o paper de nota arrugat en el qual escrius
- TTS i botó silenci es mantenen funcionalment

### Codi (`/codi`)

3 nivells (Valors, Blocs, JS), 2 demos (Toca un crit, Mou el fantasma), fletxes SVG animades.

Nou:
- **Layout**: tipus pàgina de quadern escolar amb línies horitzontals i marges vermells
- **Selectors de nivell**: rètols clavats com pòsters de "Wanted" amb el nom del nivell
- **Demo "Toca un crit"**: la mascota petita fantasma està dins d'una caixa estil "registre de proves" amb sliders dibuixats com a perilles antigues de ràdio
- **Demo "Mou el fantasma"**: el mascot petit camina dins d'un quadre i els sliders són palanques de control de tren / submarí estil retro
- **Fletxes**: en lloc de Bezier electriques cyan, dibuixades a mà amb línia gruixuda negra i puntera triangular, com diagrames de detectiu
- **Codi**: editor amb estètica de paper mecanografiat, font monospace, amb les variables clicables tipus "evidència rodejada amb cercle vermell"

### Música (`/musica`)

Pàgina amb teclat de 8 tecles (Do-Sol), pentagrama amb 4 cançons, generador de seqüències.

Nou:
- **Teclat**: tecles de fusta antiga (textura), com piano Steinway 70s en lloc de blocs de color brillant
- **Pentagrama**: full de partitura groguenc amb les notes dibuixades a mà tremolós
- **Selector de cançons**: targetes de gramòfon antic
- **Selector instrument** (Piano, Xilofon, Rata, Synth): com botons grans rodons de tocadiscs (Piano = vinyl, Xilofon = barres, Rata = cara mascot petit, Synth = sintetitzador retro)
- **Generador**: cinta de paper enrotllada on van apareixent les notes que toques

### Login (`/login`)

Actualment: caixa vertical estèril amb mascot a dalt i 2 inputs.

Nou:
- **Marc**: cartell de mystery van — fons textura camionet groc (com el van de Scooby-Doo), pintades caigudes
- **Inputs**: estil tags de pista de detectiu amb etiqueta "NOM" i "CODI SECRET"
- **Botó ENTRA**: estil pòster antic ("ENTRA SI T'ATREVEIXES")
- **Mascot**: peeking des d'una cantonada o darrere d'un arbre del background

### Admin (`/admin`)

Panell minimalista actualment.

Nou:
- **Estètica de despatx de detectiu**: pissarra de suro amb fotos de pendents lligades amb cintes vermelles
- Si no hi ha peticions: cartell "tot tranquil al món real" amb mascot dormint

## ANIMACIONS GENERALS

- **Transicions de pàgina**: cortina de teatre o "swipe de pàgina de còmic" entre rutes (Motion/Framer + AnimatePresence)
- **Hover** sobre cards/botons: lleugera vibració còmica + ombra més intensa, NO scale fluid de moltes apps actuals
- **Click feedback**: el botó es deforma 1 frame i torna (squash & stretch)
- **Loading**: si hi ha qualsevol loader, ha de ser el mascot fent una acció graciosa, no un spinner
- **Easter eggs**: clics multipulsats al mascot disparen exclamacions ("ZOINKS!"), idle long → mascot mira l'usuari amb expressió "què" 

## REGLES INVIOLABLES

1. **No trenquis cap funcionalitat existent**: el TTS, el chat amb Claude API (Pages Function), el login amb codi `ADMINPLASMA`, el reproductor de música, els 3 nivells del `/codi`, les rutes existents (`/`, `/login`, `/parla`, `/codi`, `/musica`, `/admin`) — tot ha de continuar funcionant.
2. **No trenquis l'audio engine**: `src/lib/audio-engine.ts` i `src/lib/instruments.ts` són estables. Si vols canviar timbres, fes-ho via paràmetres, no reescrivint.
3. **Mantén l'accessibilitat**: contrast suficient, focus visible als inputs, aria-labels.
4. **Mòbil first**: el redisseny ha de ser excel·lent al iPhone Safari. La majoria d'usuaris (el Pau, els amics) entraran amb mòbil. Cap interacció pot dependre de hover. Mai hi pot haver text < 16px en inputs (iOS auto-zoom).
5. **No afegir dependències pesades sense justificació**: si necessites una llibreria, ha de ser <50kB gzipped. Per a SVG icons, fes servir SVGs inline. No npm install lottie-react ni cap player de Lottie pesat.
6. **No facis servir imatges raster** generades amb IA dins el repo: tot SVG o CSS. Si vols un fons de paper amb textura, genera'l amb noise SVG filter o un small PNG dataURI.
7. **El crit del Pau** (`public/crit-pau-v4.mp3`) i les 3 pistes de música no es toquen.
8. **El boom orquestral pre-crit** (Web Audio dins MegaButton) es manté funcionalment, només adapta visualment què passa quan es clica.
9. **TypeScript strict, no `any`**, comentaris en català, commits en anglès format Angular.

## LLIURABLE

A la branca `codex-redesign`, fes commits petits i descriptius. Quan acabis:

1. Una previa visual: instruccions per executar `npm run dev` i URL de localhost
2. Un fitxer `REDISSENY-CODEX.md` a l'arrel amb:
   - Captures de pantalla (descripcions textuals si no pots generar PNG)
   - Decisions de disseny preses
   - Llibreries afegides (si n'hi ha) amb justificació
   - Coses no acabades o amb compromisos
   - Què canvia respecte a la versió anterior
3. **No facis merge a main**. Deixa la PR oberta per al Pere a decidir.

## REGISTRE DE COSES QUE NO HAS DE TOCAR

- `functions/api/chat.ts` — Pages Function que crida l'API d'Anthropic
- `src/lib/auth.ts` — autenticació amb codi únic
- `src/lib/api.ts` — wrappers
- `src/lib/audio-engine.ts`
- `src/lib/instruments.ts`
- `src/lib/cancons.ts`
- `src/lib/tts.ts`
- `wrangler.toml`
- `public/_headers`
- `public/crit-pau-v4.mp3`, `public/pista-*.mp3/.m4a`, `public/icon-*.png`, `public/site.webmanifest`, `public/apple-touch-icon.png`
- `BRIEFING.md` (briefing de la sessió anterior amb Claude Code)

Pots editar tots els altres `.tsx`, `.ts` que tinguin a veure amb la presentació visual.

## TESTING ABANS DE COMMITAR

- `npm run build` ha de passar sense cap error
- A localhost, naveggar a totes les rutes (`/`, `/login`, `/parla`, `/codi`, `/musica`) i comprovar:
  - El mascot apareix i s'anima
  - El crit funciona
  - El chat envia missatges i rep respostes
  - El TTS toca quan rep resposta
  - El teclat toca notes
  - El pentagrama reprodueix les cançons
  - El generador grava i reprodueix
  - Els 3 nivells de `/codi` funcionen i les fletxes connecten

## DUBTES

Si tens algun dubte gran de disseny, fes-ho amb 2-3 alternatives a `REDISSENY-CODEX.md` i deixa-ho marcat com a "decidir pel Pere". Si és tècnic, decideix tu mateix amb la millor pràctica i documenta-ho.

---

**Fi del prompt.** Fes-ho amb cura.
