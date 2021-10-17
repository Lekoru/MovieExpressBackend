<template>
  <v-container fluid class="cont">
    <v-row align="center" class="filters content">
      <v-col md="8">
        <v-row justify="start">
          <v-col
            class="filtercol"
            md="2"
            v-for="n of $store.state.fixgen.length"
            :key="n"
          >
            <v-checkbox
              v-model="genres"
              :label="$store.state.fixgen[n - 1]"
              :value="$store.state.fixgen[n - 1]"
            >
            </v-checkbox>
          </v-col>
        </v-row>
      </v-col>
      <v-col>
        <v-text-field v-model="duration" type="number" label="Duration (min)" />
      </v-col>
      <v-col md="1">
        <div>
          <v-btn
            rounded
            @click="
              SET_MOVIES({
                duration: duration,
                genres: genres,
              })
            "
          >
            Load movie
          </v-btn>
        </div>
      </v-col>
    </v-row>
    <v-row class="datatable">
      <v-col>
        <v-alert v-if="noFilters" type="info">
          A random movie was selected because no filter was specified.
        </v-alert>
        <v-alert
          v-if="$store.state.movies.length < 1 && !$store.state.isLoading"
          type="info"
        >
          <span> No movie found </span>
        </v-alert>
        <v-alert v-if="$store.state.loadMovieError" type="info">
          <span>
            {{ $store.state.loadMovieErrorMsg }}
          </span>
        </v-alert>

        <v-data-table
          :headers="headers"
          :items="$store.state.movies"
          :page.sync="page"
          :loading="$store.state.isLoading"
          loading-text="Loading... Please wait"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1 movies"
          @page-count="pageCount = $event"
          @click:row="movieDet"
        >
        </v-data-table>
        <div v-if="$store.state.movies.length > 1" class="text-center pt-2">
          <v-pagination v-model="page" :length="pageCount"> </v-pagination>
        </div>
        <v-dialog v-model="movieDetail">
          <v-card>
            <v-card-title class="text-5h movieDetail lighten-2">
              Movie details
            </v-card-title>
            <v-card-text>
              <v-row v-if="imgFailed == true">
                <v-col></v-col>
              </v-row>
              <v-row>
                <v-col>
                  <v-alert v-if="imgFailed == true" type="info">
                    A problem occurred while trying to load an image
                  </v-alert>
                </v-col>
              </v-row>
              <v-row justify="center">
                <v-col md="4" class="details" align="center">
                  <v-img
                    max-height="400"
                    max-width="300"
                    :src="movieData.posterUrl"
                    @error="(imgErr = $event), (imgFailed = true)"
                  ></v-img>
                </v-col>
                <v-col>
                  <v-row>
                    <v-col class="details" align="start">
                      <h1>{{ movieData.title }}</h1>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="detailsYear" align="start">
                      <h3>{{ movieData.year }}</h3>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Runtime:</h3>
                    </v-col>
                    <v-col class="details" align="start">
                      {{ movieData.runtime }} min
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Genres:</h3>
                    </v-col>
                    <v-col align="start">
                      <span v-for="gen in movieData.genres" :key="gen.genres">
                        {{ gen }}
                      </span>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Director:</h3></v-col
                    >
                    <v-col align="start">{{ movieData.director }}</v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Actors:</h3></v-col
                    >
                    <v-col align="start">{{ movieData.actors }}</v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Plot:</h3></v-col
                    >
                    <v-col align="start">{{ movieData.plot }}</v-col>
                  </v-row>
                  <v-row>
                    <v-col></v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col class="details" align="end">
                      <v-btn
                        rounded
                        @click="(movieData = {}), (movieDetail = false)"
                      >
                        Close
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row justify="center">
      <v-col align="end" class="addMovieCol">
        <v-btn rounded @click="setMovieBtn(true)">Add Movie</v-btn>
        <v-dialog
          v-model="$store.state.addMovieBtn"
          persistent
          max-width="1000"
        >
          <v-card>
            <v-card-title class="text-5h movieDetail lighten-2">
              Add Movie
            </v-card-title>
            <v-card-text>
              <addMovie></addMovie>
            </v-card-text>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import addMovie from "./AddMovie.vue";
import { mapActions } from "vuex";

export default {
  name: "Home",
  data: () => {
    return {
      headers: [
        {
          text: "Movies",
          align: "start",
          sortable: false,
          value: "title",
        },
        { text: "Year", value: "year" },
        { text: "Runtime", value: "runtime" },
        { text: "Genres", value: "genres" },
        { text: "Director", value: "director" },
      ],
      genres: [],
      duration: "",
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      noMovieFound: false,
      imgErr: {},
      imgFailed: false,
      movieData: {},
      movieDetail: false,
      noFilters: false,
    };
  },
  components: {
    addMovie,
  },
  computed: {
    getMovies() {
      return this.$store.state.movies;
    },
  },
  watch: {
    getMovies(value) {
      if (value.length >= 1) {
        this.noFilters = false;
        if (this.genres.length === 0) {
          this.noFilters = true;
        }
      }
    },
  },
  methods: {
    ...mapActions(["setMovieBtn", "SET_MOVIES", "SET_GENRES"]),
    movieDet(item) {
      if (this.movieData != item) {
        this.imgErr = {};
        this.imgFailed = false;
      }
      this.movieData = {};
      this.movieData = item;
      this.movieDetail = true;
    },
  },
  created() {
    this.SET_GENRES();
    this.SET_MOVIES({ duration: "", genres: [] });
  },
};
</script>

<style scoped>
.content,
.datatable,
.addMovieCol {
  padding-left: 3%;
  padding-right: 3%;
}
.v-input {
  display: inline;
}
.filters {
  margin-left: inherit;
}
.movies {
  cursor: pointer;
}
.movieDetail {
  background-color: #bbdefb;
}
.filtercol {
  padding: 0;
}
</style>
