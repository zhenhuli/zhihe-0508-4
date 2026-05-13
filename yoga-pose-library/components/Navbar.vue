<template>
  <nav class="bg-white shadow-lg sticky top-0 z-50">
    <div class="max-w-6xl mx-auto px-4">
      <div class="flex justify-between items-center h-16">
        <NuxtLink to="/" class="flex items-center space-x-2">
          <span class="text-2xl">🧘</span>
          <span class="text-xl font-bold text-yoga-purple">瑜伽体式库</span>
        </NuxtLink>
        <div class="flex space-x-6">
          <NuxtLink to="/" class="text-gray-600 hover:text-yoga-purple transition-colors font-medium">
            体式列表
          </NuxtLink>
          <NuxtLink to="/records" class="text-gray-600 hover:text-yoga-purple transition-colors font-medium">
            训练记录
          </NuxtLink>
        </div>
      </div>
    </div>
  </nav>
</template>
