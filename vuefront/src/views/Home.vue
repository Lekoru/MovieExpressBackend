<template>
  <v-container fluid class="cont">
    <v-row align="center" class="filters content"><!-- Filters -->
      <div v-for="n of 7" :key="n">
          <v-col>
            <div v-for="i of 3" :n="n" :key="i">
              <v-checkbox 
                v-model="genres"
                :label="fixgen[(i+(n-1)*3)-1].name"
                :value="fixgen[(i+(n-1)*3)-1].name">
              </v-checkbox>
            </div>
          </v-col>
      </div>
      <v-col>
        <v-text-field
          v-model="duration"
          type="number"
          label="Duration"
        />
      </v-col>
      <v-col md="1">
        <div><v-btn @click="getMovies()">Load movie</v-btn></div>
      </v-col>
    </v-row>
    <v-row class="datatable"> <!-- Movies Table -->
      <v-col>
        <v-alert v-if="genres.length < 1 && duration == ''" type="info">
         A random movie was selected because no filter was specified.
        </v-alert>
        <v-data-table
          :headers="headers"
          :items="movies"
          :page.sync="page"
          :items-per-page="itemsPerPage"
          hide-default-footer
          class="elevation-1 movies"
          @page-count="pageCount = $event"
          @click:row="movieDet"
          >
        </v-data-table>
        <div v-if="movies.length > 1" class="text-center pt-2">
          <v-pagination
          v-model="page"
          :length="pageCount">
          </v-pagination>
        </div>
        <v-dialog v-model="movieDetail" max-width="900">
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
                  <v-img max-height="400" max-width="300" :src="this.movieData.posterUrl" @error="onImgError"></v-img>
                </v-col>
                <v-col>
                  <v-row>
                    <v-col class="details" align="start">
                      <h1>{{movieData.title}}</h1>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="detailsYear" align="start">
                      <h3>{{movieData.year}}</h3>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2"><h3>Runtime:</h3></v-col>
                      <v-col class="details" align="start">{{movieData.runtime}} min </v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Genres: </h3></v-col>
                      <v-col align="start"> <span v-for="gen in movieData.genres" :key="gen.genres">{{gen}} </span></v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Director: </h3></v-col>
                      <v-col align="start">{{movieData.director}}</v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Actors: </h3></v-col>
                      <v-col align="start">{{movieData.actors}}</v-col>
                  </v-row>
                  <v-row>
                    <v-col class="details" align="start" md="2">
                      <h3>Plot: </h3></v-col>
                      <v-col align="start">{{movieData.plot}}</v-col>
                  </v-row>
                  <v-row>
                    <v-col></v-col>
                  </v-row>
                  <v-row justify="center">
                    <v-col class="details" align="end">
                      <v-btn rounded @click="movieDetail = false"> Close</v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
              </v-card-text>
            </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-row><v-col></v-col></v-row>
    <v-form v-model="valid">
      <v-row class="addMovieFields">
        <v-col>
          <h1 class="text-5h lighten-2">Add Movie</h1>
        </v-col>
      </v-row>
      <v-row class="addMovieFields" v-if="addMovieFail == true">
        <v-col>
          <v-alert type="error">
            {{addMovieFailMsg}}
          </v-alert>
        </v-col>
      </v-row>
      <v-row class="addMovieFields">
        <v-col>
          <v-text-field 
            v-model="title"
            :rules="titleRules"
            :counter="255"
            label="Title"
            type="String"
            required>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="addMovieFields">
        <v-col>
          <v-text-field 
            v-model="year"
            :rules="yearRules"
            label="Year"
            type="number"
            required>
          </v-text-field>
        </v-col>
        <v-col>
          <v-text-field 
            v-model="runtime"
            :rules="runtimeRules"
            type="number"
            label="Runtime"
            required>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="addMovieFields">
        <v-col>
          <v-text-field 
            v-model="director"
            :rules="directorRules"
            :counter="255"
            label="Director"
            required>
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="addMovieFields">
        <v-col>
          <v-select
            :items="fixgen"
            item-text="name"
            :rules="genRules"
            v-model="addMovieGen"
            label="Genres"
            multiple
            chips>
          </v-select>
        </v-col>
      </v-row>
      <v-row class="addMovieFields">
        <v-col>
          <v-text-field 
            v-model="actors"
            label="Actors">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="addMovieFields">
        <v-col>
          <v-text-field 
            v-model="plot"
            label="Plot">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row class="addMovieFields">
        <v-col>
          <v-text-field 
            v-model="posterUrl"
            label="Poster Url">
          </v-text-field>
        </v-col>
      </v-row>
      <v-row justify="center" class="addMovieFields">
        <v-col class="details" align="end">
          <v-btn rounded @click="addMovie">Add</v-btn>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script>
import axios from "axios";
export default {
  name: "Home",
  data: () => {
    return {
      // Add movie form data
      valid: false,
      title: "",
      titleRules: [
        v => !!v || 'Title is required',
        v => v.length <= 255 || 'Title can be up to 255 characters long'
      ],
      year: null,
      yearRules: [
        v => !!v || 'Year is required',
        v => typeof(v) != 'number' || 'Year have to be a number',
        v => v > 1985  || 'There were no movies before 1985 year',
      ],
      runtime: null,
      runtimeRules: [
        v => !!v || 'Runtime is required',
        v => typeof(v) != 'number' || 'Runtime have to be a number',
        v => v > 0  || 'Runtime can\'t be that short',
      ],
      addMovieGen: [],
      genRules: [
        v => v.length > 1 || 'Genres are required'
      ],
      director: "",
      directorRules: [
        v => !!v || 'Director is required',
        v => v.length <= 255 || 'Director can be up to 255 characters long'
      ],
      actors: "",
      plot: "",
      posterUrl: "",
      addMovieFail: false,
      addMovieFailMsg: "",
      // Movie details data
      movieDetail: false,
      imgErr: {},
      imgFailed: false,
      movieData: {},
      // Movie filters data
      genres: [],
      duration: '',
      // Movie table data
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
      fixgen:[
        { name: "Comedy" },
        { name: "Fantasy" },
        { name: "Crime" },
        { name: "Drama" },
        { name: "Music" },
        { name: "Adventure" },
        { name: "History" },
        { name: "Thriller" },
        { name: "Animation" },
        { name: "Family" },
        { name: "Mystery" },
        { name: "Biography" },
        { name: "Action" },
        { name: "Film-Noir" },
        { name: "Romance" },
        { name: "Sci-Fi" },
        { name: "War" },
        { name: "Western" },
        { name: "Horror" },
        { name: "Musical" },
        { name: "Sport" },
      ],
    };
  },
  methods: {
    // Open movie details
    movieDet(item){
        if(this.movieData != item){
      this.imgErr = {};
      this.imgFailed = false; 
      }
      this.movieData = {}
      this.movieData = item
      this.movieDetail = true
     },
    // Load movie 
    getMovies() {
      axios
        .post("http://localhost:5000/findMovie", {
          "duration": this.duration,
          "genres": this.genres,
        })
        .then((response) => {
          if(response.data.length > 1)
          this.movies = response.data;
          else{
            this.movies = [response.data];
          }
        })
        .catch((error) => {
          console.log(error.response.data.error)
        });
    },
    // Add movie 
    addMovie() {
      this.addMovieFail = false
      this.addMovieFailMsg = '';
      axios
        .post("http://localhost:5000/addMovie", {
          "title": this.title,
          "genres": this.addMovieGen,
          "year": this.year,
          "runtime": this.runtime,
          "director": this.director,
          "actors": this.actors,
          "plot": this.plot,
          "posterUrl": this.posterUrl,
        })
        .catch((err) => {
          if (err.response) {
            this.addMovieFail = true
            this.addMovieFailMsg = err.response.data.error;
          }
        });
    },
    // Show image fail message
    onImgError(event) {
      this.imgErr = event;
      this.imgFailed = true;
    },
  },
  beforeMount() {
    this.getMovies()
  },
}

</script>

<style scoped>
.content,
.datatable,
.addMovieFields {
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
</style>
