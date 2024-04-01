import { faker } from '@faker-js/faker';

export enum AssignmentStatus {
  Open = 'OPEN',
  Closed = 'CLOSED',
}

export const ALL_ASSIGNMENT_STATUSES = Object.values(AssignmentStatus) as [
  AssignmentStatus,
  ...AssignmentStatus[]
];

export enum AssignmentType {
  Homework = 'HOMEWORK',
  Quiz = 'QUIZ',
  Project = 'PROJECT',
}

export const ALL_ASSIGNMENT_TYPES = Object.values(AssignmentType) as [
  AssignmentType,
  ...AssignmentType[]
];

export const MOCKED_ASSIGNMENT_BY_TYPE = Object.freeze({
  [AssignmentType.Homework]: {
    title: 'Homework Example',
    content: `Coerceo vitium aveho non varius amicitia. Aliquid laudantium voluntarius. Adfero vae vobis.
      Tempus despecto tenax averto tutamen vulticulus adsidue. Amicitia aduro accusantium. Angulus tenetur caste cura caterva conculco vobis demens terreo.
      Derideo communis aegrus cunctatio. Ancilla eius trado censura ullus. Alo sit abeo antiquus attollo corrupti defero artificiose usus voluptates.
      Amor decretum delibero succurro arceo aperte arcus. Vinco correptius credo curriculum explicabo ascisco voluptatem. Alveus adinventitias capillus cotidie aeneus complectus adaugeo.
    `,
    points: 6,
    dueAt: faker.date.future(),
  },
  [AssignmentType.Quiz]: {
    title: 'Quiz Example',
    content: `Voluptate cenaculum celebrer maiores armarium cogito atqui. Vinculum aggredior ascisco venio nihil adduco impedit. Modi cetera calcar crudelis nam concedo ea somnus candidus vespillo.
      Angustus super attollo tersus voluptas curatio cubitum absens suffoco consequatur. Canis crastinus tenetur adipiscor ancilla totidem. Theologus compello virtus.
      Admiratio patior tenuis dolores. Socius cohaero sumo vitae. Corrumpo vapulus concedo tenuis.
      Demoror sufficio ager commemoro pecus virga. Utpote teres altus nostrum dapifer quae attonbitus. Crinis voluptatem accedo adopto auctus cultura vitium debilito totam."
    `,
    points: 4,
    dueAt: faker.date.future(),
  },
  [AssignmentType.Project]: {
    title: 'Project Example',
    content: `Laboriosam volaticus conculco arma. Suspendo officiis ullus taedium virga conqueror aspernatur ascit decretum adfectus. Patrocinor denego confero vigilo textilis volutabrum adeptio vulticulus.
      Atrox bene tres dapifer occaecati aestivus impedit. Solvo vorago amplus. Teres canonicus virtus contra.
      Vociferor coniecto adulescens adicio. Aptus antiquus sumptus. Temperantia debeo caelum illo alo xiphias custodia conculco deinde decipio.
      Infit virtus tracto adulatio eligendi corpus demonstro deorsum. Ars bestia utrum adimpleo cornu coadunatio. Curtus cerno adhuc curso patior veritas vehemens.
    `,
    points: 9,
    dueAt: faker.date.future(),
  },
});
