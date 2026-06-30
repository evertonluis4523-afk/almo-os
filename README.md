# Controle de Almoços — RM

PWA single-file para controle mensal de almoços e valores a pagar, com sincronização entre computadores via Firebase (projeto **rm-contas**, nó `almocos`).

## Arquivos
- `index.html` — o app
- `manifest.webmanifest` — PWA
- `sw.js` — service worker (offline / instalável)
- `icon-192.png`, `icon-512.png` — ícones

## 1) Configurar o Firebase (uma vez)
Abra o `index.html` e localize o bloco **FIREBASE** (perto do fim do arquivo).
Cole a config do projeto **rm-contas**:

> Firebase Console → **Configurações do projeto** → **Seus apps (Web)** → **SDK setup and configuration** → **Config**.

Substitua os campos marcados com `COLE_AQUI`:

```js
const FB_CONFIG = {
  apiKey:            "AIza...",        // <- cole
  authDomain:        "rm-contas.firebaseapp.com",
  databaseURL:       "https://rm-contas-default-rtdb.firebaseio.com",  // confira a URL exata
  projectId:         "rm-contas",
  storageBucket:     "rm-contas.appspot.com",
  messagingSenderId: "...",            // <- cole
  appId:             "...".            // <- cole
};
```

> ⚠️ Confira a **databaseURL** no console (pode ter sufixo de região, ex.: `...-default-rtdb.firebaseio.com` ou `https://rm-contas-default-rtdb.<regiao>.firebasedatabase.app`).

Enquanto houver `COLE_AQUI`, o app funciona **100% local** (sem sincronizar).

### Regras do Realtime Database
O nó `almocos` precisa de permissão de leitura/escrita. Exemplo simples (ajuste conforme seus outros apps):

```json
{
  "rules": {
    "almocos": { ".read": true, ".write": true }
  }
}
```

## 2) Publicar no GitHub Pages
1. Crie/abra o repositório (ex.: `almocos-rm`) ou jogue numa subpasta do `evertonluis4523-afk.github.io`.
2. Suba **todos os arquivos desta pasta** mantendo os nomes.
3. Em **Settings → Pages**, defina a branch (`main`) e pasta (`/root`).
4. Acesse a URL gerada nos 2 computadores e em **⚙ → instalar/adicionar à tela inicial** (Chrome/Safari).

## 3) Sincronização
- Toda alteração salva grava no nó `almocos` do rm-contas.
- O outro computador recebe a atualização em tempo real.
- É **última escrita vence**: evitem editar o **mesmo mês** ao mesmo tempo nos dois PCs.

## Uso rápido
- Barra de pincéis: escolha `1`, `PAGAR`, `Falta`, `INSS`, etc. e toque nas células.
- Toque no **nome** = pinta a linha toda · toque no **dia** = pinta a coluna toda.
- **Limpar** (`·`) apaga a marcação.
- **Feriado**: marque em ⚙ → *Editar dias/feriados* → a coluna inteira vira FERIADO e sai da contagem.
- **Relatório**: gera tabela por funcionário com totais. Botões:
  - **📄 PDF** — relatório com logo, valores em R$ e colunas centralizadas (para a contabilidade).
  - **📊 Excel** — `.xlsx` formatado (cabeçalho, bordas, R$ e centralização).
  - **Copiar** / **Imprimir**.
  - A logo pode ser trocada em ⚙ → *Logo do relatório* (fica salva e sincroniza).
  - *Obs.: PDF e Excel baixam as bibliotecas na hora — precisa de internet ao exportar. O uso diário funciona offline.*

## Regras de cálculo
- **VALOR** = nº de dias `1` × valor/dia (operacional).
- **A PAGAR** = nº de dias `PAGAR` × valor/dia (abono).
- **ADM**: VALOR espelha o abono (mantém o comportamento atual).
- Feriado, falta, atestado, INSS, cárcere, demissão e encantado não entram na conta.
