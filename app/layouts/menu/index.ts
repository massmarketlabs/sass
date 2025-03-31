export const getMenus = (t: (name: string) => string): NavigationMenuItem[][] => {
  return [
    [
      {
        label: t('menu.dashboard'),
        icon: 'i-lucide-layout-dashboard',
        to: '/admin/dashboard'
      },
      {
        label: t('menu.users'),
        icon: 'i-lucide-users',
        to: '/admin/user'
      },
      {
        label: t('menu.maintenance'),
        icon: 'i-lucide-wrench',
        children: [
          {
            label: t('menu.dbPoolStatus'),
            icon: 'i-lucide-database',
            to: '/admin/maintenance/dbPool'
          }
        ]
      },
      {
        label: 'Composables',
        icon: 'i-lucide-database',
        defaultOpen: false,
        children: [
          {
            label: 'Table',
            icon: 'i-lucide-file-text',
            to: '/admin/table'
          },
          {
            label: 'Another Table2',
            icon: 'i-lucide-file-text'
          }
        ]
      }
    ],
    [
      {
        label: 'GitHub',
        icon: 'i-lucide-github',
        badge: '1k',
        to: 'https://github.com/NuxSaaS/NuxSaaS',
        target: '_blank'
      },
      {
        label: 'Help',
        icon: 'i-lucide-circle-help',
        disabled: true
      }
    ]
  ]
}
