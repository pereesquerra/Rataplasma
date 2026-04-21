# 🐀👻 Rataplasma

**Web per al Pau i els seus amics.** Xat amb la Rata Fantasma (IA), generador
d'imatges, jocs competitius i un apartat educatiu de codi. Per a nens de
10-13 anys.

🔗 [rataplasma.com](https://rataplasma.com) (quan estigui desplegat)

## Què és això

Un projecte divertit i educatiu construït plegats entre el Pere (oncle) i el
Pau (nebot). Tres pilars:

1. **Joc visual i IA** — la Rata Fantasma, mascot original, anima la pàgina.
   Xat amb Claude Haiku, generador d'imatges, jocs competitius.
2. **Competició entre amics** — Duel de Prompts, Enigma de la Rata,
   Memòria Rataplasma. Punts robables, rànquings.
3. **Aprenentatge de codi** — mode "mira el codi" a cada element:
   el nen veu, amb fletxes i explicacions, què fa cada tros de codi. Pot
   tocar valors i veure el resultat en directe.

**Disseny:** ràdio pirata fantasma anys 80 — negre profund, verd fosforit,
tipografia arcade/CRT, scan lines, glow, glitches subtils.

## Stack

- **Frontend:** React 18 + Vite + Tailwind + Motion (Framer Motion)
- **Backend:** Cloudflare Pages Functions
- **IA xat:** Claude Haiku 4.5 (Anthropic API)
- **IA imatges:** Workers AI (Flux) — fase 3
- **BD:** Cloudflare D1 — fase 2 en endavant
- **Deploy:** Cloudflare Pages (auto-deploy des de `main`)
- **Domini:** rataplasma.com (Cloudflare Registrar)

## Fase actual: 1 (MVP)

✅ Home amb mascot SVG original i animat
✅ Botó RATAPLASMA! amb crit sintetitzat (Web Audio API, sense arxius externs)
✅ Xat amb la Rata Fantasma (Claude Haiku amb personalitat i guardrails)
✅ Sistema login amb codi d'invitació
✅ Panell admin del Pau per gestionar peticions

🔜 Fase 2: Codi educatiu (CodiViewer amb fletxes i editors visuals)
🔜 Fase 3: Generador d'imatges amb Flux
🔜 Fase 4: Duel de Prompts + punts
🔜 Fase 5: Enigma de la Rata + Memòria
🔜 Fase 6: Codi educatiu nivells 2 i 3 (Blockly + JS editor)
🔜 Fase 7: IA que crea jocs temàtics

Veure [PLAN.md](./PLAN.md) per al pla complet.

## Desenvolupament local

```bash
pnpm install
pnpm dev
```

Per provar les Pages Functions en local cal un fitxer `.dev.vars`:

```
ANTHROPIC_API_KEY=sk-ant-...
```

Després:

```bash
pnpm build
pnpm pages:dev
```

## Desplegament

Connecta el repo a Cloudflare Pages:

1. A Cloudflare Dashboard → Pages → Create project → Connect to Git.
2. Selecciona el repo `rataplasma`.
3. Build command: `pnpm build`
4. Build output directory: `dist`
5. A Settings → Environment variables, afegeix (encryptada):
   - `ANTHROPIC_API_KEY` amb la teva clau d'Anthropic.
6. A Custom domains, afegeix `rataplasma.com`.

Auto-deploy a cada `git push main`.

## Codis inicials (Fase 1)

- **Codi admin del Pau:** `PAU-RATA-2026`
- **Codi d'invitació amics:** `RATAPLASMA`

⚠️ Aquests són codis Fase 1 hardcoded al `src/lib/auth.ts`. Canvia'ls abans
d'ensenyar el projecte a més gent. A la Fase 2 es mouran a D1 amb codis
únics per persona.

## Llicència

Projecte personal. Ús no comercial. El mascot i l'estètica són originals;
la paraula "Rataplasma" és un crit inventat sense cap relació amb cap
propietat intel·lectual de tercers.
