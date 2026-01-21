<script setup lang="ts">
import { LayoutDashboard, LogOut } from 'lucide-vue-next';
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="brand-icon">
        <LayoutDashboard class="text-white" :size="24" />
      </div>
      <span class="brand-text">Your Task Manager</span>
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
  padding: 1.5rem;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50;
  transition: var(--transition);
}

.brand {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 2.5rem;
  padding: 0 0.5rem;
}

.brand-icon {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, var(--color-primary), var(--color-accent));
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(99, 102, 241, 0.3);
}

.brand-text {
  font-size: 1rem;
  font-weight: 700;
  letter-spacing: -0.5px;
  background: linear-gradient(to right, white, #94a3b8);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
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
  color: var(--color-text-soft);
  font-weight: 500;
  transition: var(--transition);
}

.nav-item:hover {
  background: rgba(255, 255, 255, 0.05);
  color: var(--color-text-main);
  transform: translateX(4px);
}

.nav-item.active {
  background: linear-gradient(to right, rgba(99, 102, 241, 0.2), transparent);
  color: var(--color-primary);
  border-left: 3px solid var(--color-primary);
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
    width: 100%;
    height: auto;
    bottom: 0;
    top: auto;
    left: 0;
    flex-direction: row;
    border-right: none;
    border-top: 1px solid var(--color-border);
    padding: 0.5rem;
    justify-content: center;
    background: var(--color-bg-soft);
  }
  
  .brand, .bottom-menu {
    display: none;
  }
  
  .nav-menu {
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
    margin: 0;
  }
  
  .nav-item {
    justify-content: center;
    padding: 10px;
    border-radius: 50%;
  }

  .nav-item span {
    display: none;
  }
  
  .nav-item.active {
    border-left: none;
    background: rgba(99, 102, 241, 0.2);
    color: var(--color-primary);
  }
  
  .nav-item:hover {
    transform: none;
    background: rgba(255, 255, 255, 0.05);
  }
}
</style>
