# Guide de déploiement

## 1. Supabase — créer la base de données

1. Va sur [supabase.com](https://supabase.com) et ouvre ton projet
2. Va dans **SQL Editor**
3. Copie-colle tout le contenu du fichier `supabase/schema.sql` et clique **Run**
4. Note tes clés : **Project URL** et **anon public key** (dans Settings > API)

## 2. Variables d'environnement

Crée un fichier `.env.local` à la racine du projet avec :

```
NEXT_PUBLIC_SUPABASE_URL=https://TON_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
MAKE_WEBHOOK_URL=https://hook.eu1.make.com/TON_WEBHOOK
CRON_SECRET=un_mot_de_passe_secret_que_tu_inventes
```

## 3. Vercel — déployer le site

1. Va sur [vercel.com](https://vercel.com), New Project
2. Importe le dossier PROSPECTION (ou connecte GitHub)
3. Dans **Environment Variables**, ajoute les 4 variables ci-dessus
4. Clique **Deploy**

## 4. Make — configurer le scénario WhatsApp

1. Crée un nouveau scénario dans Make
2. **Trigger** : Webhooks > Custom Webhook — copie l'URL → colle-la dans `MAKE_WEBHOOK_URL`
3. **Action** : ajoute un module WhatsApp Business ou utilise un module HTTP vers l'API WhatsApp de ton choix
4. Le webhook reçoit ce JSON chaque matin à 7h :
```json
{
  "date": "2024-05-13",
  "nb_relances": 3,
  "relances": [
    { "nom": "Jean Dupont", "entreprise": "Plomberie Dupont", "telephone": "0600000000", "statut": "contacte" }
  ]
}
```
5. Dans Make, tu peux formater un message du type :
   > "📋 Tu as 3 relances aujourd'hui : Jean Dupont (Plomberie Dupont), ..."

## 5. Tester les relances manuellement

Appelle l'URL suivante depuis un navigateur ou Postman :
```
GET https://ton-site.vercel.app/api/relances
Header: Authorization: Bearer TON_CRON_SECRET
```

## 6. Accès mobile

Le site est responsive — il s'ouvre directement dans Safari/Chrome sur iPhone.
Astuce : ajoute-le à l'écran d'accueil via le bouton "Partager > Sur l'écran d'accueil".
