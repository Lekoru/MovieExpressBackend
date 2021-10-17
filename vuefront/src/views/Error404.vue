<template>
  <v-container fluid class="cont">
    <v-row>
      <v-col class="content">
        <div>
          <h1>Error404!</h1>
          <h2>
            <p>
              The website you are looking for does not exist. Try going
              <router-link :to="{ name: 'Home' }">home</router-link>
            </p>
          </h2>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<style scoped>
.content {
  padding-left: 3%;
  padding-right: 3%;
}
</style>
