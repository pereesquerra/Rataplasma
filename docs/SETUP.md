# Setup de rataplasma.com — pas a pas

Aquesta guia porta de "tinc el codi al meu ordinador" a "rataplasma.com
funciona i el Pau hi pot entrar".

## Pre-requisits

- Node.js 20 o superior
- pnpm instal·lat (`npm i -g pnpm`)
- Compte a Cloudflare (ja el tens)
- Compte a GitHub (ja el tens)
- Clau d'API d'Anthropic (ja en tens una activa)

## 1. Pujar el codi a GitHub

### Opció A — Repo ja creat
Si ja has creat `pereesquerra/rataplasma` manualment al web de GitHub:

```bash
cd rataplasma
git init -b main
git add .
git commit -m "Fase 1: MVP amb home, mascot, botó RATAPLASMA, xat i admin"
git remote add origin https://github.com/pereesquerra/rataplasma.git
git push -u origin main
```

### Opció B — Crear el repo via GitHub CLI
```bash
cd rataplasma
git init -b main
git add .
git commit -m "Fase 1: MVP"
gh repo create pereesquerra/rataplasma --public --source=. --push
```

## 2. Instal·lar dependències i provar local

```bash
pnpm install
```

Crea un fitxer `.dev.vars` a l'arrel del projecte (NO el commitis — ja està al
.gitignore):

```
ANTHROPIC_API_KEY=sk-ant-...
```

Prova el servidor de desenvolupament:

```bash
pnpm dev
```

Obre `http://localhost:5173`. Entra amb nom "Pere" i codi `PAU-RATA-2026`
per ser admin, o qualsevol nom amb codi `RATAPLASMA` per ser amic normal.

**Nota:** el xat no funcionarà encara en aquest mode perquè les Pages Functions
necessiten un build i `wrangler pages dev`. Per provar el xat en local:

```bash
pnpm build
pnpm pages:dev
```

## 3. Connectar a Cloudflare Pages

1. Entra a [dash.cloudflare.com](https://dash.cloudflare.com) amb el teu compte.
2. Menú lateral → **Workers & Pages** → **Create** → pestanya **Pages** → **Connect to Git**.
3. Autoritza Cloudflare a accedir a GitHub si encara no ho has fet.
4. Selecciona el repo `pereesquerra/rataplasma`.
5. **Production branch:** `main`
6. **Build settings:**
   - Framework preset: **None** (o **Vite** si surt com a opció)
   - Build command: `pnpm build`
   - Build output directory: `dist`
   - Root directory: (deixa buit)
7. **Environment variables** → afegeix:
   - Nom: `ANTHROPIC_API_KEY`
   - Valor: la teva clau d'Anthropic
   - Encrypt: ✅ (IMPORTANT)
8. Save and Deploy.

El primer deploy triga 1-2 minuts. Quan acabi, et donarà una URL del tipus
`rataplasma-abc.pages.dev`. Provà que funciona.

## 4. Connectar el domini rataplasma.com

1. Dins del projecte a Pages → **Custom domains** → **Set up a custom domain**.
2. Escriu `rataplasma.com` → Continue.
3. Cloudflare detecta que el domini està al mateix compte (Cloudflare Registrar)
   i configura els DNS automàticament. Confirma.
4. Afegeix també `www.rataplasma.com` si vols redirecció.

Espera 1-2 minuts a que propagui. Després `https://rataplasma.com` ha de
funcionar.

## 5. Primera prova amb el Pau

1. Obre `rataplasma.com` al mòbil del Pau o a un ordinador seu.
2. Clica **"No tens codi? Demana permís al Pau"**.
3. Escriu el seu nom → **DEMANA ACCÉS**.
4. Ara, a la teva pantalla (com a admin): entra amb codi `PAU-RATA-2026`
   i ves a [ADMIN]. Veuràs la seva petició. Aprova-la.
5. Torna al seu dispositiu, canvia a "Ja tens codi? Entra aquí", posa
   el seu nom i el codi `RATAPLASMA`.
6. Ha d'entrar. Clica el botó RATAPLASMA! i mira si s'escolta el crit.
7. Entra a "PARLA AMB LA RATA" i prova el xat.

Si tot funciona, ja tens la Fase 1 operativa i pots començar la Fase 2.

## Troubleshooting

**El xat no respon:**
- Comprova que `ANTHROPIC_API_KEY` està configurada a Pages Environment variables.
- Obre DevTools → Network, mira la resposta de `/api/chat`.
- Si hi ha error 500, mira els logs a Cloudflare Pages → Functions.

**No se sent l'àudio del crit:**
- En alguns iPhones cal la primera interacció per activar l'AudioContext.
  Clicar el botó un segon cop sol resoldre-ho.

**El mascot no s'anima:**
- Comprova que el navegador suporta CSS animations modernes.
- En mode "reduce motion" del sistema, Framer Motion redueix animacions
  automàticament.

**Canvis al codi no apareixen:**
- Cloudflare Pages té cache agressiu. Fes `Ctrl+Shift+R` o obre en incògnit.
