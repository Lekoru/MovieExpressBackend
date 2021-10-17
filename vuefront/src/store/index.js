import Vue from "vue";
import Vuex from "vuex";
import { MovieService } from "../service";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    isLoading: false,
    addMovieBtn: false,
    loadMovieErrorMsg: {},
    loadMovieError: false,
    movies: [],
    fixgen: [],
    movieAlertType: "",
    addMovieMsg: "",
    addMovieStatus: false,
  },
  mutations: {
    setMovie(state, movie) {
      state.movies = movie;
    },
    setFixgen(state, gens) {
      state.fixgen = gens;
    },
    setMovieBtn(state, status) {
      state.addMovieBtn = status;
    },
    setIsLoadingMovies(state, status) {
      state.isLoading = status;
    },
    setMovieERROR(state, status) {
      state.loadMovieError = status;
    },
    setMovieErrorMSG(state, msg) {
      state.loadMovieErrorMsg = msg;
    },
    setMovieAlertType(state, type) {
      state.movieAlertType = type;
    },
    setAddMovieMsg(state, msg) {
      state.addMovieMsg = msg;
    },
    setAddMovieStatus(state, status) {
      state.addMovieStatus = status;
    },
  },
  actions: {
    setMovieBtn(context, status) {
      context.commit("setMovieBtn", status);
    },
    async SET_MOVIES(context, payload) {
      context.commit("setIsLoadingMovies", true);
      context.commit("setMovie", []);
      context.commit("setMovieERROR", false);
      context.commit("setMovieErrorMSG", {});
      try {
        context.commit(
          "setMovie",
          await MovieService.getMovies(payload.duration, payload.genres)
        );
      } catch (error) {
        context.commit("setMovieERROR", true);
        context.commit("setMovieErrorMSG", error.response.data.error);
      } finally {
        context.commit("setIsLoadingMovies", false);
      }
    },
    async SET_GENRES(context) {
      context.commit("setFixgen", await MovieService.getGenres());
    },
    async ADD_MOVIE(context, payload) {
      context.commit("setAddMovieStatus", false);
      context.commit("setAddMovieMsg", "");
      context.commit("setMovieAlertType", "");
      try {
        await MovieService.addMovie(
          payload.title,
          payload.addMovieGen,
          payload.year,
          payload.runtime,
          payload.director,
          payload.actors,
          payload.plot,
          payload.posterUrl
        );
        context.commit("setAddMovieStatus", true);
        context.commit("setAddMovieMsg", "Movie successfully added");
        context.commit("setMovieAlertType", "success");
      } catch (error) {
        context.commit("setAddMovieStatus", true);
        context.commit("setAddMovieMsg", error.response.data.error);
        context.commit("setMovieAlertType", "error");
      }
    },
  },
  modules: {},
  getters: {},
});
