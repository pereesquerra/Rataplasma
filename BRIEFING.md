# BRIEFING — Rataplasma.com

> Aquest document és el punt d'entrada per a qualsevol agent (Claude Code, dev humà nou) que treballi al projecte.
> Llegeix-lo sencer abans de tocar res. Després consulta `CLAUDE_PROJECT_INSTRUCTIONS.txt` per a l'estètica del codi i convencions del Pere.

## Què és Rataplasma

`rataplasma.com` — web personal i privada del Pere per al seu nebot Pau (10-13 anys) i amics. Lloc divertit + educatiu basat en una mascota: una **rata fantasma** anomenada Rataplasma. Hi ha xat amb IA, jocs, generador d'imatges (futur), música, codi educatiu (peça central pendent).

Tres pilars:
1. **Joc visual i IA** — mascot amb personalitat, xat IA, generador d'imatges, jocs interactius
2. **Competició entre amics** — duels de prompts, enigmes, memòria, IA crea jocs
3. **Codi educatiu** — peça central. Cada element interactiu té un mode "mira el codi" amb fletxes animades, escalonat en 3 nivells (valors simples → Blockly → JS real)

## Stack tècnic actual

- **Frontend**: Vite 6 + React 18 + TypeScript + Tailwind CSS + Motion/Framer
- **Backend**: Cloudflare Pages Functions (TypeScript edge)
- **Xat IA**: Claude Haiku 4.5 (`claude-haiku-4-5-20251001`) via Anthropic API
- **Imatges IA** (futur): Workers AI Flux-1-schnell via Cloudflare
- **Auth**: localStorage + codi únic admin (`ADMINPLASMA`). Sense backend d'usuaris encara.
- **Domini**: `rataplasma.com` (CNAME a `rataplasma.pages.dev`, Cloudflare proxy)
- **Hosting**: Cloudflare Pages
- **Repo**: `github.com/pereesquerra/rataplasma`
- **Path local**: `/Users/pereesquerra24/Documents/Projectes/rataplasma/`

### Comandes vitals

```bash
# Build (sense aquest unset, NODE_ENV bloqueja devDependencies):
unset NODE_ENV && npm run build

# Deploy:
npx wrangler pages deploy dist --project-name=rataplasma --branch=main --commit-dirty=true

# Test ràpid d'audio:
ffmpeg -i public/crit-pau-v4.mp3 -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
```

### API key Anthropic

Configurada a Cloudflare Pages com a env var `ANTHROPIC_API_KEY`. **No la posis al codi.** Per executar localment, fer `.dev.vars` (excluit per `.gitignore`).

## Estat actual de la web

### Implementat

- **Login** (`/login`) — entra amb nom + codi `ADMINPLASMA`. iOS reconeix com a form de password (autocomplete correcte)
- **Home** (`/`) — disseny v4 de Claude Design integrat:
  - Mascot SVG enorme amb tatter filter (`feTurbulence` + `feDisplacementMap`)
  - Botó RATAPLASMAAAA central amb crit de 6.5s (concatenat de 2 crits reals del Pau, normalitzat a -14 LUFS, fade-out 1.5s)
  - 8 stickers clicables amb pip-pip Web Audio sintètic (NO CLIQUIS!, SECRET, PERILL!!, etc.)
  - 4 cards principals: Parla / Imatge / Duel / Codi (només `chat` activat)
  - 3 mini cards: Música (activa) / Bicis (AVIAT) / Puzles (AVIAT)
  - Reproductor de música de fons (3 pistes, ducking durant scream)
  - Topbar amb pill ADMIN + botó Surt
- **Parla** (`/parla`) — xat amb IA. TTS amb Web Speech API (català prioritari, pitch 1.6, rate 1.0). Botó 🔊 per silenciar. **Body lock + position:fixed durant la pàgina** perquè Safari iOS no salti amb el teclat.
- **Música** (`/musica`) — pàgina nova amb 3 seccions: Teclat (8 tecles solfeig amb 4 instruments), Pentagrama amb 4 cançons (Sol Solet, Mary Had a Little Lamb, Per molts anys, Cançó de la Rata), Generador (gravar fins 32 notes i reproduir). Tot Web Audio sintètic, sense fitxers externs.
- **Admin** (`/admin`) — panell buit (peticions pendents sempre 0 perquè no hi ha invitations). Llista d'aprovats històrics.
- **PWA** — `apple-touch-icon.png` 180x180, `site.webmanifest`, icones 32/64/192/512 totes amb la cara de la rata.
- **Headers Cloudflare** (`public/_headers`): HTML `no-store`, `/assets/*` immutable max-age 1 any.

### NO implementat (objecte d'aquesta sessió)

1. **Apartat Codi** (`/codi`) — peça central educativa. Pendent.
2. **Generador d'imatges** (`/crea`) — Flux-1-schnell. Pendent.
3. **Duel de prompts** (`/duel`) — Pendent.
4. **Bicis** i **Puzles** — Pendent (només cards AVIAT).

### Coses trencades / a polir

- **El crit del botó** sona, però el conjunt visual+sonor encara és millorable. La cosa que ho millorarà definitivament: substituir el crit pel d'un nen real fet bé (idealment generat amb ElevenLabs o gravació nova) i acompanyar-lo d'una música cinemàtica curta de boom orquestral. Per ara queda funcional.

## Estètica i convencions

### Paleta Tailwind actual

```
ink     #0a0a0f   (fons principal)
bone    #f4f1e8   (text principal)
phantom #6eff9e   (verd fluo principal)
haunt   #2dd866   (verd més fosc)
voltage #c77dff   (lila)
pumpkin #ff9b3f   (taronja)
blood   #ff4466   (vermell)
mist    #1a1a24   (panells/cards)
```

Tipografies (Google Fonts):
- `Silkscreen` — pixel art, headings
- `VT323` — terminal, labels
- `Atkinson Hyperlegible` — body
- `Fredoka`, `Nunito`, `Caveat` — disseny v4

### Convencions de codi

- TypeScript strict, no any
- Components funcionals, hooks
- Tailwind classes inline
- Comentaris en català
- Commits en anglès amb prefix tipus angular (`auth:`, `chat:`, `audio:`)
- Branch única `main`, deploy continu

### Convencions de comunicació amb el Pere

- Català
- Directe, sense paternalisme
- No fer comentaris sobre temps/energia/descans
- Botons d'opcions quan calgui clarificació, no llistes obertes

## TASCA D'AQUESTA SESSIÓ

### 1. Mascot fantasma més fantasmal — paleta blanc + blau lluminescent

L'actual mascot SVG és verd intens. El Pere vol un **canvi total a estil fantasma clàssic**:
- Cos **blanc lluminescent** com un fantasma de pel·lícula clàssica
- Glow **blau elèctric / cian** al voltant
- Ulls amb iris **blau gel** (no negre puro)
- Orelles rosa pàl·lid (mantenir el toc rata)
- Ombra/aura que *vibri* lleugerament
- Mantenir TOT el comportament actual: parallax cursor, leap, scream, mouth quiver, rage face

**Fitxer principal a editar**: `src/components/home/MascotV4.tsx` (i CSS `src/styles/home.css`)

**No tocar**: la lògica de scream sustained (`screamLock` keyframe, ja està sincronitzat amb el clip de 6.5s). Només els colors / gradients / glow.

També afegir paleta nova al Tailwind (`tailwind.config.ts`):
```
ghost-white  #f0f8ff   (cos)
ghost-blue   #5fc8ff   (glow)
ghost-cyan   #00e5ff   (highlight)
ear-pink     #ffd0e4   (orelles, més pàl·lid)
```

I al CSS de `home.css`, els gradients `bodyGrad`, `bodyHighlight` i el `mascot-glow` han de fer servir aquesta paleta nova.

**Prova abans de commit**: visualment a `localhost:5173` (`npm run dev`) que el mascot continuï tenint cara expressiva i no quedi pla.

### 2. Apartat Codi educatiu — `/codi` peça central

**El concepte**: el Pau aprèn a programar. La mecànica clau és que **cada element interactiu** de la web té un botó "🔍 mira el codi" que mostra com s'ha fet, amb **fletxes animades** que connecten el codi amb l'efecte visual.

#### Estructura proposada

Crear ruta `/codi` amb una pàgina que té:

**Selector de nivell** (3 botons grans):
- **Nivell 1 — Valors simples**: l'usuari toca paràmetres (mida, color, velocitat) amb sliders i veu què canvia. No escriu codi. Exemple: "el botó té mida X. mou aquest slider per fer-lo més gran".
- **Nivell 2 — Blockly**: blocs visuals que es poden encaixar (Blockly de Google, lib js gratuita). L'usuari construeix funcions petites (toca una nota, fes vibrar el mascot, mostra un sticker).
- **Nivell 3 — JavaScript real**: editor amb syntax highlighting. Mostra el codi de veritat (per exemple un fragment de `MegaButton.tsx`) i deixa modificar valors numèrics. Live preview a la dreta.

**Demos interactives** (sub-rutes o seccions):
- **`Toca un crit`**: codi del MegaButton simplificat. Slider per a pitch, distorsió, durada. El crit es regenera amb els valors nous.
- **`Mou el fantasma`**: codi del Mascot. Sliders per a mida, glow, velocitat de l'animació de respiració. Live preview.
- **`Fes una nota`**: codi de `playNote()`. L'usuari tria nota i instrument, veu el codi exacte, prem "tocar".

**Fletxes animades**:
- Quan l'usuari toca una línia de codi (per exemple `frequency.value = 1200`), una fletxa SVG animada va des de la línia fins al lloc del visual on s'aplica (per ex la barra de freqüència del so).
- Implementació: SVG paths amb `stroke-dasharray` animat i pulsació.
- Llibreria opcional: `react-xarrows` (lleugera, MIT). Si Claude Code prefereix custom amb SVG pur, també vàlid.

**Estètica**:
- Fons codi amb gradient phantom→voltage subtil
- Editor amb tema adaptat als colors del web (no Monaco directe, que és gegant — si possible CodeMirror 6 o un component custom amb Prism per al syntax highlight)
- Mascot fantasma com a "professor" en una cantonada que comenta cada nivell

#### Restriccions tècniques

- No afegir cap dependència que pesi més de 100 kB gzipped sense justificació
- Tot ha de funcionar offline (el codi es mostra estaticament, no es compila amb tsc al navegador)
- Mobile-first: els blocs Blockly no encaixen bé a mòbil — ho fas amb una vista alternativa simplificada per a mòbil (només sliders) o un "obre al desktop" amigable

#### Card "Aprèn a programar" al Home

Al `NavCards.tsx`, la card "Aprèn a programar" actualment té `locked: true`. Cal posar-la a `locked: false` i quan es clica, navegar a `/codi`.

També al `Home.tsx`, el `handleCardSelect` ha de fer `if (id === 'code') navigate('/codi')`.

### 3. Crit millorat (lleuger refinament)

Estat actual: `public/crit-pau-v4.mp3` és la concatenació de 2 crits reals del Pau (segons 3.0-6.5 + 10.5-13.8 del fitxer original `Nueva grabación 20.m4a` que ja no és al repo), amb fade-out 1.5s, normalitzat a -14 LUFS. Sona bé però es pot millorar.

**Opció A** (recomanada): afegir un **boom orquestral curt** al principi (timpani + reverb) i **una cua de música cinematográfica de 2 segons** després del crit. Resultat: 7-8 segons totals, més impactant.

**Opció B**: regenerar el clip amb **ElevenLabs Sound Effects** (suporta clips fins 22s) amb prompt:
```
Cinematic horror trailer intro: dramatic timpani boom hit, then ghostly child screams "RATAPLASMAAA" with massive reverb and delay, spooky theremin tail fading out, 7 seconds total, dark and dramatic
```
I substituir `public/crit-pau-v4.mp3` pel resultat.

**Si Claude Code escull A**: el boom orquestral es pot fer amb Web Audio API en temps real (oscil·ladors a 50 Hz amb decay, més WhiteNoise filtrat) i mesclar amb el clip MP3 existent. Cap fitxer nou.

**Si escull B**: cal crear el fitxer manualment amb ElevenLabs i pujar-lo. El Pere ho fa, no Claude Code (cal compte ElevenLabs).

Recomanació per ara: **fer A** primer i si no convenç, demanar al Pere de fer B més tard.

### 4. Coordinació amb la home actual

Quan toques colors del mascot, **revisa també**:
- Les partícules del MascotV4 (5 colors actuals: verd, lila, taronja, blanc, rosa) → poden afegir-se cyan/blau
- L'aura del CSS `.mascot-glow` (color box-shadow)
- Si el botó RATAPLASMAAAA s'integra bé visualment amb la nova paleta

## Lliuraments d'aquesta sessió

1. ✅ Mascot fantasma blanc+blau (canvi de paleta SVG i CSS)
2. ✅ Pàgina `/codi` amb selector de 3 nivells, almenys 2 demos interactives funcionant, fletxes animades
3. ✅ Card "Aprèn a programar" desbloquejada al Home
4. ✅ Crit del botó refinat (Opció A o nota explicant per què s'ha deixat per al Pere)
5. ✅ Build sense errors (`unset NODE_ENV && npm run build`)
6. ✅ Deploy fet i verificat (`https://rataplasma.com` carrega versió nova)
7. ✅ Commits petits amb missatges clars, push a `main`
8. ✅ Document final `RESUM-SESSIO-CC.md` a l'arrel amb què s'ha fet, què queda i decisions preses

## Si Claude Code té dubtes

Pregunta directament al Pere (CLI: és interactiu, pots fer prompts). El Pere prefereix botons d'opcions curtes a llistes llargues. Si el dubte és tècnic i hi ha una resposta defensable per defecte, **decideix tu mateix i deixa-ho documentat al `RESUM-SESSIO-CC.md`**.

No deixis res a mig fer. Si una part gran no es pot acabar bé, deixa-la fora i fes-la a una sessió pròpia.

---

**Fi del briefing.** Fes-ho bé.
