<script setup lang="ts">
import { ref, watch, onUnmounted } from 'vue';
import { Clock, MoreHorizontal, Trash2, Pencil } from 'lucide-vue-next';
import type { Task, TaskStatus } from '@/types';
import { useTaskStore } from '@/stores/taskStore';
import BaseModal from '@/components/ui/BaseModal.vue';

const props = defineProps<{ task: Task }>();

const store = useTaskStore();
const showMenu = ref(false);

// Window click handler to close menu
const handleWindowClick = () => {
  if (showMenu.value) {
    showMenu.value = false;
  }
};

// Add/remove listener based on menu state to optimize
watch(showMenu, (isOpen) => {
  if (isOpen) {
    // Timeout ensures the current click doesn't trigger this immediately
    setTimeout(() => {
      window.addEventListener('click', handleWindowClick);
    }, 0);
  } else {
    window.removeEventListener('click', handleWindowClick);
  }
});

onUnmounted(() => {
  window.removeEventListener('click', handleWindowClick);
});

// edit modal state
const showEdit = ref(false);

// edit form fields (typed)
const editTitle = ref('');
const editDescription = ref('');
const editStatus = ref<TaskStatus>('todo');
const editPriority = ref<Task['priority']>('low');

const toggleMenu = (e: Event) => {
  e.stopPropagation(); // prevent modal opening if card click logic exists
  showMenu.value = !showMenu.value;
};

const moveTask = (id: string, status: TaskStatus) => {
  store.updateTaskStatus(id, status);
  showMenu.value = false;
};

const removeTask = (id: string) => {
  if (confirm('Are you sure you want to delete this task?')) {
    store.deleteTask(id);
  }
};

// open edit modal
const openEdit = (e: Event) => {
  e.stopPropagation();
  showMenu.value = false;
  showEdit.value = true;
};

// when modal opens - fill fields from task
watch(
  () => showEdit.value,
  (isOpen) => {
    if (!isOpen) return;

    editTitle.value = props.task.title;
    editDescription.value = props.task.description ?? '';
    editStatus.value = props.task.status;
    editPriority.value = props.task.priority;
  }
);

const closeEdit = () => {
  showEdit.value = false;
};

const saveEdit = () => {
  const title = editTitle.value.trim();

  if (title.length < 3) {
    alert('Title must be at least 3 characters');
    return;
  }

  // call store update
  store.updateTask(props.task.id, {
    title,
    description: editDescription.value.trim(),
    status: editStatus.value,
    priority: editPriority.value,
  });

  closeEdit();
};
</script>

<template>
  <div class="task-card">
    <div class="card-header">
      <div class="priority-tag" :class="task.priority">
        {{ task.priority }}
      </div>
      <div class="menu-container">
        <button class="more-btn" @click="toggleMenu">
          <MoreHorizontal :size="16" />
        </button>
        
        <div v-if="showMenu" class="dropdown-menu">
          <div class="menu-label">Move to</div>
          <button v-if="task.status !== 'todo'" @click.stop="moveTask(task.id, 'todo')">
            To Do
          </button>
          <button v-if="task.status !== 'in-progress'" @click.stop="moveTask(task.id, 'in-progress')">
            In Progress
          </button>
          <button v-if="task.status !== 'done'" @click.stop="moveTask(task.id, 'done')">
            Done
          </button>
          <div class="divider"></div>

          <!--Edit button-->
          <button class="edit-btn" @click.stop="openEdit"> 
            <Pencil :size="14" />
            Edit
          </button>

          <button class="delete-btn" @click.stop="removeTask(task.id)">
            <Trash2 :size="14" />
            Delete
          </button>
        </div>
        
      </div>
    </div>
    
    <h3 class="task-title">{{ task.title }}</h3>
    <p class="task-desc">{{ task.description }}</p>
    
    <div class="card-footer">
      <div class="meta-item">
        <Clock :size="14" />
        <span>{{ new Date(task.createdAt).toLocaleDateString() }}</span>
      </div>
      
      <div class="avatars">
        <div class="mini-avatar">JD</div>
      </div>
    </div>

    <!-- Edit Modal -->
    <BaseModal 
      :is-open="showEdit" 
      title="Edit task"
      @close="closeEdit"
    >
      <div class="edit-form">
        <label class="field">
          <span>Title</span>
          <input v-model="editTitle" type="text" />
        </label>

        <label class="field">
          <span>Description</span>
          <textarea v-model="editDescription" rows="4"></textarea>
        </label>

        <div class="row">
          <label class="field">
            <span>Status</span>
            <select v-model="editStatus">
              <option value="todo">To Do</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
          </label>

          <label class="field">
            <span>Priority</span>
            <select v-model="editPriority">
              <option value="low">low</option>
              <option value="medium">medium</option>
              <option value="high">high</option>
            </select>
          </label>
        </div>

        <div class="modal-footer">
          <button class="btn-secondary" type="button" @click="closeEdit">Cancel</button>
          <button class="btn-primary" type="button" @click="saveEdit">Save</button>
        </div>
      </div>
    </BaseModal>
  </div>
</template>

<style scoped>
.task-card {
  background: var(--color-bg-soft);
  padding: 1rem;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  transition: var(--transition);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  position: relative; /* Context for dropdown? No, local */
}

/* ... existing styles ... */

.task-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.priority-tag {
  font-size: 0.75rem;
  padding: 4px 8px;
  border-radius: var(--radius-sm);
  font-weight: 600;
  text-transform: capitalize;
}

.priority-tag.high {
  background: rgba(239, 68, 68, 0.1);
  color: var(--color-danger);
}

.priority-tag.medium {
  background: rgba(245, 158, 11, 0.1);
  color: var(--color-warning);
}

.priority-tag.low {
  background: rgba(16, 185, 129, 0.1);
  color: var(--color-success);
}

.more-btn {
  color: var(--color-text-mute);
  opacity: 0; /* Keep hover effect on desktop */
  transition: var(--transition);
  padding: 4px;
  border-radius: 4px;
  position: relative;
  z-index: 20;
}

.more-btn:hover {
  background: var(--color-bg-mute);
  color: var(--color-text-main);
}

.task-card:hover .more-btn {
  opacity: 1;
}

/* On mobile, always show more button or at least make it accessible */
@media (max-width: 768px) {
  .more-btn {
    opacity: 1; 
  }
}

.task-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.task-desc {
  font-size: 0.875rem;
  color: var(--color-text-soft);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  padding-top: 0.75rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--color-text-mute);
}

.mini-avatar {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--color-primary);
  font-size: 0.6rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid var(--color-bg-soft);
}

/* Dropdown Menu */
.menu-container {
  position: relative;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  width: 140px;
  padding: 4px;
  z-index: 30;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.menu-label {
  font-size: 0.7rem;
  color: var(--color-text-mute);
  padding: 4px 8px;
  text-transform: uppercase;
  font-weight: 600;
}

.dropdown-menu button {
  text-align: left;
  padding: 6px 8px;
  font-size: 0.8rem;
  color: var(--color-text-soft);
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.dropdown-menu button:hover {
  background: var(--color-bg-soft);
  color: var(--color-text-main);
}

.divider {
  height: 1px;
  background: var(--color-border);
  margin: 2px 0;
}

.delete-btn {
  color: var(--color-danger) !important;
  display: flex;
  align-items: center;
  gap: 6px;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.1) !important;
}



/* Edit button in menu */
.edit-btn {
  display: flex;
  align-items: center;
  gap: 6px;
}

/* Modal */
/* Edit Form */
.edit-form {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.field span {
  font-size: 0.8rem;
  color: var(--color-text-mute);
}

.field input,
.field textarea,
.field select {
  background: var(--color-bg-soft);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  padding: 8px 10px;
  color: var(--color-text-main);
}

.row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
}

@media (max-width: 520px) {
  .row {
    grid-template-columns: 1fr;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 12px;
}

.btn-secondary {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--color-bg-soft);
  color: var(--color-text-main);
  border: 1px solid var(--color-border);
}

.btn-secondary:hover {
  background: var(--color-bg-mute);
}

.btn-primary {
  padding: 8px 12px;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: white;
}

.btn-primary:hover {
  filter: brightness(1.05);
}
</style>
