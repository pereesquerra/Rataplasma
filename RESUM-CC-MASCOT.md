# RESUM-CC-MASCOT.md — Sessió mascot PNG (2026-05-03)

> Sessió curta, focalitzada al mascot. Briefing: `BRIEFING-CC-MASCOT.md`.

## Què s'ha fet

### 1 · Fons negre fora dels PNG (Opció A adaptada)

ImageMagick **no està instal·lat** al Mac (`magick` i `convert` absents, `brew list imagemagick` confirma). Per no obligar el Pere a `brew install` he fet servir el camí equivalent en **Python + PIL** (PIL ja hi era):

- `scripts/remove_black_bg.py` — converteix les 6 PNGs a transparència real:
  - **Banda 1** — píxels amb `max(R,G,B) ≤ 18`: `alpha = 0` (fons pur)
  - **Banda 2** — `19 ≤ max(R,G,B) < 50`: alpha proporcional, color **sense desmultiplicar** → vora suau sense halo cromàtic (clau per evitar aurèoles als bigotis)
  - **Banda 3** — `max(R,G,B) ≥ 50`: alpha `255` i color **desmultiplicat** (`r' = r·255/max`) → recupera el color original i el subject queda bonic també sobre fons clars
- Resultat: ~75% píxels totalment transparents, ~25% opaque (subject pur). PNGs reduïdes ~25-50% de mida (fewer non-zero pixels → millor compressió).
- Originals al backup `scripts/_orig-mascot/` (no `public/_orig/`, vegeu decisions).

Comparativa de mida:
```
idle      471 → 212 kB
parlant   302 → 222 kB
content   304 → 231 kB
espantat  315 → 240 kB
ballant   299 → 223 kB
pensant   309 → 229 kB
```

Verificat amb `Image.split()[3].histogram()`: alpha pur i transparent funcionen bé. **No s'ha aplicat `mix-blend-mode`** al component nou — ja no cal.

### 2 · MascotSprite reescrit amb tot el moviment del V4 antic

Reemplaçat completament `src/components/home/MascotSprite.tsx`. Estructura per capes (cadascuna amb una sola responsabilitat d'animació, separades perquè es puguin barrejar sense que es trepitgin):

```
.mascot-sprite-wrap          ← respiració+float idle, scream-lock zoom, dance rotate
  .mascot-sprite-halo        ← halo cyan/blau pulsant; vermell+ràpid quan crida
  .mascot-sprite-shake       ← traducció violenta -3..+3px durant els 6.8s del crit
    .mascot-sprite-bump      ← squash & stretch un cop per canvi de pose (key remount)
      <img.mascot-sprite-img>  ← stack de 6 imatges, opacity 0/1 per pose
```

CSS afegit a `src/styles/home.css` (al final del fitxer, sense tocar res del MascotV4 antic):

| Estat                | Animació wrap                  | Halo            | Drop-shadow img       |
|----------------------|--------------------------------|-----------------|-----------------------|
| Idle                 | `spriteIdle 5.4s`              | cyan pulse 3.4s | cyan 36px             |
| Curiós (cursor over) | `spriteIdle 4.2s` (més ràpid)  | cyan pulse      | cyan                  |
| Ballant (`leaping`)  | `spriteDance 0.9s` (rotate ±5°)| cyan pulse      | cyan intens 24px      |
| Crit (`screaming`)   | `spriteScreamLock 6.8s` zoom 1.15 | **vermell ràpid 0.45s** | **vermell 18+30px** |

Sacseig: `spriteShake 0.07s steps(2) infinite` només dins de `.is-scream` — actua sobre la capa `.shake`, no sobre el `.wrap`, perquè el `.wrap` continua fent el zoom-in còmic sense interferència.

Squash & stretch en cada canvi de pose: el truc és que `.mascot-sprite-bump` té un `key={bumpKey}` a React. En cada canvi de pose `useEffect` incrementa `bumpKey` → React remunta el div → l'animació `spriteBump 0.32s` es torna a disparar des de zero. Sense aquest "key reset", la mateixa animació CSS no es re-executaria.

`prefers-reduced-motion` desactiva totes les animacions (accessibilitat).

### 3 · Pose triggers (sense canvis al `Home.tsx` per la meva banda)

`Home.tsx` ja l'havies actualitzat tu per importar `MascotSprite` enlloc de `MascotV4` (no l'he tocat). El component nou rep els mateixos props (`leaping`, `screaming`, `eyeTarget`) i s'integra immediatament.

El **parallax cursor** sobre el contenidor extern ja el feia `Home.tsx` (línia ~106-107 amb `parallax.x * 14px`); el component nou no necessita tocar-ho.

## Decisions tècniques no òbvies

| Decisió | Per què |
|---|---|
| **Python PIL en lloc d'ImageMagick** | `magick` no estava instal·lat. Demanar `brew install` afegia fricció innecessària, PIL ja era al sistema. El resultat és equivalent (luminance-as-alpha + unpremultiply) i probablement millor que `magick -fuzz 10% -transparent black`, que pot deixar halo cromàtic a les vores. |
| **3 bandes (transparent / soft edge / opaque) en lloc de fuzz pla** | Un fuzz pla deixa una "anella negra" als contorns. La banda mig (color sense desmultiplicar) actua com a anti-aliasing, la banda alta (desmultiplicada) recupera els blancs purs perquè es vegin "blancs" i no "grisencs" sobre fons clars. |
| **Backup a `scripts/_orig-mascot/` i no a `public/_orig/`** | Si quedés dins `public/`, Cloudflare Pages publicaria 2 MB extra al CDN. Fora de `public/` és inert. |
| **CSS keyframes en lloc de Framer Motion** | El brief el suggeria com a "tècnica" però no era obligatori. Motion ja està al projecte però no s'usava per al mascot; mantenir CSS pur evita re-renders, és més lleuger i el component es manté petit (~80 línies). El sacseig de 0.07s en particular funciona millor com a steps animation que com a Motion spring. |
| **Capes separades** (`wrap` ≠ `shake` ≠ `bump`) | Si totes les animacions estiguessin al mateix node CSS, el `transform` final seria una multiplicació impossible de gestionar (CSS no apila transforms de keyframes). Separar-les permet barrejar zoom + sacseig + squash sense que es cancel·lin entre ells. |
| **`key={bumpKey}` per re-disparar el squash** | És el patró canònic React per "reiniciar una animació CSS". Alternatives (animation-name swap, `animationend` listener) són més complexes i propenses a races. |
| **Prioritat de pose: scream > leap > cursor > idle/parlant** | El brief no la fixa explícitament; aquesta és la natural (un crit no s'interromp per un cursor over). |
| **Idle alterna `idle ↔ parlant` cada 4.5s** | Heretat del component anterior, té sentit pedagògic ("el mascot diu coses sol"). |
| **MascotV4.tsx antic NO eliminat** | Encara existeix però ja no s'importa enlloc (Home.tsx ara importa MascotSprite). El deixo per si es vol comparar/tornar enrere. Ocupa ~9 KB, no afecta el bundle perquè tree-shaking l'exclou. |

## Build & criteris d'acceptació

- `unset NODE_ENV && npm run build` → ✅ build neta (`tsc -b && vite build`, sense warnings)
- Bundle: `index.css` 52.25 → 55.49 kB (**+3.24 kB**, dins el límit de 10 kB) · `index.js` 357 → 346 kB (**-11 kB** perquè ja no s'importa el SVG inline gegant del MascotV4)
- Dev server actiu a **http://localhost:5173/** (Vite v6.4.2, ready ~900 ms)
- Verificat per typecheck (sense errors), build i lectura del codi. La validació visual (mòbil, scream complet) la fas tu obrint la web local.
- **No s'ha fet `wrangler pages deploy`** — el brief ho prohibia explícitament.

## Què queda per polir si el resultat no convenç

- **Edge halo** als bigotis: si veus una línia gris fina a les vores blanques, baixa `SOFT_EDGE` a `35` al script i torna a executar. Els originals estan al backup, sempre pots restaurar amb `cp scripts/_orig-mascot/*.png public/mascot/`.
- **Sacseig massa o massa poc**: a `home.css` keyframe `spriteShake`, modificar la magnitud (3px → 5px més violent, 2px més suau).
- **Glow vermell del crit massa intens**: `home.css` `.mascot-sprite-wrap.is-scream .mascot-sprite-img` baixar opacities `0.85` → `0.6`.
- **Squash massa marcat en cada canvi**: `spriteBump` reduir el `1.10/0.92` a `1.05/0.96` perquè sigui més subtil.
- **Escala del scream zoom**: `spriteScreamLock` la peak està a `scale(1.15)`. Pot anar fins a `1.22` si vols més impacte.

Tot són canvis d'una línia o dues. Comencem dolços, després pugem el volum si convé.

## Fitxers tocats

```
M  src/components/home/MascotSprite.tsx        (reescrit complet, 80 línies)
M  src/styles/home.css                         (+150 línies al final, secció MASCOT SPRITE)
M  public/mascot/{idle,parlant,content,espantat,ballant,pensant}.png  (transparència real)
A  scripts/remove_black_bg.py                  (script de processament idempotent)
A  scripts/_orig-mascot/*.png                  (backup originals)
A  RESUM-CC-MASCOT.md                          (aquest fitxer)
```

`Home.tsx` modificat per tu abans de la sessió (canvi d'import MascotV4 → MascotSprite); no l'he tocat.
