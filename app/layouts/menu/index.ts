export const getMenus = (t: TranFunction, appRepo: string): NavigationMenuItem[][] => {
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
        label: t('menu.subscriptions'),
        icon: 'i-lucide-credit-card',
        to: '/admin/subscription'
      },
      {
        label: t('menu.maintenance'),
        icon: 'i-lucide-wrench',
        children: [
          {
            label: t('menu.dbStats'),
            icon: 'i-lucide-database',
            to: '/admin/maintenance/db-stats'
          }
        ]
      }
    ],
    [
      {
        label: 'GitHub',
        icon: 'i-lucide-github',
        badge: '1k',
        to: appRepo,
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
