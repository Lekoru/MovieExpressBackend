<template>
  <v-form ref="form" v-model="valid">
    <v-row><v-col></v-col></v-row>
    <v-row class="addMovieFields" v-if="$store.state.addMovieStatus == true">
      <v-col>
        <v-alert :type="$store.state.movieAlertType">
          {{ $store.state.addMovieMsg }}
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
          required
        >
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
          required
        >
        </v-text-field>
      </v-col>
      <v-col>
        <v-text-field
          v-model="runtime"
          :rules="runtimeRules"
          type="number"
          label="Runtime (min)"
          required
        >
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
          required
        >
        </v-text-field>
      </v-col>
    </v-row>
    <v-row class="addMovieFields">
      <v-col>
        <v-select
          :items="$store.state.fixgen"
          item-text="name"
          :rules="genRules"
          v-model="addMovieGen"
          label="Genres"
          multiple
          chips
        >
        </v-select>
      </v-col>
    </v-row>
    <v-row class="addMovieFields">
      <v-col>
        <v-text-field v-model="actors" label="Actors"> </v-text-field>
      </v-col>
    </v-row>
    <v-row class="addMovieFields">
      <v-col>
        <v-text-field v-model="plot" label="Plot"> </v-text-field>
      </v-col>
    </v-row>
    <v-row class="addMovieFields">
      <v-col>
        <v-text-field v-model="posterUrl" label="Poster Url"> </v-text-field>
      </v-col>
    </v-row>
    <v-row justify="center" class="addMovieFields">
      <v-col class="details" align="end" md="1">
        <v-btn rounded @click="addmovie()" color="success"> Add </v-btn>
      </v-col>
      <v-col class="details" align="end" md="1">
        <v-btn rounded @click="setMovieBtn(false)" color="error">Close</v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapActions } from "vuex";
export default {
  data: () => {
    return {
      addMovieForm: true,
      valid: true,
      title: "",
      titleRules: [
        (v) => !!v || "Title is required",
        (v) =>
          (!!v && v.length <= 255) || "Title can be up to 255 characters long",
      ],
      year: null,
      yearRules: [
        (v) => !!v || "Year is required",
        (v) => (!!v && typeof v != "number") || "Year have to be a number",
        (v) =>
          (!!v && v > 1895) ||
          "You can't add a movie from the year before 1895 because there were no movies then.",
      ],
      runtime: null,
      runtimeRules: [
        (v) => !!v || "Runtime is required",
        (v) => typeof v != "number" || "Runtime have to be a number",
        (v) => !!v > 0 || "Runtime can't be that short",
      ],
      addMovieGen: [],
      genRules: [(v) => v.length >= 1 || "Genres are required"],
      director: "",
      directorRules: [
        (v) => !!v || "Director is required",
        (v) =>
          (!!v && v.length <= 255) ||
          "Director can be up to 255 characters long",
      ],
      actors: "",
      plot: "",
      posterUrl: "",
    };
  },
  computed: {
    clean() {
      return this.$store.state.movieAlertType;
    },
  },
  watch: {
    clean(value) {
      if (value == "success") {
        this.$refs.form.reset();
      }
    },
  },
  methods: {
    ...mapActions(["setMovieBtn", "SET_MOVIES", "SET_GENRES", "ADD_MOVIE"]),
    addmovie() {
      if (
        this.title != "" &&
        this.addMovieGen != "" &&
        this.year != "" &&
        this.runtime != "" &&
        this.director != ""
      ) {
        this.ADD_MOVIE({
          title: this.title,
          addMovieGen: this.addMovieGen,
          year: this.year,
          runtime: this.runtime,
          director: this.director,
          actors: this.actors,
          plot: this.plot,
          posterUrl: this.posterUrl,
        });
      } else {
        this.$refs.form.validate();
      }
    },
  },
};
</script>

<style scoped>
.addMovieFields {
  padding-left: 3%;
  padding-right: 3%;
}
</style>