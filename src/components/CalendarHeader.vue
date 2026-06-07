<script setup lang="ts">
import { computed } from 'vue'
import { ElButton, ElButtonGroup, ElRadioGroup, ElRadioButton } from 'element-plus'
import { DArrowLeft, DArrowRight, Plus, Calendar } from '@element-plus/icons-vue'
import { useCalendarStore } from '@/stores/calendar'
import type { ViewType } from '@/types'

const props = defineProps<{
  dateLabel: string
}>()

const store = useCalendarStore()

const viewType = computed({
  get: () => store.viewType,
  set: (val: ViewType) => store.setViewType(val)
})
</script>

<template>
  <div class="calendar-header">
    <div class="header-left">
      <span class="date-label">{{ props.dateLabel }}</span>
      <div class="nav-buttons">
        <ElButtonGroup>
          <ElButton :icon="DArrowLeft" @click="store.navigatePrev" />
          <ElButton :icon="DArrowRight" @click="store.navigateNext" />
        </ElButtonGroup>
      </div>
      <ElButton type="primary" :icon="Calendar" @click="store.goToToday">
        今天
      </ElButton>
    </div>
    <div class="header-right">
      <ElRadioGroup v-model="viewType">
        <ElRadioButton value="month">月视图</ElRadioButton>
        <ElRadioButton value="week">周视图</ElRadioButton>
      </ElRadioGroup>
      <ElButton type="success" :icon="Plus" @click="store.openAddDialog()">
        新增事件
      </ElButton>
    </div>
  </div>
</template>
