import { getNextAvailableFolderColorIndex } from '@/lib/folder-colors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type TaskSeed = {
  title: string;
  content?: string;
  favorite?: boolean;
  done?: boolean;
};

type ListSeed = {
  title: string;
  color: number;
  favorite?: boolean;
  countElement?: boolean;
  checkable?: boolean;
  template?: string;
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

function escapeHtml(content: string): string {
  return content
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function buildParagraph(content: string): string {
  return `<p>${content}</p>`;
}

function buildParagraphs(contents: string[]): string {
  return contents.map((content) => buildParagraph(content)).join('');
}

function buildInlineCode(content: string): string {
  return `<code>${escapeHtml(content)}</code>`;
}

function buildCodeBlock(code: string, languageClass = 'language-js'): string {
  return `<pre spellcheck="false"><code class="${languageClass}">${escapeHtml(code)}</code></pre>`;
}

function buildBlockquote(content: string): string {
  return `<blockquote><p>${content}</p></blockquote>`;
}

function buildBulletList(items: string[]): string {
  const listItems = items.map((item) => `<li><p>${item}</p></li>`).join('');
  return `<ul>${listItems}</ul>`;
}

function buildTaskList(items: Array<{ label: string; checked?: boolean }>): string {
  const listItems = items
    .map((item) => {
      const isChecked = item.checked ?? false;

      return `
        <li data-checked="${isChecked}" data-type="taskItem">
          <label>
            <input type="checkbox" ${isChecked ? 'checked="checked"' : ''}>
            <span></span>
          </label>
          <div>
            <p>${item.label}</p>
          </div>
        </li>
      `;
    })
    .join('');

  return `<ul data-type="taskList">${listItems}</ul>`;
}

function joinRichContent(...blocks: string[]): string {
  return blocks.join('<p></p>');
}

function buildTaskCreateInput(tasks: TaskSeed[]) {
  return {
    create: tasks.map((task, taskOrder) => ({
      title: task.title,
      order: taskOrder,
      favorite: task.favorite ?? false,
      done: task.done ?? false,
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
      favorite: list.favorite ?? false,
      countElement: list.countElement ?? true,
      checkable: list.checkable ?? false,
      ...(list.template ? { template: list.template } : {}),
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
    where: { email: 'Kairos.test@hotmail.com' },
    update: {
      name: 'Kairos',
    },
    create: {
      email: 'Kairos.test@hotmail.com',
      password: hashedPassword,
      name: 'Kairos',
    },
  });

  await prisma.userSettings.upsert({
    where: { userId: user.id },
    update: {},
    create: {
      userId: user.id,
    },
  });

  await prisma.folder.deleteMany({
    where: { userId: user.id },
  });

  const shoppingListTemplate = joinRichContent(
    buildParagraphs([
      'Liste de courses hebdomadaire.',
      'Pense à vérifier ce qu’il reste avant d’ajouter de nouveaux éléments.',
    ]),
    buildTaskList([
      { label: 'Fruits et légumes' },
      { label: 'Produits frais' },
      { label: 'Épicerie salée' },
      { label: 'Épicerie sucrée' },
      { label: 'Boissons' },
      { label: 'Produits ménagers' },
    ]),
    buildBlockquote('Regrouper les éléments par rayon permet souvent d’aller plus vite.'),
  );

  const sprintTemplate = joinRichContent(
    buildParagraphs([
      'Template de sprint court pour une liste technique.',
      'À utiliser quand une nouvelle liste sert de plan d’exécution.',
    ]),
    buildTaskList([
      { label: 'Clarifier le besoin' },
      { label: 'Identifier les contraintes' },
      { label: 'Découper en sous-tâches' },
      { label: 'Implémenter' },
      { label: 'Tester' },
      { label: 'Documenter' },
    ]),
    buildBlockquote('Un périmètre clair évite la dérive dès le début.'),
  );

  const readingTemplate = joinRichContent(
    buildParagraphs(['Template de note de lecture rapide.']),
    buildBulletList([
      'Pourquoi ce livre ?',
      'Idée principale',
      'Trois points à retenir',
      'Citation marquante',
      'Action concrète à tester',
    ]),
  );

  const dailyNoteTemplate = joinRichContent(
    buildParagraphs(['Note rapide de fin de journée.']),
    buildBulletList([
      'Énergie du jour',
      'Ce qui a avancé',
      'Blocage rencontré',
      'Prochaine étape',
    ]),
  );

  const programmingSnippetTemplate = joinRichContent(
    buildParagraphs([
      'Bloc réutilisable pour noter un exemple court.',
      `Le code inline s’écrit avec ${buildInlineCode('<code>...</code>')} et le bloc avec ${buildInlineCode('<pre><code class="language-js">...</code></pre>')}.`,
    ]),
    buildCodeBlock(`console.log("salut")`),
  );

  const folders: FolderSeed[] = [
    {
      title: 'Programmation',
      favorite: true,
      lists: [
        {
          title: 'HTML',
          color: 0,
          template: programmingSnippetTemplate,
          tasks: [
            {
              title: 'Structurer une page (header, nav, main, section, article, footer)',
              favorite: true,
              content: joinRichContent(
                buildParagraphs([
                  'Objectif : produire une page sémantique, lisible et durable.',
                  `Un document bien structuré réduit le besoin de classes utilitaires et facilite l’accessibilité.`,
                ]),
                buildBulletList([
                  `Prévoir un seul ${buildInlineCode('<main>')} par page`,
                  `Utiliser ${buildInlineCode('<section>')} seulement si un titre a du sens`,
                  `Réserver ${buildInlineCode('<article>')} à un contenu autonome`,
                  `Garder ${buildInlineCode('<header>')} et ${buildInlineCode('<footer>')} pour de vraies zones de structure`,
                ]),
              ),
            },
            {
              title: 'Formulaires (validation, autocomplete, types d’inputs)',
              content: joinRichContent(
                buildParagraphs([
                  `Toujours choisir le bon ${buildInlineCode('type')} d’input avant d’ajouter du JavaScript.`,
                ]),
                buildBulletList([
                  `Tester ${buildInlineCode('email')}, ${buildInlineCode('tel')}, ${buildInlineCode('number')} et ${buildInlineCode('date')}`,
                  `Ajouter ${buildInlineCode('autocomplete')} quand c’est pertinent`,
                  'Prévoir des messages d’erreur compréhensibles',
                ]),
              ),
            },
            {
              title: 'Accessibilité (landmarks, labels, aria-* utiles)',
              favorite: true,
              content: joinRichContent(
                buildParagraphs([
                  `Toujours préférer le HTML natif à une surcouche ARIA.`,
                ]),
                buildBulletList([
                  `Associer chaque champ à un ${buildInlineCode('<label>')}`,
                  `Utiliser ${buildInlineCode('aria-live')} uniquement pour les annonces utiles`,
                  'Préserver un ordre de navigation clavier logique',
                  'Rendre visibles les états de focus',
                ]),
                buildBlockquote('No ARIA is better than bad ARIA.'),
              ),
            },
            {
              title: 'SEO de base (title, meta, headings, liens)',
              content: joinRichContent(
                buildParagraphs([
                  `Une hiérarchie correcte de titres reste prioritaire sur l’ajout de métadonnées secondaires.`,
                ]),
                buildBulletList([
                  `Un seul ${buildInlineCode('<h1>')} cohérent`,
                  `Des ${buildInlineCode('<title>')} précis`,
                  'Des liens explicites et non ambigus',
                ]),
              ),
            },
            {
              title: 'Images & médias (srcset, picture, lazy-loading)',
              content: joinRichContent(
                buildParagraphs([
                  `À tester avec ${buildInlineCode('srcset')} et ${buildInlineCode('sizes')} sur plusieurs largeurs d’écran.`,
                ]),
                buildCodeBlock(
                  `<img
  src="/images/card-640.jpg"
  srcset="/images/card-320.jpg 320w, /images/card-640.jpg 640w, /images/card-960.jpg 960w"
  sizes="(max-width: 768px) 100vw, 33vw"
  alt="Carte produit"
/>`,
                  'language-html',
                ),
              ),
            },
            {
              title: 'Bonnes pratiques sémantiques (figure, time, details/summary)',
              content: joinRichContent(
                buildParagraphs([
                  `Penser à ${buildInlineCode('<figure>')} pour relier une image à sa légende et à ${buildInlineCode('<time>')} pour les dates structurées.`,
                ]),
              ),
            },
          ],
        },
        {
          title: 'CSS',
          color: 1,
          tasks: [
            {
              title: 'Flexbox (align-items, justify-content, gaps)',
              content: joinRichContent(
                buildParagraphs([
                  `Pratique pour l’alignement d’éléments sur un axe principal avec ${buildInlineCode('display: flex')}.`,
                ]),
                buildBulletList([
                  `Tester ${buildInlineCode('align-items')}, ${buildInlineCode('justify-content')} et ${buildInlineCode('gap')}`,
                  'Comparer colonne et ligne',
                  'Vérifier le rendu avec des contenus de tailles différentes',
                ]),
              ),
            },
            {
              title: 'Grid (areas, auto-fit, minmax)',
              favorite: true,
              content: joinRichContent(
                buildParagraphs([
                  'À pratiquer sur une vraie grille de cartes responsive.',
                ]),
                buildBulletList([
                  `Tester ${buildInlineCode('repeat(auto-fit, minmax(240px, 1fr))')}`,
                  `Comparer ${buildInlineCode('auto-fit')} avec ${buildInlineCode('auto-fill')}`,
                  `Utiliser ${buildInlineCode('gap')} au lieu des marges internes`,
                ]),
                buildCodeBlock(
                  `.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 16px;
}`,
                  'language-css',
                ),
              ),
            },
            {
              title: 'Responsive moderne (container queries)',
              content: joinRichContent(
                buildParagraphs([
                  `Les container queries sont utiles quand le composant dépend de sa largeur réelle, pas de la fenêtre.`,
                ]),
                buildCodeBlock(
                  `.card-list {
  container-type: inline-size;
}

@container (min-width: 560px) {
  .card {
    grid-template-columns: 120px 1fr;
  }
}`,
                  'language-css',
                ),
              ),
            },
            {
              title: 'Variables CSS (custom properties) + calc()',
              content: joinRichContent(
                buildParagraphs([
                  `Pratique pour exprimer un design system léger avec ${buildInlineCode('--spacing-medium')} ou ${buildInlineCode('--color-primary')}.`,
                ]),
              ),
            },
            {
              title: 'Animations (transition, keyframes, prefers-reduced-motion)',
              content: joinRichContent(
                buildParagraphs([
                  `Toujours prévoir un comportement respectueux de ${buildInlineCode('prefers-reduced-motion')}.`,
                ]),
              ),
            },
            {
              title: 'Architecture (BEM / ITCSS / tokens)',
              content: joinRichContent(
                buildParagraphs([
                  'L’objectif n’est pas de suivre un dogme mais de garder un CSS prévisible et lisible.',
                ]),
              ),
            },
          ],
        },
        {
          title: 'JavaScript',
          color: 2,
          template: programmingSnippetTemplate,
          tasks: [
            {
              title: 'Async/await, Promises, gestion d’erreurs',
              favorite: true,
              content: joinRichContent(
                buildParagraphs([
                  `Cas à maîtriser : appels parallèles, annulation, erreurs réseau et fallback.`,
                ]),
                buildTaskList([
                  { label: 'Utiliser try/catch proprement', checked: true },
                  { label: 'Tester Promise.all et Promise.allSettled', checked: true },
                  { label: 'Ajouter un AbortController' },
                  { label: 'Prévoir un état de chargement et un état d’erreur' },
                ]),
                buildCodeBlock(
                  `async function fetchUserProfile() {
  try {
    const response = await fetch("/api/profile");

    if (!response.ok) {
      throw new Error("Impossible de charger le profil");
    }

    const profile = await response.json();
    console.log("salut");
    return profile;
  } catch (error) {
    console.error(error);
    return null;
  }
}`,
                ),
              ),
            },
            {
              title: 'DOM moderne (querySelector, dataset, classList)',
              content: joinRichContent(
                buildParagraphs([
                  `À pratiquer avec ${buildInlineCode('querySelector')}, ${buildInlineCode('closest')} et ${buildInlineCode('dataset')}.`,
                ]),
                buildCodeBlock(
                  `const actionButtonElement = document.querySelector("[data-action]");

actionButtonElement?.addEventListener("click", (event) => {
  const currentButtonElement = event.currentTarget;
  console.log(currentButtonElement?.dataset.action);
});`,
                ),
              ),
            },
            {
              title: 'Événements + délégation',
              content: joinRichContent(
                buildParagraphs([
                  `La délégation d’événements évite d’attacher un listener à chaque élément enfant.`,
                ]),
                buildCodeBlock(
                  `document.addEventListener("click", (event) => {
  const targetElement = event.target;

  if (!(targetElement instanceof HTMLElement)) {
    return;
  }

  const deleteButtonElement = targetElement.closest("[data-delete-task-id]");

  if (!deleteButtonElement) {
    return;
  }

  console.log(deleteButtonElement.dataset.deleteTaskId);
});`,
                ),
              ),
            },
            {
              title: 'Modules ES (import/export) + bundlers',
              content: joinRichContent(
                buildParagraphs([
                  `Préférer des modules petits et explicites avec des noms lisibles.`,
                ]),
                buildCodeBlock(
                  `import { formatCurrency } from "./format-currency.js";
import { fetchCurrentUser } from "./fetch-current-user.js";

console.log(formatCurrency(19.99));
console.log(fetchCurrentUser);`,
                ),
              ),
            },
            {
              title: 'Fetch + AbortController (timeouts, annulation)',
              content: joinRichContent(
                buildParagraphs([
                  `Très utile pour annuler une requête quand un composant est détruit ou qu’une recherche change.`,
                ]),
                buildCodeBlock(
                  `const abortController = new AbortController();

setTimeout(() => {
  abortController.abort();
}, 3000);

fetch("/api/search?q=frontend", {
  signal: abortController.signal,
})
  .then((response) => response.json())
  .then((payload) => {
    console.log(payload);
  })
  .catch((error) => {
    console.error(error);
  });`,
                ),
              ),
            },
            {
              title: 'Tests (Vitest/Jest) sur fonctions pures',
              content: joinRichContent(
                buildParagraphs([
                  `Commencer par les fonctions pures avant de tester l’intégration.`,
                ]),
                buildCodeBlock(
                  `import { describe, expect, it } from "vitest";
import { sumNumbers } from "./sum-numbers";

describe("sumNumbers", () => {
  it("returns the sum of two numbers", () => {
    expect(sumNumbers(2, 3)).toBe(5);
  });
});`,
                ),
              ),
            },
          ],
        },
        {
          title: 'TypeScript',
          color: 3,
          favorite: true,
          template: sprintTemplate,
          tasks: [
            {
              title: 'Types utilitaires (Pick, Omit, Partial, Record)',
              content: joinRichContent(
                buildParagraphs([
                  `Très pratique pour dériver des types depuis une source unique.`,
                ]),
                buildCodeBlock(
                  `type User = {
  id: string;
  email: string;
  name: string;
  isAdmin: boolean;
};

type PublicUser = Pick<User, "id" | "name">;
type UserPatch = Partial<User>;`,
                  'language-ts',
                ),
              ),
            },
            {
              title: 'Génériques (constraints, infer)',
              content: joinRichContent(
                buildParagraphs([
                  `À travailler avec des noms explicites comme ${buildInlineCode('TEntity')} ou ${buildInlineCode('TResponse')}.`,
                ]),
              ),
            },
            {
              title: 'Narrowing (type guards, discriminated unions)',
              favorite: true,
              content: joinRichContent(
                buildParagraphs([
                  `Sujet essentiel pour éviter les assertions fragiles.`,
                ]),
                buildBulletList([
                  'Créer un type guard dédié quand la logique se répète',
                  'Préférer une union discriminée quand le domaine s’y prête',
                  `Faire remonter les cas impossibles avec ${buildInlineCode('never')}`,
                ]),
                buildCodeBlock(
                  `type LoadState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "success"; data: string[] }
  | { status: "error"; message: string };

function renderState(loadState: LoadState) {
  switch (loadState.status) {
    case "idle":
      return "idle";
    case "loading":
      return "loading";
    case "success":
      return loadState.data.join(", ");
    case "error":
      return loadState.message;
    default: {
      const exhaustiveCheck: never = loadState;
      return exhaustiveCheck;
    }
  }
}`,
                  'language-ts',
                ),
              ),
            },
            {
              title: 'Zod / validation runtime + types',
              content: joinRichContent(
                buildParagraphs([
                  `Très utile quand une donnée externe doit être vérifiée avant usage.`,
                ]),
                buildCodeBlock(
                  `import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string().min(1),
});

const parsedUser = userSchema.safeParse({
  id: "1",
  email: "kairos@test.dev",
  name: "Kairos",
});

console.log(parsedUser.success);`,
                ),
              ),
            },
            {
              title: 'Ergonomie DX (eslint, tsconfig strict, path aliases)',
              content: joinRichContent(
                buildParagraphs([
                  `Activer ${buildInlineCode('strict: true')} reste l’un des meilleurs investissements sur le long terme.`,
                ]),
              ),
            },
            {
              title: 'Patterns (DTO, mappers, domain types)',
              content: joinRichContent(
                buildParagraphs([
                  'Séparer clairement la donnée reçue, la donnée affichée et la donnée métier.',
                ]),
              ),
            },
          ],
        },
        {
          title: 'Python',
          color: 4,
          tasks: [
            {
              title: 'Venv + dépendances (pip-tools/poetry)',
              content: joinRichContent(
                buildParagraphs([
                  `Toujours isoler l’environnement avec ${buildInlineCode('venv')} ou un outil équivalent.`,
                ]),
              ),
            },
            { title: 'AsyncIO (bases, awaitables)' },
            {
              title: 'FastAPI (routes, pydantic, dépendances)',
              content: joinRichContent(
                buildParagraphs([
                  'Bon terrain d’entraînement pour une API typée et rapide à exposer.',
                ]),
                buildCodeBlock(
                  `from fastapi import FastAPI

application = FastAPI()

@application.get("/health")
def read_health():
    return {"status": "ok"}`,
                  'language-py',
                ),
              ),
            },
            { title: 'Tests (pytest) + fixtures' },
            { title: 'Types (mypy, typing, dataclasses)' },
            { title: 'Scripts utilitaires (CLI avec argparse/typer)' },
          ],
        },
        {
          title: 'SQL',
          color: 5,
          tasks: [
            {
              title: 'SELECT avancé (JOIN, GROUP BY, HAVING)',
              content: joinRichContent(
                buildParagraphs([
                  `Revoir la différence entre filtre avant agrégation et filtre après agrégation avec ${buildInlineCode('HAVING')}.`,
                ]),
                buildCodeBlock(
                  `SELECT category_id, COUNT(*) AS task_count
FROM tasks
GROUP BY category_id
HAVING COUNT(*) >= 3;`,
                  'language-sql',
                ),
              ),
            },
            {
              title: 'Index (quand/pourquoi), EXPLAIN',
              content: joinRichContent(
                buildParagraphs([
                  'Ne pas ajouter un index au hasard.',
                  'Mesurer l’impact réel avant et après.',
                ]),
                buildBulletList([
                  `Lire le plan avec ${buildInlineCode('EXPLAIN')}`,
                  'Regarder les colonnes vraiment filtrées ou triées',
                  'Ne pas oublier le coût en écriture',
                ]),
              ),
            },
            { title: 'Transactions + verrous (notions)' },
            { title: 'Contraintes (FK, unique, check), migrations' },
            { title: 'Fenêtrage (ROW_NUMBER, OVER, partitions)' },
            { title: 'Modélisation (normalisation, relations)' },
          ],
        },
      ],
    },

    {
      title: 'Films',
      lists: [
        {
          title: 'Action',
          color: 6,
          tasks: [
            { title: 'Mad Max: Fury Road', done: true },
            { title: 'John Wick', done: true },
            { title: 'Die Hard' },
            { title: 'The Raid' },
            { title: 'Mission: Impossible – Fallout' },
            { title: 'Gladiator' },
            { title: 'Terminator 2: Judgment Day' },
            { title: 'The Dark Knight', favorite: true },
            { title: 'Heat' },
            { title: 'Casino Royale' },
          ],
        },
        {
          title: 'Science-fiction',
          color: 7,
          tasks: [
            {
              title: 'Blade Runner 2049',
              favorite: true,
              content: joinRichContent(
                buildParagraphs([
                  'À revoir pour l’ambiance visuelle, la musique et le rythme assumé.',
                ]),
                buildBulletList([
                  'Photographie',
                  'Bande-son',
                  'Construction du mystère',
                ]),
              ),
            },
            { title: 'Interstellar', done: true },
            { title: 'Arrival' },
            { title: 'Dune' },
            { title: 'The Matrix', done: true },
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
            { title: 'Whiplash', favorite: true },
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
            { title: 'Spirited Away', done: true },
            { title: 'Princess Mononoke' },
            { title: 'Toy Story' },
            { title: 'Wall·E', favorite: true },
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

    {
      title: 'Livres',
      lists: [
        {
          title: 'George Orwell',
          color: 0,
          template: readingTemplate,
          tasks: [
            { title: '1984', done: true },
            { title: 'Animal Farm' },
            { title: 'Homage to Catalonia' },
          ],
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
            { title: 'The Hobbit', done: true },
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

    {
      title: 'Recettes',
      lists: [
        {
          title: 'Courses de la semaine',
          color: 6,
          favorite: true,
          checkable: true,
          template: shoppingListTemplate,
          tasks: [
            { title: 'Tomates', done: true },
            { title: 'Mozzarella' },
            { title: 'Pain de campagne' },
            { title: 'Basilic frais' },
            { title: 'Yaourts nature', done: true },
            { title: 'Œufs' },
          ],
        },
        {
          title: 'Entrées',
          color: 7,
          tasks: [
            {
              title: 'Bruschetta tomate & basilic',
              content: joinRichContent(
                buildParagraphs([
                  'Recette rapide pour un déjeuner léger ou un apéritif.',
                ]),
                buildBulletList([
                  'Pain',
                  'Tomates',
                  'Ail',
                  'Basilic',
                  'Huile d’olive',
                ]),
                buildParagraph(
                  `Griller le pain, frotter l’ail, ajouter les tomates en dés, le basilic puis un filet d’huile d’olive.`,
                ),
              ),
            },
            { title: 'Velouté de potimarron' },
            {
              title: 'Salade César (version simple)',
              content: joinRichContent(
                buildParagraphs([
                  'Poulet, romaine, parmesan et croûtons.',
                  'Sauce rapide : yaourt, citron, moutarde, ail, anchois en option.',
                ]),
              ),
            },
            { title: 'Œufs mimosa' },
            { title: 'Houmous & crudités' },
            { title: 'Carpaccio de courgettes' },
          ],
        },
        {
          title: 'Plats',
          color: 8,
          tasks: [
            {
              title: 'Pâtes carbonara (sans crème)',
              favorite: true,
              content: joinRichContent(
                buildParagraphs([
                  'Base : guanciale ou lardons, œufs, pecorino ou parmesan.',
                  'Mélanger hors du feu avec un peu d’eau de cuisson pour garder une sauce liée.',
                ]),
                buildBlockquote('La chaleur résiduelle suffit si les pâtes sont bien chaudes.'),
              ),
            },
            { title: 'Poulet curry coco' },
            { title: 'Chili con carne' },
            {
              title: 'Saumon au four & légumes rôtis',
              content: joinRichContent(
                buildParagraphs([
                  'Four à 200°C.',
                  'Cuire les légumes 25 minutes puis ajouter le saumon 12 à 15 minutes.',
                ]),
              ),
            },
            { title: 'Buddha bowl (riz, légumes, sauce tahini)' },
            { title: 'Ratatouille express' },
          ],
        },
        {
          title: 'Desserts',
          color: 9,
          tasks: [
            { title: 'Tiramisu' },
            {
              title: 'Mousse au chocolat',
              content: joinRichContent(
                buildParagraphs([
                  'Faire fondre le chocolat.',
                  'Monter les blancs en neige puis incorporer délicatement.',
                  'Laisser reposer au frais au moins trois heures.',
                ]),
              ),
            },
            { title: 'Panna cotta vanille' },
            { title: 'Compote pommes-cannelle' },
            { title: 'Crêpes' },
            { title: 'Salade de fruits' },
          ],
        },
        {
          title: 'Pâtisserie',
          color: 10,
          tasks: [
            {
              title: 'Cookies moelleux',
              content: joinRichContent(
                buildParagraphs([
                  'Beurre, sucre, œuf, farine, levure et pépites de chocolat.',
                  'Cuisson 10 à 12 minutes à 180°C avec un centre encore tendre.',
                ]),
              ),
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

    {
      title: 'Perso',
      lists: [
        {
          title: 'Notes',
          color: 10,
          template: dailyNoteTemplate,
          tasks: [
            {
              title: '1/12/2025',
              content: joinRichContent(
                buildParagraph('Bonne énergie aujourd’hui, je me suis senti productif et serein.'),
                buildBulletList([
                  'Priorité traitée',
                  'Niveau d’énergie : 8/10',
                  'À refaire demain : bloc de concentration sans notifications',
                ]),
              ),
            },
            {
              title: '2/12/2025',
              content: 'Journée un peu chargée, mais j’ai gardé le cap sans trop de stress.',
            },
            {
              title: '3/12/2025',
              content: 'Un peu fatigué, j’ai eu du mal à rester concentré en fin de journée.',
            },
            {
              title: '4/12/2025',
              content: 'Motivé et inspiré, j’ai avancé sur des sujets qui me tenaient à cœur.',
            },
            {
              title: '5/12/2025',
              content: 'Journée moyenne, j’ai eu besoin de pauses pour repartir.',
            },
            {
              title: '6/12/2025',
              content: 'Très bonne humeur, j’ai pris du temps pour souffler.',
            },
            {
              title: '7/12/2025',
              content: 'Un peu de pression, mais je suis fier d’avoir terminé ce que j’avais prévu.',
            },
            {
              title: '8/12/2025',
              content: 'Calme et régulier, une journée simple qui fait du bien.',
            },
            {
              title: '9/12/2025',
              content: 'Beaucoup d’idées, j’ai noté ce que je veux tester prochainement.',
            },
            {
              title: '10/12/2025',
              content: 'Fatigue et légère frustration, mais ça ira mieux après une bonne nuit.',
            },
          ],
        },
        {
          title: 'Routine du matin',
          color: 11,
          checkable: true,
          template: joinRichContent(
            buildParagraphs([
              'Routine simple pour démarrer la journée sans friction.',
            ]),
            buildTaskList([
              { label: 'Boire un verre d’eau' },
              { label: 'Ouvrir les volets' },
              { label: 'Faire 5 minutes d’étirement' },
              { label: 'Définir la priorité du jour' },
            ]),
          ),
          tasks: [
            { title: 'Boire un verre d’eau', done: true },
            { title: 'Faire le lit', done: true },
            { title: '5 minutes d’étirement' },
            { title: 'Définir la priorité du jour' },
          ],
        },
      ],
    },

    {
      title: 'Projets',
      lists: [
        {
          title: 'Fil Rouge',
          color: 11,
          favorite: true,
          template: sprintTemplate,
          tasks: [
            {
              title: 'Définir le scope v1',
              favorite: true,
              content: joinRichContent(
                buildParagraphs([
                  'Définir ce qui entre dans le MVP et ce qui reste hors périmètre.',
                ]),
                buildBulletList([
                  'Fonctionnalités indispensables',
                  'Hypothèses à valider',
                  'Risques techniques',
                ]),
              ),
            },
            { title: 'Découper en user stories' },
            { title: 'Mettre en place CI (lint/test)', done: true },
          ],
        },
        {
          title: 'Portfolio',
          color: 0,
          tasks: [
            { title: 'Optimiser la navigation clavier', favorite: true },
            { title: 'Ajouter une page “à propos” plus concise' },
            {
              title: 'Améliorer le Lighthouse (perf + a11y)',
              content: joinRichContent(
                buildParagraphs([
                  'Vérifier les images, la structure des headings, la navigation clavier et le poids des bundles.',
                ]),
                buildTaskList([
                  { label: 'Faire un audit Lighthouse', checked: true },
                  { label: 'Optimiser les images' },
                  { label: 'Vérifier le focus visible' },
                  { label: 'Réduire le JavaScript non critique' },
                ]),
              ),
            },
          ],
        },
        {
          title: 'Idées',
          color: 1,
          countElement: false,
          tasks: [
            {
              title: 'App “Blind test” à partir de playlists YouTube',
              content: joinRichContent(
                buildParagraphs([
                  'Concept : générer automatiquement une session de blind test à partir d’une playlist.',
                ]),
                buildBulletList([
                  'Importer une playlist',
                  'Gérer les manches',
                  'Chronomètre',
                  'Scores par joueur',
                ]),
                buildCodeBlock(
                  `function createRoundFromVideo(video) {
  return {
    id: video.id,
    title: video.title,
    previewUrl: video.previewUrl,
  };
}

console.log("salut");`,
                ),
              ),
            },
            { title: 'Mini dashboard perso (habitudes + objectifs)' },
            { title: 'Template Next.js + Prisma + Auth' },
          ],
        },
      ],
    },
  ];

  for (const [folderOrder, folder] of folders.entries()) {
    await createFolderWithLists({
      userId: user.id,
      folderOrder,
      folder,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });