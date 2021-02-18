export default [
  {
    title: 'Home',
    route: 'home',
    icon: 'HomeIcon',
  },
  {
    title: 'Atividades',
    route: 'second-page',
    icon: 'FileIcon',
  },
  { header: 'Usuarios' },
  {
    title: 'Hosts',
    icon: 'UsersIcon',
    children: [
      {
        title: 'Hosts',
        route: 'host-list',
      },

      {
        title: 'Admin',
        route: 'host-edit',
      },
    ],
  },
]
