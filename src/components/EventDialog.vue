<script setup lang="ts">
import { ref, computed, watch, reactive } from 'vue'
import { ElDialog, ElForm, ElFormItem, ElInput, ElTimePicker, ElButton, ElMessageBox, ElTooltip } from 'element-plus'
import { Edit, Delete, Close, Check } from '@element-plus/icons-vue'
import { useCalendarStore } from '@/stores/calendar'
import type { FormInstance, FormRules } from 'element-plus'

const store = useCalendarStore()

const formRef = ref<FormInstance>()
const formData = ref({
  title: '',
  description: '',
  date: '',
  startTime: '09:00',
  endTime: '10:00',
  color: '#409eff'
})

const rules = reactive<FormRules>({
  title: [{ required: true, message: '请输入事件标题', trigger: 'blur' }],
  date: [{ required: true, message: '请选择日期', trigger: 'change' }],
  startTime: [{ required: true, message: '请选择开始时间', trigger: 'change' }],
  endTime: [{ required: true, message: '请选择结束时间', trigger: 'change' }]
})

const isReadOnly = computed(() => store.dialogMode === 'view')
const dialogTitle = computed(() => {
  switch (store.dialogMode) {
    case 'add': return '新增事件'
    case 'edit': return '编辑事件'
    case 'view': return '查看事件'
    default: return '事件'
  }
})

watch(() => store.dialogVisible, (visible) => {
  if (visible) {
    if (store.editingEvent) {
      formData.value = {
        title: store.editingEvent.title,
        description: store.editingEvent.description,
        date: store.editingEvent.date,
        startTime: store.editingEvent.startTime,
        endTime: store.editingEvent.endTime,
        color: store.editingEvent.color
      }
    } else {
      formData.value = {
        title: '',
        description: '',
        date: store.selectedDate,
        startTime: '09:00',
        endTime: '10:00',
        color: '#409eff'
      }
    }
  }
})

const handleEdit = () => {
  store.dialogMode = 'edit'
}

const handleDelete = async () => {
  if (!store.editingEvent) return
  
  await ElMessageBox.confirm(
    '确定要删除这个事件吗？',
    '删除确认',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
  
  store.deleteEvent(store.editingEvent.id)
  store.closeDialog()
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate((valid) => {
    if (!valid) return
    
    const eventData = {
      title: formData.value.title,
      description: formData.value.description,
      date: formData.value.date,
      startTime: formData.value.startTime,
      endTime: formData.value.endTime,
      color: formData.value.color
    }
    
    if (store.dialogMode === 'add') {
      store.addEvent(eventData)
    } else if (store.dialogMode === 'edit' && store.editingEvent) {
      store.updateEvent(store.editingEvent.id, eventData)
    }
    
    store.closeDialog()
  })
}


</script>

<template>
  <ElDialog
    v-model="store.dialogVisible"
    :title="dialogTitle"
    width="500px"
    class="event-dialog"
    :close-on-click-modal="false"
  >
    <ElForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      class="event-form"
      label-width="80px"
    >
      <ElFormItem label="标题" prop="title">
        <ElInput
          v-model="formData.title"
          placeholder="请输入事件标题"
          :readonly="isReadOnly"
        />
      </ElFormItem>

      <ElFormItem label="日期" prop="date">
        <ElInput
          v-model="formData.date"
          type="date"
          :readonly="isReadOnly"
        />
      </ElFormItem>

      <ElFormItem label="时间">
        <div style="display: flex; gap: 12px; width: 100%;">
          <ElFormItem prop="startTime" style="flex: 1; margin-bottom: 0;">
            <ElTimePicker
              v-model="formData.startTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="开始时间"
              :readonly="isReadOnly"
              style="width: 100%;"
            />
          </ElFormItem>
          <span style="align-self: center;">至</span>
          <ElFormItem prop="endTime" style="flex: 1; margin-bottom: 0;">
            <ElTimePicker
              v-model="formData.endTime"
              format="HH:mm"
              value-format="HH:mm"
              placeholder="结束时间"
              :readonly="isReadOnly"
              style="width: 100%;"
            />
          </ElFormItem>
        </div>
      </ElFormItem>

      <ElFormItem label="颜色">
        <div class="color-picker">
          <div
            v-for="color in store.eventColors"
            :key="color.value"
            class="color-option"
            :class="{ active: formData.color === color.value }"
            :style="{ backgroundColor: color.value }"
            :title="color.name"
            @click="!isReadOnly && (formData.color = color.value)"
          />
        </div>
      </ElFormItem>

      <ElFormItem label="描述">
        <ElInput
          v-model="formData.description"
          type="textarea"
          :rows="3"
          placeholder="请输入事件描述"
          :readonly="isReadOnly"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div v-if="store.dialogMode === 'view'" style="display: flex; gap: 12px;">
          <ElTooltip content="编辑">
            <ElButton type="primary" :icon="Edit" @click="handleEdit" />
          </ElTooltip>
          <ElTooltip content="删除">
            <ElButton type="danger" :icon="Delete" @click="handleDelete" />
          </ElTooltip>
        </div>
        <div v-else>
          <ElButton @click="store.closeDialog">取消</ElButton>
          <ElButton type="primary" :icon="Check" @click="handleSubmit">
            {{ store.dialogMode === 'add' ? '新增' : '保存' }}
          </ElButton>
        </div>
        <div v-if="store.dialogMode === 'view'">
          <ElButton :icon="Close" @click="store.closeDialog">关闭</ElButton>
        </div>
      </div>
    </template>
  </ElDialog>
</template>
