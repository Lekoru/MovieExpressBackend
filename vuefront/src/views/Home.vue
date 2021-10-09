<template>
  <v-container fluid class="cont">
    <v-row>
      <v-col class="content">
        <div><v-btn @click="getMovies()">Load movie</v-btn></div>
      </v-col>
    </v-row>
    <v-row class="datatable">
      <v-col>
        <v-alert v-if="genres == '' && duration == ''" type="info">
        Random movie selected, because no filter was specified.
      </v-alert>
        <v-data-table
        :headers="headers"
        :items="movies"
        :page.sync="page"
        :items-per-page="itemsPerPage"
        hide-default-footer
        class="elevation-1"
        @page-count="pageCount = $event">
        </v-data-table>
        <div class="text-center pt-2">
          <v-pagination
          v-model="page"
          :length="pageCount"
        ></v-pagination>
        </div>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Home",
  data: () => {
    return {
      genres: '',
      duration: '',
      movies: [],
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      headers: [
        {
          text: 'Movies',
          align: 'start',
          sortable: false,
          value: 'title',
        },
        { text: 'Year', value: 'year' },
        { text: 'Runtime', value: 'runtime' },
        { text: 'Genres', value: 'genres' },
        { text: 'Director', value: 'director' },
      ],
    };
  },
  methods: {
    getMovies() {
      axios
        .post("http://localhost:5000/findMovie", {
          "duration": this.duration,
          "genres": this.genres,
        })
        .then((response) => {
          if([response.data].length > 1)
          this.movies = response.data;
          else{
            this.movies = [response.data];
          }
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  },
  beforeMount() {
    this.getMovies()
  },
}
</script>

<style scoped>
.content,
.datatable {
  padding-left: 3%;
  padding-right: 3%;
}
</style>
