# Configurar e-mail da landing Vibeflow na Cloudflare

A landing em `/vibeflow` envia o e-mail da waitlist para um endpoint **POST `/waitlist`** com body JSON `{ "email": "..." }`. Você pode rodar esse endpoint em um **Cloudflare Worker** e armazenar os e-mails no **KV**.

## 1. Pré-requisitos

- Conta na [Cloudflare](https://dash.cloudflare.com)
- [Node.js](https://nodejs.org) (para usar o Wrangler)
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/install-and-update/) instalado:  
  `npm install -g wrangler`  
  (ou use `npx wrangler` dentro do projeto)

## 2. Criar o namespace KV

No terminal, na pasta do Worker:

```bash
cd vibeflow-waitlist-worker
npx wrangler kv namespace create VIBEFLOW_WAITLIST
```

A saída mostra algo como:

```
Add the following to your wrangler.toml:
[[kv_namespaces]]
binding = "WAITLIST"
id = "abc123def456..."
```

Copie o **id** e coloque no `wrangler.toml` na linha do `id` (substitua `<SUBSTITUA_PELO_ID_DO_NAMESPACE>`).

## 3. Ajustar o `wrangler.toml`

Edite `vibeflow-waitlist-worker/wrangler.toml`:

- Em `[[kv_namespaces]]`, use o `id` do namespace que você criou.
- (Opcional) Para restringir CORS a mariz.ai e localhost, você pode usar variáveis e ler no Worker; por simplicidade o exemplo usa `*`.

## 4. Fazer login e publicar o Worker

```bash
npx wrangler login
npx wrangler deploy
```

Após o deploy, o Worker fica em uma URL como:

`https://vibeflow-waitlist.vibeblock.workers.dev`

O endpoint da waitlist será:

**`https://vibeflow-waitlist.vibeblock.workers.dev/waitlist`**

## 5. Apontar a landing para o Worker

No projeto **mariz.ai** (Next.js), configure a variável de ambiente para a URL **base** do Worker (sem `/waitlist`):

- **Produção (Vercel / Netlify / etc.):**  
  `NEXT_PUBLIC_VIBEFLOW_API=https://vibeflow-waitlist.vibeblock.workers.dev`

- **Desenvolvimento local:** crie `.env.local` na raiz do mariz.ai:

  ```
  NEXT_PUBLIC_VIBEFLOW_API=https://vibeflow-waitlist.vibeblock.workers.dev
  ```

A landing já usa `NEXT_PUBLIC_VIBEFLOW_API` e faz `POST` para `${NEXT_PUBLIC_VIBEFLOW_API}/waitlist`.

## 6. (Opcional) Domínio próprio

No dashboard da Cloudflare:

1. **Workers & Pages** → seu Worker **vibeflow-waitlist** → **Settings** → **Triggers** → **Custom Domains**.
2. Adicione um domínio, por exemplo: `vibeflow-api.mariz.ai` (e configure o DNS conforme indicado).

Depois use:

`NEXT_PUBLIC_VIBEFLOW_API=https://vibeflow-api.mariz.ai`

## 7. Ver os e-mails cadastrados

- **Dashboard:** Cloudflare → **Workers & Pages** → **KV** → namespace **VIBEFLOW_WAITLIST** → **List keys** (e “View” em cada key).
- **CLI:**

  ```bash
  npx wrangler kv key list --namespace-id=<ID_DO_NAMESPACE>
  npx wrangler kv key get "email:usuario@exemplo.com" --namespace-id=<ID_DO_NAMESPACE>
  ```

Substitua `<ID_DO_NAMESPACE>` pelo mesmo `id` que está no `wrangler.toml`.

## 8. Resumo do fluxo

1. Usuário preenche o e-mail na landing `/vibeflow` e clica em “Notify me”.
2. O front faz `POST` para `NEXT_PUBLIC_VIBEFLOW_API/waitlist` com `{ "email": "..." }`.
3. O Worker valida, aplica rate limit, grava no KV e responde `{ "message": "You're on the list!" }`.
4. A landing mostra a mensagem de sucesso (ou erro, se houver).

## Segurança (opcional)

- **CORS:** no Worker, troque `'Access-Control-Allow-Origin': '*'` por uma lista de origens (ex.: `https://mariz.ai`, `http://localhost:3000`) lida de `env.ALLOWED_ORIGINS`.
- **Rate limit:** já há limite de 5 requisições por IP por minuto no exemplo.
- **Turnstile/CAPTCHA:** para reduzir bots, você pode adicionar Cloudflare Turnstile na landing e validar o token no Worker.
