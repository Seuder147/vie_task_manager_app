<script setup lang="ts">
import { useForm, useField } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import * as z from 'zod';
import { useTaskStore } from '@/stores/taskStore';
import { storeToRefs } from 'pinia';
import type { Task } from '@/types';

const props = defineProps<{
  initialData?: Task;
}>();

const emit = defineEmits<{
  (e: 'submit', values: any): void;
  (e: 'cancel'): void;
}>();


const store = useTaskStore();

// Validation Schema
const schema = toTypedSchema(z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(1, 'Description is required'),
  priority: z.enum(['low', 'medium', 'high']),
  status: z.enum(['todo', 'in-progress', 'done']) // Added status for editing scenario
}));

// Form Setup
const { handleSubmit, errors, isSubmitting } = useForm({
  validationSchema: schema,
  initialValues: {
    title: props.initialData?.title || '',
    description: props.initialData?.description || '',
    priority: props.initialData?.priority || 'medium',
    status: props.initialData?.status || 'todo'
  }
});

// Field bindings
const { value: title } = useField<string>('title');
const { value: description } = useField<string>('description');
const { value: priority } = useField<string>('priority');


const handleFormSubmit = handleSubmit((values) => {
  emit('submit', values);
});
</script>

<template>
  <form @submit="handleFormSubmit" class="task-form">
    <!-- Title -->
    <div class="form-group">
      <label for="title">Title</label>
      <input 
        id="title" 
        v-model="title" 
        type="text" 
        placeholder="e.g. Redesign Homepage"
        :class="{ 'has-error': errors.title }"
      />
      <span v-if="errors.title" class="error-msg">{{ errors.title }}</span>
    </div>

    <!-- Description -->
    <div class="form-group">
      <label for="desc">Description</label>
      <textarea 
        id="desc" 
        v-model="description" 
        rows="3" 
        placeholder="Add details..."
        :class="{ 'has-error': errors.description }"
      ></textarea>
      <span v-if="errors.description" class="error-msg">{{ errors.description }}</span>
    </div>



    <div class="row">
      

      <!-- Priority -->
      <div class="form-group">
        <label>Priority</label>
        <div class="priority-options">
          <label 
            v-for="p in ['low', 'medium', 'high']" 
            :key="p" 
            class="radio-label"
            :class="{ active: priority === p, [p]: true }"
          >
            <input type="radio" v-model="priority" :value="p" class="sr-only" />
            {{ p }}
          </label>
        </div>
      </div>
    </div>
  

    <!-- Actions -->
    <div class="form-actions">
      <button type="button" class="btn-secondary" @click="$emit('cancel')">Cancel</button>
      <button type="submit" class="btn-primary" :disabled="isSubmitting">
        {{ initialData ? 'Save Changes' : 'Create Task' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
}

.row {
  display: flex;
  gap: 1rem;
}

@media (max-width: 600px) {
  .row {
    flex-direction: column;
    gap: 1.25rem;
  }
}

label {
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-soft);
}

input[type="text"],
textarea,
select {
  padding: 10px 12px;
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-main);
  transition: var(--transition);
  width: 100%;
}

input[type="text"]:focus,
textarea:focus,
select:focus {
  border-color: var(--color-primary);
  outline: none;
}

.has-error {
  border-color: var(--color-danger) !important;
}

.error-msg {
  font-size: 0.75rem;
  color: var(--color-danger);
}

.priority-options {
  display: flex;
  gap: 8px;
  background: var(--color-bg-soft);
  padding: 4px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-border);
}

.radio-label {
  flex: 1;
  text-align: center;
  font-size: 0.8rem;
  padding: 6px;
  border-radius: 4px;
  cursor: pointer;
  text-transform: capitalize;
  transition: var(--transition);
  color: var(--color-text-soft);
}

.radio-label:hover {
  background: rgba(255, 255, 255, 0.05);
}

.radio-label.active {
  color: white;
  font-weight: 600;
}

.radio-label.active.low { background: var(--color-success); }
.radio-label.active.medium { background: var(--color-warning); }
.radio-label.active.high { background: var(--color-danger); }

.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 0.5rem;
}

.btn-secondary {
  padding: 8px 16px;
  color: var(--color-text-soft);
  font-weight: 500;
}

.btn-secondary:hover {
  color: var(--color-text-main);
}

.btn-primary {
  background: var(--color-primary);
  color: white;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-weight: 600;
  transition: var(--transition);
}

.btn-primary:hover {
  background: var(--color-primary-hover);
}

.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
