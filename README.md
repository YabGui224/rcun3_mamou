# RCUN3-MAMOU BACKEND - Project : Application “Gestion de Contacts”

## 🧩 Description du projet

L’application **Gestion de Contacts** est une API développée en **Node.js + TypeScript** avec **Express** et **Prisma**.  
Elle permet aux utilisateurs de :
- créer un compte,  
- se connecter,  
- ajouter, modifier, supprimer et lister leurs contacts,  
- recevoir des **notifications** lors de l’ajout d’un nouveau contact,  
- **réinitialiser leur mot de passe** via un OTP envoyé par email,  
- et **rafraîchir leur token JWT** sans devoir se reconnecter.

Ce projet est conçu comme **support pédagogique** pour les filles en formation pour le programme **RCUN3**, afin d’apprendre à développer une API complète et sécurisée avec des outils professionnels.

---
## Cloner uniquement la branche du projet 
```bash
  git clone --branch project --single-branch https://github.com/YabGui224/rcun3_mamou.git

```

## Pour cloner toutes les branches du repository  
taper ```bash 
    git clone https://github.com/YabGui224/rcun3_mamou.git

 ```

## Installer les dependances du projet
  taper : ```bash 
    npm install

  ```
---

## ⚙️ Fonctionnalités principales

| Fonctionnalité | Description |
|----------------|-------------|
| 🔐 Authentification complète | Création de compte, connexion, génération de JWT et refresh token |
| 🔁 Rafraîchissement de token | Le refresh token est valide **2 jours**, le token principal **5m** *juste pour une simulation* |
| 🔑 Réinitialisation du mot de passe | Envoi d’un OTP par email (valable **5 minutes**) via Gmail |
| 👥 Gestion des contacts | Ajout, modification, suppression et vérification d’un numéro avant l’ajout |
| 📨 Notifications | À chaque ajout de contact, une notification est créée pour l’utilisateur |
| ⚡ Validation | Validation stricte des données avec **Zod** |
| 🧠 ORM moderne | Utilisation de **Prisma**, un ORM puissant et simple basé sur TypeScript |
| 🧰 Stockage temporaire | Utilisation de **Redis** pour stocker les OTP avec une durée de vie de 10 minutes |

---

## 🧱 Stack technique

| Outil | Rôle |
|--------|------|
| **Node.js / Express** | Framework backend |
| **TypeScript** | Typage fort et sécurité du code |
| **Prisma** | ORM moderne et rapide |
| **Zod** | Validation des données d’entrée |
| **Redis** | Stockage temporaire des OTP |
| **Nodemailer** | Envoi d’emails (réinitialisation de mot de passe) |
| **jsonwebtoken (JWT)** | Authentification et sécurité des utilisateurs |
| **Insomnia** | Application utilisee pour tester les endpoints de l'API

---

## Installation de Redis
Redis est une base de données en mémoire utilisée ici pour stocker temporairement les OTP (codes de vérification).
Tu peux l’installer de deux façons : soit via Docker (recommandé), soit directement sur ton système.

1. Option 1 : Installation avec Docker (recommandee)
  - Apres installation de docker taper la commande suivante dans le terminal de docker 
    ```bash 
      docker run --name redis-server -p 6379:6379 -d redis:latest
    ```
    Cette commande télécharge l’image officielle de Redis et démarre le service sur le port 6379

2. Option 2 : Telecharger et installer l'executable (.exe) de redis
---

## 🗃️ Schéma de la base de données (simplifié)

```prisma
model User {
  id  Int @id @default(autoincrement())
  nom  String
  prenom  String
  tel  String @unique
  password  String
  avatar  String?
  email   String @unique
  contacts  Contacts[]
  notifications  Notifications []
}

model Contacts {
  id  Int @id @default(autoincrement())
  contact String
  user User @relation (fields: [userId], references:[id]) 
  userId  Int
}

model Notifications {
  id  Int @id @default(autoincrement())
  message String
  user User @relation (fields: [userId], references:[id])
  userId  Int
}
```

## Les variables d'environnement pour le projet 
| Outil | Rôle |
|--------|------|
| **DATABASE_URL** | L'URL Utiliser par Prisma pour se connecter a votre serveur de donnees |
| **PRIVATE_KEY** | Votre cle privee pour generer le token |
| **REFRESH_PRIVATE_KEY** | Votre cle privee pour generer le refresh token |
| **REDIS_HOST** | Le port utiliser par redis dans notre cas ici : REDIS_HOST = "127.0.0.1" |
| **REDIS_PORT** | Le port d'ecoute de REDIS, ici : REDIS_PORT = 6379 |
| **EMAIL** | l'email a utiliser pour permettre votre application d'envoyer les emails |
| **PASS** | Votre google pass : c'est un code que vous allez cree dans votre compte google pour pouvoir envoyer les emails |

## Comment creer votre **Google PASS**
Suivez ces images ci-dessous
![Google App fig1](./assets/banner.png)
![Google App fig2](./assets/banner.png)
