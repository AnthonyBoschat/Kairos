import { getNextAvailableFolderColorIndex } from '@/lib/folder-colors';
import { getNextAvailableListColorIndex } from '@/lib/list-color';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('sudo', 10);

  const user = await prisma.user.upsert({
    where: { email: 'AnthonyBoschat.dev@hotmail.com' },
    update: {},
    create: {
      email: 'AnthonyBoschat.dev@hotmail.com',
      password: hashedPassword,
      name: 'Anthony',
    },
  });

  const folder1 = await prisma.folder.create({
    data: {
      title: 'Programmation',
      order: 0,
      defaultColor: await getNextAvailableFolderColorIndex(user.id),
      userId: user.id,
      favorite: true,
      lists: {
        create: [
          { 
            title: 'HTML', 
            order: 0, 
            defaultColor: 0,
            tasks: {
              create: [
                {
                  title: "Apprendre les balises de structure (header, nav, main, section, article, footer)", 
                  order: 0,
                },
                {
                  title: "Maîtriser les balises sémantiques (figure, time, mark, details, summary)", 
                  order: 1,
                },
                {
                  title: "Implémenter les attributs ARIA (role, aria-label, aria-describedby)", 
                  order: 2,
                  favorite:true,
                  content:`Penser à réserver les billets pour la soirée Halloween directement sur le site de Disneyland Paris, les places partent vite.

Il faudra aussi vérifier les horaires d'ouverture, car la soirée commence souvent en fin d'après-midi et se prolonge tard dans la nuit.

Prévoir le transport : train ou voiture, selon ce qui sera le plus pratique.

À penser avant de partir :
Charger le téléphone pour les billets numériques et les photos
Vérifier la météo et prendre un imperméable si besoin
Arriver tôt pour profiter du parc avant la nuit`
                },
                {
                  title: "Une entrée à Disneyland Paris un soir d'Halloween", 
                  order: 2,
                  favorite:true,
                  content:`Penser à réserver les billets pour la soirée Halloween directement sur le site de Disneyland Paris, les places partent vite.

Il faudra aussi vérifier les horaires d'ouverture, car la soirée commence souvent en fin d'après-midi et se prolonge tard dans la nuit.

Prévoir le transport : train ou voiture, selon ce qui sera le plus pratique.

À penser avant de partir :
Charger le téléphone pour les billets numériques et les photos
Vérifier la météo et prendre un imperméable si besoin
Arriver tôt pour profiter du parc avant la nuit

Il faudra aussi vérifier les horaires d'ouverture, car la soirée commence souvent en fin d'après-midi et se prolonge tard dans la nuit.

Prévoir le transport : train ou voiture, selon ce qui sera le plus pratique.

À penser avant de partir :
Charger le téléphone pour les billets numériques et les photos
Vérifier la météo et prendre un imperméable si besoin
Arriver tôt pour profiter du parc avant la nuit`
                },
              ]
            } 
          },
          { 
            title: 'CSS', 
            order: 1, 
            defaultColor: 1, 
            tasks: {
              create: [
                {
                  title: "Maîtriser Flexbox et Grid Layout", 
                  order: 0,
                },
                {
                  title: "Apprendre les custom properties et calc()", 
                  order: 1,
                },
                {
                  title: "Utiliser les media queries et container queries", 
                  order: 2,
                },
              ]
            }  
          },
          { 
            title: 'Javascript', 
            order: 2, 
            defaultColor: 2, 
            tasks: {
              create: [
                {
                  title: "Comprendre les promesses et async/await", 
                  order: 0,
                },
                {
                  title: "Manipuler le DOM moderne (querySelector, dataset, classList)", 
                  order: 1,
                },
                {
                  title: "Gérer les événements et la délégation", 
                  order: 2,
                },
              ]
            } 
          },
        ]
      }
    },
  });

  const folder2 = await prisma.folder.create({
    data: {
      title: 'Personnel',
      order: 1,
      defaultColor: await getNextAvailableFolderColorIndex(user.id),
      userId: user.id,
      lists: {
        create: [
          { title: 'Courses', order: 0, countElement: true, defaultColor: 0, },
          { title: 'Films à voir', order: 1, defaultColor: 1, },
          { title: 'Livres', order: 2, defaultColor: 2, },
        ],
      },
    },
  });

  const folder3 = await prisma.folder.create({
    data: {
      title: 'Projets',
      order: 1,
      defaultColor: await getNextAvailableFolderColorIndex(user.id),
      userId: user.id,
      lists: {
        create: [
          { title: 'Fil Rouge', order: 0, countElement: true, defaultColor: 0, },
          { title: 'Kairos', order: 1, defaultColor: 1, },
          { title: 'Orion', order: 2, defaultColor: 2, },
        ],
      },
    },
  });
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());