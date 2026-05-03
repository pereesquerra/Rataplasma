# BRIEFING-CC-MASCOT.md — Integrar les noves imatges del mascot amb les animacions de l'antic

> **Per Claude Code.** Sessió curta i molt focalitzada. Llegeix-ho sencer abans de tocar res.

---

## QUÈ HI HA AL REPO

Branca `main`. Working tree net. Has de revertir i adaptar dos fitxers:

- `public/mascot/` — **6 imatges PNG nou** generades amb DALL-E 3 (mateix personatge, 6 poses):
  - `idle.png` — postura calmada, mig somriure curiós
  - `parlant.png` — boca oberta, mà gesticulant
  - `content.png` — somriure ample, ulls tancats, mans amunt celebrant
  - `espantat.png` — ulls enormes, scream, suor, mans als costats del cap
  - `ballant.png` — mig moviment de ball, dit aixecat, ulls tancats
  - `pensant.png` — mà a la barbeta, núvol de pensament
  - `composicio-bonus.png` — bonus, una composició decorativa de 5 poses (pots ignorar)
- `src/components/home/MascotSprite.tsx` — **versió incompleta**, només canvia src d'imatges. **Falta tot el moviment.** Cal substituir-lo o reescriure'l completament.
- `src/components/home/MascotV4.tsx` — **versió antiga (SVG inline)**: és la que té totes les animacions que cal preservar però amb una rata simple feta amb paths. **Aquí és on hi ha la lògica del moviment que cal traslladar.**

## DOS PROBLEMES A RESOLDRE

### 1. Les imatges tenen FONS NEGRE

DALL-E 3 sempre afegeix fons negre uniforme al voltant del personatge. Al `MascotSprite.tsx` actual hi ha `mix-blend-mode: screen` que **no funciona del tot bé** sobre el fons del web (que també és gairebé negre). Es veu el quadre.

Soluciona-ho amb la **millor opció disponible**:

**Opció A** (recomanada): script local amb `magick` (ImageMagick) per treure el fons negre i fer-lo transparent. ImageMagick està instal·lat al Mac (sinó: `brew install imagemagick`). Comanda tipus:

```bash
cd /Users/pereesquerra24/Documents/Projectes/rataplasma/public/mascot
for f in idle parlant content espantat ballant pensant; do
  magick "${f}.png" -fuzz 10% -transparent black "${f}.png"
done
```

Després de tractar-les, **les imatges tindran transparència real** i el `mix-blend-mode` ja no caldrà.

Si l'opció A introdueix artefactes als bigotis blancs o vores blanques (perquè el algoritme també pot treure píxels foscos del personatge), prova fuzz més baix (5%) o usa edge detection.

**Opció B** (fallback): si no aconsegueixes fons transparent net, fes que el `MascotSprite` usi `<img>` amb un filter SVG inline que separi amb threshold. Més tècnic, només si A falla.

### 2. El mascot està ESTÀTIC

Mira el `MascotV4.tsx` antic: tenia respiració, parallax cursor, cua animada, scream amb sacseig de cos, mouth quiver, etc. Aquell era ric en moviment.

El `MascotSprite.tsx` actual només canvia entre 6 imatges. Cal afegir-li **TOT el moviment del MascotV4 antic, però aplicat sobre la imatge PNG, no sobre paths SVG**:

#### Animacions a portar

1. **Idle breathing**: el mascot fa scale 1.0 ↔ 1.04 cada 2.5s, suau (`ease-in-out infinite alternate`).
2. **Idle float**: translateY 0 ↔ -8px cada 3.2s desfasat amb la respiració.
3. **Parallax cursor**: el `Home.tsx` passa `eyeTarget = {x, y}` amb la posició relativa del cursor. Aplica un `translate(eyeTarget.x * 12px, eyeTarget.y * 8px)` al contenidor del mascot perquè "segueixi" el cursor suaument. **Important**: aquest moviment és sobre TOTA la imatge sencera, no només els ulls. Funcional, simple, eficaç.
4. **Idle pose alternation**: cada 4-5s alterna entre `idle` i `parlant` perquè estigui viu (ja ho fa el sprite actual, manté).
5. **Pose `pensant` quan eyeTarget no és null**: si el cursor és a sobre, mascot mostra `pensant`. Ja ho fa.
6. **Pose `espantat` quan `screaming=true`**: ja ho fa, però afegir SACSEIG: `animation: scream-shake 0.08s steps(2) infinite` que tradueix la imatge -3px a +3px contínuament durant els 6.8s del crit. També fer scale 1.0 → 1.15 → 1.0 (zoom-in còmic). I un **box-shadow vermell pulsant**.
7. **Pose `ballant` quan `leaping=true`**: ja ho fa, afegir un petit rotate ±5° desfasant.

#### Transicions
- Entre poses: `transition: opacity 0.18s` ja ho té. Bé.
- Quan canvia de pose, també afegir un mini squash & stretch: scale 1 → 1.1 → 1 en 0.2s perquè faci impacte el canvi.

## ASPECTE QUE M'ESPERO DEL FINAL

Quan obro la web:
- El mascot apareix a la home, **sense quadre negre** (transparent perfecte sobre el background del web)
- Es **mou subtilment** (respira, flota suau)
- Si moc el cursor pel mascot, **canvia a pensant i el segueix** suaument com el de l'antic MascotV4
- Si clico el botó RATAPLASMAAAA, fa **espantat amb sacseig violent** + scale 1.15 + glow vermell durant els 6.8 segons del crit
- Quan es calma, torna a idle

Sembla **viu i amb personalitat**, no una imatge enganxada.

## TÈCNICA SUGGERIDA

Reemplaça el `MascotSprite.tsx` actual amb una nova versió que:

1. Tingui un wrapper `<motion.div>` (Framer Motion) amb les animacions globals (breathing, float, parallax, scream-shake)
2. A dins, l'`<img>` de la pose actual (les altres com a 0 opacity)
3. Les animacions complexes (sacseig, squash) com a `whileTap` o `animate` de Motion
4. La idle breathing/float com a `animate` keyframes infinit

Això donarà el millor d'ambdós mons: imatge bonica + animació rica. Motion ja és al projecte (`motion/react`).

## FITXERS QUE POTS TOCAR

- `src/components/home/MascotSprite.tsx` — reescriu completament o profundament
- `src/pages/Home.tsx` — només si necessites passar nous props al mascot
- `src/styles/home.css` — per CSS keyframes que no estan al component
- `public/mascot/*.png` — pots reprocessar-los amb ImageMagick
- Pots crear scripts auxiliars a `scripts/` si t'ajuda

## FITXERS QUE NO TOQUES

- Cap altre component, page, lib, function, etc. La sessió és sobre el mascot i prou.
- Si et sembla que has de tocar res que no és estretament del mascot, atura't i pregunta al Pere.
- **No ataquis** el chat, codi, música, login, auth, etc.

## CRITERIS D'ACCEPTACIÓ

- `unset NODE_ENV && npm run build` passa net
- `npm run dev` mostra el mascot **sense fons negre visible**
- El mascot **es mou** (respiració, parallax, etc.) en idle
- Click al botó RATAPLASMAAAA → **canvia a espantat AMB sacseig**, durant 6.8s
- Mobile (iPhone Safari): es comporta igual o millor (cap fragment del fons negre visible)
- Build no creix més de 50 KB JS / 10 KB CSS respecte la versió actual

## PROCÉS

1. Llegeix aquest fitxer
2. Si tens cap dubte gran, demana al Pere amb 2-3 opcions (botó, no llistes obertes)
3. Si dubte petit, decideix tu i documenta a `RESUM-CC-MASCOT.md` al final
4. Fes commits petits descriptius
5. Push a `main` directament (és canvi puntual, no calen branques separades)
6. Build + dev server actiu perquè el Pere pugui provar
7. Quan acabis, escriu **RESUM-CC-MASCOT.md** amb:
   - Què has fet exactament
   - Si has fet servir Opció A o B per la transparència
   - Decisions tècniques no òbvies
   - Què queda per polir si no arribes
8. **No facis deploy a producció** (no `wrangler pages deploy`). El Pere decideix.

---

Acaba quan el mascot estigui **bonic, transparent, mòbil i viu**. Si trigues 30 minuts està bé. Si trigues 90, també.
