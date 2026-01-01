import { getNextAvailableFolderColorIndex } from '@/lib/folder-colors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type TaskSeed = {
  title: string;
  content?: string;
  favorite?: boolean;
};

type ListSeed = {
  title: string;
  color: number;
  countElement?: boolean;
  tasks: TaskSeed[];
};

type FolderSeed = {
  title: string;
  favorite?: boolean;
  lists: ListSeed[];
};

const COLOR_RANGE_SIZE = 12;

function normalizeColorIndex(colorIndex: number): number {
  return ((colorIndex % COLOR_RANGE_SIZE) + COLOR_RANGE_SIZE) % COLOR_RANGE_SIZE;
}

function buildTaskCreateInput(tasks: TaskSeed[]) {
  return {
    create: tasks.map((task, taskOrder) => ({
      title: task.title,
      order: taskOrder,
      favorite: task.favorite ?? false,
      ...(task.content ? { content: task.content } : {}),
    })),
  };
}

function buildListCreateInput(lists: ListSeed[]) {
  return {
    create: lists.map((list, listOrder) => ({
      title: list.title,
      order: listOrder,
      color: normalizeColorIndex(list.color),
      ...(typeof list.countElement === 'boolean' ? { countElement: list.countElement } : {}),
      tasks: buildTaskCreateInput(list.tasks),
    })),
  };
}

async function createFolderWithLists(params: {
  userId: string;
  folderOrder: number;
  folder: FolderSeed;
}) {
  const folderColorIndex = await getNextAvailableFolderColorIndex(params.userId);

  return prisma.folder.create({
    data: {
      title: params.folder.title,
      order: params.folderOrder,
      color: normalizeColorIndex(folderColorIndex),
      userId: params.userId,
      favorite: params.folder.favorite ?? false,
      lists: buildListCreateInput(params.folder.lists),
    },
  });
}

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

  const folders: FolderSeed[] = [
    // 1) Programmation
    {
      title: 'Programmation',
      favorite: true,
      lists: [
        {
          title: 'HTML',
          color: 0,
          tasks: [
            { title: 'Structurer une page (header, nav, main, section, article, footer)' },
            { title: 'Formulaires (validation, autocomplete, types d’inputs)' },
            { title: 'Accessibilité (landmarks, labels, aria-* utiles)', favorite: true },
            { title: 'SEO de base (title, meta, headings, liens)' },
            { title: 'Images & médias (srcset, picture, lazy-loading)' },
            { title: 'Bonnes pratiques sémantiques (figure, time, details/summary)' },
          ],
        },
        {
          title: 'CSS',
          color: 1,
          tasks: [
            { title: 'Flexbox (align-items, justify-content, gaps)' },
            { title: 'Grid (areas, auto-fit, minmax)' },
            { title: 'Responsive moderne (container queries)' },
            { title: 'Variables CSS (custom properties) + calc()' },
            { title: 'Animations (transition, keyframes, prefers-reduced-motion)' },
            { title: 'Architecture (BEM / ITCSS / tokens)' },
          ],
        },
        {
          title: 'JavaScript',
          color: 2,
          tasks: [
            { title: 'Async/await, Promises, gestion d’erreurs' },
            { title: 'DOM moderne (querySelector, dataset, classList)' },
            { title: 'Événements + délégation' },
            { title: 'Modules ES (import/export) + bundlers' },
            { title: 'Fetch + AbortController (timeouts, annulation)' },
            { title: 'Tests (Vitest/Jest) sur fonctions pures' },
          ],
        },
        {
          title: 'TypeScript',
          color: 3,
          tasks: [
            { title: 'Types utilitaires (Pick, Omit, Partial, Record)' },
            { title: 'Génériques (constraints, infer)' },
            { title: 'Narrowing (type guards, discriminated unions)', favorite: true },
            { title: 'Zod / validation runtime + types' },
            { title: 'Ergonomie DX (eslint, tsconfig strict, path aliases)' },
            { title: 'Patterns (DTO, mappers, domain types)' },
          ],
        },
        {
          title: 'Python',
          color: 4,
          tasks: [
            { title: 'Venv + dépendances (pip-tools/poetry)' },
            { title: 'AsyncIO (bases, awaitables)' },
            { title: 'FastAPI (routes, pydantic, dépendances)' },
            { title: 'Tests (pytest) + fixtures' },
            { title: 'Types (mypy, typing, dataclasses)' },
            { title: 'Scripts utilitaires (CLI avec argparse/typer)' },
          ],
        },
        {
          title: 'SQL',
          color: 5,
          tasks: [
            { title: 'SELECT avancé (JOIN, GROUP BY, HAVING)' },
            { title: 'Index (quand/pourquoi), EXPLAIN' },
            { title: 'Transactions + verrous (notions)' },
            { title: 'Contraintes (FK, unique, check), migrations' },
            { title: 'Fenêtrage (ROW_NUMBER, OVER, partitions)' },
            { title: 'Modélisation (normalisation, relations)' },
          ],
        },
      ],
    },

    // 2) Films
    {
      title: 'Films',
      lists: [
        {
          title: 'Action',
          color: 6,
          tasks: [
            { title: 'Mad Max: Fury Road' },
            { title: 'John Wick' },
            { title: 'Die Hard' },
            { title: 'The Raid' },
            { title: 'Mission: Impossible – Fallout' },
            { title: 'Gladiator' },
            { title: 'Terminator 2: Judgment Day' },
            { title: 'The Dark Knight' },
            { title: 'Heat' },
            { title: 'Casino Royale' },
          ],
        },
        {
          title: 'Science-fiction',
          color: 7,
          tasks: [
            { title: 'Blade Runner 2049' },
            { title: 'Interstellar' },
            { title: 'Arrival' },
            { title: 'Dune' },
            { title: 'The Matrix' },
            { title: 'Ex Machina' },
            { title: 'Alien' },
            { title: 'Inception' },
            { title: 'The Thing' },
            { title: '2001: A Space Odyssey' },
          ],
        },
        {
          title: 'Drame',
          color: 8,
          tasks: [
            { title: 'The Shawshank Redemption' },
            { title: 'Forrest Gump' },
            { title: 'Whiplash' },
            { title: 'Parasite' },
            { title: 'Fight Club' },
            { title: 'The Green Mile' },
            { title: 'La La Land' },
            { title: 'Joker' },
            { title: 'The Pianist' },
            { title: 'Good Will Hunting' },
          ],
        },
        {
          title: 'Animation',
          color: 9,
          tasks: [
            { title: 'Spirited Away' },
            { title: 'Princess Mononoke' },
            { title: 'Toy Story' },
            { title: 'Wall·E' },
            { title: 'Spider-Man: Into the Spider-Verse' },
            { title: 'Your Name' },
            { title: 'The Incredibles' },
            { title: 'Ratatouille' },
            { title: 'Klaus' },
            { title: 'Howl’s Moving Castle' },
          ],
        },
        {
          title: 'Thriller',
          color: 10,
          tasks: [
            { title: 'Se7en' },
            { title: 'Gone Girl' },
            { title: 'Prisoners' },
            { title: 'Zodiac' },
            { title: 'The Silence of the Lambs' },
            { title: 'Shutter Island' },
            { title: 'Memento' },
            { title: 'The Departed' },
            { title: 'No Country for Old Men' },
            { title: 'Nightcrawler' },
          ],
        },
        {
          title: 'Comédie',
          color: 11,
          tasks: [
            { title: 'The Grand Budapest Hotel' },
            { title: 'Hot Fuzz' },
            { title: 'The Big Lebowski' },
            { title: 'Groundhog Day' },
            { title: 'Superbad' },
            { title: 'Anchorman' },
            { title: 'Shaun of the Dead' },
            { title: 'Borat' },
            { title: 'Step Brothers' },
            { title: 'Paddington 2' },
          ],
        },
      ],
    },

    // 3) Livres (par auteur)
    {
      title: 'Livres',
      lists: [
        {
          title: 'George Orwell',
          color: 0,
          tasks: [{ title: '1984' }, { title: 'Animal Farm' }, { title: 'Homage to Catalonia' }],
        },
        {
          title: 'Agatha Christie',
          color: 1,
          tasks: [
            { title: 'And Then There Were None' },
            { title: 'Murder on the Orient Express' },
            { title: 'The ABC Murders' },
            { title: 'Death on the Nile' },
            { title: 'The Murder of Roger Ackroyd' },
            { title: 'The Mysterious Affair at Styles' },
            { title: 'Crooked House' },
            { title: 'The Pale Horse' },
          ],
        },
        {
          title: 'Haruki Murakami',
          color: 2,
          tasks: [
            { title: 'Norwegian Wood' },
            { title: 'Kafka on the Shore' },
            { title: '1Q84' },
            { title: 'The Wind-Up Bird Chronicle' },
            { title: 'After Dark' },
            { title: 'Sputnik Sweetheart' },
          ],
        },
        {
          title: 'J.R.R. Tolkien',
          color: 3,
          tasks: [
            { title: 'The Hobbit' },
            { title: 'The Fellowship of the Ring' },
            { title: 'The Two Towers' },
            { title: 'The Return of the King' },
            { title: 'The Silmarillion' },
          ],
        },
        {
          title: 'Isaac Asimov',
          color: 4,
          tasks: [
            { title: 'Foundation' },
            { title: 'Foundation and Empire' },
            { title: 'Second Foundation' },
            { title: 'I, Robot' },
            { title: 'The Caves of Steel' },
            { title: 'The Naked Sun' },
          ],
        },
        {
          title: 'Brandon Sanderson',
          color: 5,
          tasks: [
            { title: 'Mistborn: The Final Empire' },
            { title: 'The Well of Ascension' },
            { title: 'The Hero of Ages' },
            { title: 'The Way of Kings' },
            { title: 'Words of Radiance' },
            { title: 'Oathbringer' },
            { title: 'Rhythm of War' },
          ],
        },
      ],
    },

    // 4) Recettes
    {
      title: 'Recettes',
      lists: [
        {
          title: 'Entrées',
          color: 6,
          tasks: [
            {
              title: 'Bruschetta tomate & basilic',
              content:
                'Ingrédients : pain, tomates, ail, basilic, huile d’olive.\nPréparation : griller le pain, frotter l’ail, ajouter tomates en dés + basilic, filet d’huile, sel/poivre.',
            },
            { title: 'Velouté de potimarron' },
            {
              title: 'Salade César (version simple)',
              content:
                'Poulet, romaine, parmesan, croûtons.\nSauce rapide : yaourt + citron + moutarde + ail + anchois (option).',
            },
            { title: 'Œufs mimosa' },
            { title: 'Houmous & crudités' },
            { title: 'Carpaccio de courgettes' },
          ],
        },
        {
          title: 'Plats',
          color: 7,
          tasks: [
            {
              title: 'Pâtes carbonara (sans crème)',
              content:
                'Guanciale/lardons, œufs, pecorino/parmesan.\nMélanger œufs + fromage, ajouter aux pâtes hors feu avec un peu d’eau de cuisson.',
            },
            { title: 'Poulet curry coco' },
            { title: 'Chili con carne' },
            {
              title: 'Saumon au four & légumes rôtis',
              content:
                'Four 200°C.\nLégumes + huile d’olive + épices 25 min, ajouter saumon 12–15 min. Citron à la fin.',
            },
            { title: 'Buddha bowl (riz, légumes, sauce tahini)' },
            { title: 'Ratatouille express' },
          ],
        },
        {
          title: 'Desserts',
          color: 8,
          tasks: [
            { title: 'Tiramisu' },
            {
              title: 'Mousse au chocolat',
              content:
                'Faire fondre le chocolat.\nMonter blancs en neige, incorporer délicatement. Repos au frais 3h.',
            },
            { title: 'Panna cotta vanille' },
            { title: 'Compote pommes-cannelle' },
            { title: 'Crêpes' },
            { title: 'Salade de fruits' },
          ],
        },
        {
          title: 'Pâtisserie',
          color: 9,
          tasks: [
            {
              title: 'Cookies moelleux',
              content:
                'Beurre + sucre + œuf, ajouter farine + levure + pépites.\nCuisson 10–12 min à 180°C (centre encore tendre).',
            },
            { title: 'Banana bread' },
            { title: 'Gâteau au yaourt' },
            { title: 'Madeleines' },
            { title: 'Brownies' },
            { title: 'Choux (à perfectionner)' },
          ],
        },
      ],
    },

    // 5) Perso (notes journalières)
    {
      title: 'Perso',
      lists: [
        {
          title: 'Notes',
          color: 10,
          tasks: [
            { title: '1/12/2025', content: 'Bonne énergie aujourd’hui, je me suis senti productif et serein.' },
            { title: '2/12/2025', content: 'Journée un peu chargée, mais j’ai gardé le cap sans trop de stress.' },
            { title: '3/12/2025', content: 'Un peu fatigué, j’ai eu du mal à rester concentré en fin de journée.' },
            { title: '4/12/2025', content: 'Motivé et inspiré, j’ai avancé sur des sujets qui me tenaient à cœur.' },
            { title: '5/12/2025', content: 'Journée moyenne, j’ai eu besoin de pauses pour repartir.' },
            { title: '6/12/2025', content: 'Très bonne humeur, j’ai pris du temps pour souffler.' },
            { title: '7/12/2025', content: 'Un peu de pression, mais je suis fier d’avoir terminé ce que j’avais prévu.' },
            { title: '8/12/2025', content: 'Calme et régulier, une journée simple qui fait du bien.' },
            { title: '9/12/2025', content: 'Beaucoup d’idées, j’ai noté ce que je veux tester prochainement.' },
            { title: '10/12/2025', content: 'Fatigue + légère frustration, mais ça ira mieux après une bonne nuit.' },
          ],
        },
      ],
    },

    // 6) Projets (pour compléter à 6 dossiers)
    {
      title: 'Projets',
      lists: [
        {
          title: 'Fil Rouge',
          color: 11,
          tasks: [
            { title: 'Définir la scope v1' },
            { title: 'Découper en user stories' },
            { title: 'Mettre en place CI (lint/test)' },
          ],
        },
        {
          title: 'Portfolio',
          color: 0,
          tasks: [
            { title: 'Optimiser la navigation clavier', favorite: true },
            { title: 'Ajouter une page “à propos” plus concise' },
            { title: 'Améliorer le Lighthouse (perf + a11y)' },
          ],
        },
        {
          title: 'Idées',
          color: 1,
          tasks: [
            { title: 'App “Blind test” à partir de playlists YouTube' },
            { title: 'Mini dashboard perso (habitudes + objectifs)' },
            { title: 'Template Next.js + Prisma + Auth' },
          ],
        },
      ],
    },
  ];

  // Optionnel : si tu relances le seed souvent et que tu veux éviter les doublons,
  // tu peux supprimer les dossiers de l’utilisateur avant de recréer.
  // await prisma.folder.deleteMany({ where: { userId: user.id } });

  for (const [folderOrder, folder] of folders.entries()) {
    await createFolderWithLists({ userId: user.id, folderOrder, folder });
  }
}

main()
  .catch((error) => console.error(error))
  .finally(async () => {
    await prisma.$disconnect();
  });
