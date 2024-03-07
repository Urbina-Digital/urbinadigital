import { create } from 'zustand';

const templateList = [
  {
    name: `heading`,
    content: {
      header: `Greetings`,
      body: `Jogus Rogsum, my friends, Lorem Ipsum is demithos tryptasum. Imagine living in a world where everything you do is by choice, not because you have to. Rogan Ipsum, carpe diem! You ever look up at the stars and think, 'Man, there's so much we don't know about.' Veni, vidi, Rogan! We're just on this rock, spinning through space.`,
    },
  },
  {
    name: `about`,
    content: {
      header: `Jason Urbina`,
      body: `I'm Jason Urbina, a seasoned Front-End Web Developer based in Los Angeles, known for crafting exceptional digital experiences. My work is marked by unwavering precision, a keen eye for design aesthetics, and a deep understanding of the software development lifecycle. My passion lies in elevating the user experience, consistently delivering interfaces that resonate with consumers. My approach is anchored in robust technical architecture, ensuring seamless navigation while presenting users with clean, logically structured designs. I take pride in my role as an essential component of successful engineering projects, where my dedication to crafting user-centric solutions shines through.`,
    },
  },
  {
    name: `work`,
    content: {
      header: `My Contributions`,
      body: 'I did this.',
      workList: [
        {
          name: 'Samsung',
          company: 'Samsung Research America',
          position: 'Senior Software Developer',
          points: [
            {value: `Created low to high-fidelity interactive prototypes based on system architecture, workflows, interaction flows, and visual mock-ups provided by designers, utilizing the Vue framework and best practices.`},
            {value: `Managed flexibility and bandwidth efficiently aligning with tight deadlines while effectively managing trade-offs between the target design and technical feasibility.`},
            {value: `Applied technical standardizations to collaborate with offshore development teams through and around perceived limitations and challenges imposed by the delivery platform to create delightful experiences for customers that maintained the integrity of design provided by designers.`},
            {value: `Effectively ran and maintained live user testing scenarios with designers to identify and define UX improvement opportunities and digest user interaction data`},
          ],
          imageList: [
            `https://picsum.photos/seed/picsum/350/420?blur=1`,
            `https://picsum.photos/seed/picsum/350/420?blur=2`,
            `https://picsum.photos/seed/picsum/350/420?blur=3`,
          ],
        },
        {
          name: 'Kaiser',
          company: 'Kaiser Permanente',
          position: 'Senior Sofware Engineer',
          points: [
            {value: `Contributed to development of React Components for the Kaiser Self-Service Project`},
            {value: `Responsible for building out ‘Search’, ‘Filter’, ‘Error’ components and views`},
            {value: `Used React ‘Hooks’ & Redux for presentation layer rendering and data-binding`},
            {value: `Properly debug reducers to match service payloads to deliver necessary ‘account-info’`},
            {value: `Proactively assessed accessibility call-outs and maintained ADA compliance`},
            {value: `Effectively demoed POC’s and final components`},
            {value: `Maintained versioning cadence with isolated Git forks`},
            {value: `Adamantly handed-off flattened,  clean commits and pull requests`},
            {value: `Unit Tested React Components with Enyzme and Jest`},
          ],
          imageList: [
            `https://picsum.photos/seed/picsum/350/420?blur=1`,
            `https://picsum.photos/seed/picsum/350/420?blur=2`,
            `https://picsum.photos/seed/picsum/350/420?blur=3`,
          ],
        },
        {
          name: 'Accenture',
          company: 'Accenture',
          position: 'Senior Staff Software Developer',
          points: [
            {value: `Responsible for championing as a Developer across many Accenture client projects`},
            {value: `Assessing technical weight of internal and external software deliverables`},
            {value: `Streamline onboarding of juniors and effectively knowledge transfer to maintain delivery cadence and development burndown`},
          ],
          imageList: [
            `https://picsum.photos/seed/picsum/350/420?blur=1`,
            `https://picsum.photos/seed/picsum/350/420?blur=2`,
            `https://picsum.photos/seed/picsum/350/420?blur=3`,
          ],
        },
      ],
    },
  },
];

const useMainStore = create((set) => ({
  templateData: templateList,
  historySelectData: templateList[2].content.workList,
  selectedHistory: {},
  updateSelectedHistory: (selection) => set(({ selectedHistory: selection })),
}));

export default useMainStore;