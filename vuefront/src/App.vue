<template>
  <v-app>
    <v-container fluid class="cont">
      <v-row>
        <v-col class="colban">
          <div class="baner rounded-b-xl"><h1 class="text-h1">Movies</h1></div>
        </v-col>
      </v-row>
      <v-row>
        <v-col class="colmenu">
          <div class="menu">
            <span><router-link to="/">Home</router-link> |</span>
            <span><router-link to="/about"> About</router-link></span>
          </div>
        </v-col>
      </v-row>
    </v-container>
    <router-view />
  </v-app>
</template>

<script>
export default {
  name: "App",
};
</script>

<style scoped>
.cont {
  padding-left: 0;
  padding-right: 0;
}
.menu,
.baner {
  text-align: center;
}
.baner {
  background-color: #bbdefb;
  padding-bottom: 0px;
}
.menu {
  margin-bottom: 0%;
  padding-top: inherit/2;
  padding-bottom: inherit/2;
}
.colban {
  padding: 0;
}
.colmenu {
  border-bottom: 1px solid #ebebeb;
  margin-bottom: 2%;
}
.menu a {
  text-decoration-line: none;
  color: black;
}
.menu a:hover {
  color: #3d6cec;
}
.menu a.router-link-exact-active {
  color: #2ab750;
}
</style>
