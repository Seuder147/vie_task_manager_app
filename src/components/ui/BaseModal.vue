<script setup lang="ts">
import { X } from 'lucide-vue-next';
import { onMounted, onUnmounted } from 'vue';

defineProps<{
  title: string;
  isOpen: boolean;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

// Simple escape key handler
const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === 'Escape') emit('close');
};

onMounted(() => document.addEventListener('keydown', handleKeydown));
onUnmounted(() => document.removeEventListener('keydown', handleKeydown));
</script>

<template>
  <Teleport to="body">
    <Transition name="modal">
      <div v-if="isOpen" class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
          <header class="modal-header">
            <h3>{{ title }}</h3>
            <button class="close-btn" @click="$emit('close')">
              <X :size="20" />
            </button>
          </header>
          
          <div class="modal-body">
            <slot></slot>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  width: 100%;
  max-width: 500px;
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
  margin: 1rem;
}

.modal-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid var(--color-border);
}

.modal-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  color: var(--color-text-mute);
  padding: 4px;
  border-radius: var(--radius-sm);
  transition: var(--transition);
}

.close-btn:hover {
  background: var(--color-bg-mute);
  color: var(--color-text-main);
}

.modal-body {
  padding: 1.5rem;
}

/* Transitions */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content,
.modal-leave-active .modal-content {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-content,
.modal-leave-to .modal-content {
  transform: scale(0.95) translateY(10px);
}

@media (max-width: 768px) {
  .modal-content {
    margin: 0;
    width: 100%;
    max-width: 100%;
    height: auto;
    max-height: 90vh; /* Don't cover entire screen, leave a bit at top or manage overflow */
    border-radius: var(--radius-lg) var(--radius-lg) 0 0;
    position: absolute;
    bottom: 0;
  }
  
  .modal-overlay {
    align-items: flex-end; /* Align to bottom */
  }

  .modal-enter-from .modal-content,
  .modal-leave-to .modal-content {
    transform: translateY(100%);
  }
}
</style>
