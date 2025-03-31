<i18n src="./i18n.json"></i18n>

<script setup lang="ts">
const { t } = useI18n()

const stats = ref([
  {
    name: 'activeUsers',
    value: '2,834',
    change: '+12.5%',
    isIncrease: true,
    icon: 'users'
  },
  {
    name: 'totalRevenue',
    value: '$45,289',
    change: '+8.2%',
    isIncrease: true,
    icon: 'dollar-sign'
  },
  {
    name: 'activeProjects',
    value: '156',
    change: '-3.1%',
    isIncrease: false,
    icon: 'folder'
  },
  {
    name: 'customerSatisfaction',
    value: '94.8%',
    change: '+2.3%',
    isIncrease: true,
    icon: 'smile'
  }
])

const revenueChartOption = ref<ECOption>({
  title: {
    text: t('dashboard.revenueChart.title'),
    left: 'center'
  },
  tooltip: {
    trigger: 'axis'
  },
  xAxis: {
    type: 'category',
    data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun']
  },
  yAxis: {
    type: 'value'
  },
  series: [{
    data: [12000, 15000, 14000, 18000, 17000, 22000],
    type: 'line',
    smooth: true
  }]
})

const userDistributionOption = ref<ECOption>({
  title: {
    text: t('dashboard.userDistribution.title'),
    left: 'center'
  },
  tooltip: {
    trigger: 'item'
  },
  series: [{
    type: 'pie',
    radius: '60%',
    data: [
      { value: 45, name: 'Enterprise' },
      { value: 25, name: 'Professional' },
      { value: 30, name: 'Basic' }
    ]
  }]
})
</script>

<template>
  <NuxtLayout name="admin">
    <div class="space-y-8">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <UCard
          v-for="stat in stats"
          :key="stat.name"
          class="relative overflow-hidden"
        >
          <div class="flex items-center justify-between">
            <div>
              <div class="text-sm text-gray-500 dark:text-gray-400">
                {{ t(`dashboard.stats.${stat.name}`) }}
              </div>
              <div class="mt-1 text-2xl font-semibold">
                {{ stat.value }}
              </div>
              <div
                class="mt-2 flex items-center text-sm"
                :class="stat.isIncrease ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'"
              >
                <Icon
                  :name="stat.isIncrease ? 'lucide:trending-up' : 'lucide:trending-down'"
                  class="mr-1 h-4 w-4"
                />
                {{ stat.change }}
              </div>
            </div>
            <Icon
              :name="`lucide:${stat.icon}`"
              class="h-8 w-8 text-gray-400 dark:text-gray-600"
            />
          </div>
        </UCard>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <UCard>
          <VChart
            :option="revenueChartOption"
            style="height: 320px;"
          />
        </UCard>
        <UCard>
          <VChart
            :option="userDistributionOption"
            style="height: 320px;"
          />
        </UCard>
      </div>
    </div>
  </NuxtLayout>
</template>
