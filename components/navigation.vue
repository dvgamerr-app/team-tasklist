<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-dark static-top">
    <div class="container">
      <nuxt-link class="navbar-brand" to="/">SURVEY</nuxt-link>
      <button 
        class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" 
        aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon" />
      </button>
      <div id="navbarResponsive" class="collapse navbar-collapse">
        <ul class="navbar-nav ml-auto">
          <li class="nav-item active">
            <nuxt-link class="nav-link" to="/">Home</nuxt-link>
          </li>
          <!-- <li class="nav-item">
            <a class="nav-link">About</a>
          </li>
          <li class="nav-item">
            <a class="nav-link">Services</a>
          </li>
          <li class="nav-item">
            <a class="nav-link">Contact</a>
          </li> -->
        </ul>
      </div>
    </div>
  </nav>
</template>

<style>

</style>
