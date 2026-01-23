<script setup lang="ts">
import { LayoutDashboard, LogOut, X } from 'lucide-vue-next';
import { useUIStore } from '@/stores/ui';

const uiStore = useUIStore();
</script>

<template>
  <div v-if="uiStore.isSidebarOpen" class="sidebar-overlay" @click="uiStore.closeSidebar"></div>
  <aside class="sidebar" :class="{ 'mobile-open': uiStore.isSidebarOpen }">
    <div class="brand">
      <img src="@/assets/logo.png" alt="Logo" />
      <span class="brand-text">Your Favourite Task Manager</span>
      <button class="close-btn mobile-only" @click="uiStore.closeSidebar">
        <X :size="20" />
      </button>
    </div>

    <nav class="nav-menu">
      <a href="#" class="nav-item active">
        <LayoutDashboard :size="20" />
        <span>Dashboard</span>
      </a>
    </nav>
    <div class="bottom-menu">

      <div class="user-profile">
        <div class="avatar">JD</div>
        <div class="user-details">
          <span class="name">John Doe</span>
          <span class="email">john@example.com</span>
        </div>
        <button class="logout-btn">
          <LogOut :size="16" />
        </button>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 260px;
  height: 100vh;
  background: var(--color-bg-soft);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  padding: 0.1rem 1.5rem 1.5rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  transition: var(--transition);
}

.brand {
  display: flex;
  flex-direction: column;
  align-items: center; 
  gap: 1px;
  margin-bottom: 2.5rem;
  padding: 0 0.5rem;
}


.brand img {
  width: 100%;
  height: 100%;
  object-fit: cover; 
}

.brand-text {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  color: rgba(31, 192, 16, 0.584);
  text-align: center;
}

.nav-menu {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-md);
  color: rgba(36, 221, 19, 0.833);
  font-weight: 500;
  transition: var(--transition);
}

.nav-item:hover {
  background: rgba(116, 232, 6, 0.05);
  color: rgba(36, 221, 19, 0.833);
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(to left, rgba(99, 102, 241, 0.2), transparent);
  color: rgba(36, 221, 19, 0.833);
  border-left: 3px solid rgba(36, 221, 19, 0.833);
}

.bottom-menu {
  margin-top: auto;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: var(--color-bg);
  border-radius: var(--radius-md);
  margin-top: 0.5rem;
  border: 1px solid var(--color-border);
}

.avatar {
  width: 36px;
  height: 36px;
  background: var(--color-bg-mute);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.user-details {
  flex: 1;
  overflow: hidden;
}

.name {
  display: block;
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-main);
}

.email {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-mute);
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
}

.logout-btn {
  color: var(--color-text-mute);
  padding: 4px;
  transition: var(--transition);
}

.logout-btn:hover {
  color: var(--color-danger);
}

@media (max-width: 768px) {
  .sidebar {
    width: 280px;
    height: 100vh;
    transform: translateX(-100%);
    top: 0;
    left: 0;
    bottom: auto;
    flex-direction: column;
    border-right: 1px solid var(--color-border);
    border-top: none;
    padding: 1rem;
    justify-content: flex-start;
    z-index: 100;
  }
  
  .sidebar.mobile-open {
    transform: translateX(0);
  }
  
  .brand, .bottom-menu {
    display: flex; 
  }

  .brand {
    position: relative;
    padding-right: 20px;
  }

  .nav-menu {
    flex-direction: column;
    justify-content: flex-start;
    width: 100%;
    margin: 0;
  }
  
  .nav-item {
    justify-content: flex-start;
    padding: 12px 16px;
    border-radius: var(--radius-md);
  }

  .nav-item span {
    display: inline;
  }
  
  .nav-item.active {
    border-left: 3px solid rgba(36, 221, 19, 0.833);
    background: linear-gradient(to left, rgba(99, 102, 241, 0.2), transparent);
  }
  
  .mobile-only {
    display: block;
  }
}

.mobile-only {
  display: none;
}

.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  color: var(--color-text-mute);
  padding: 4px;
}

.sidebar-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  z-index: 90;
  backdrop-filter: blur(2px);
}
</style>
