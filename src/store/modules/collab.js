import axios from "axios";

const state = {
    collabs: {},
    loading:true,
    total:0,
    card:{},
    loading_card:true,
    initial_card:{},
    initial_loading_card:true
};

const getters = {};

const actions = {
    getCollabs({ commit, state }, props) {
        commit("setLoading", true);
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencer-collabs?type=detail&filter[influencer_date_between]=" + props.date_between).then(response => {
            commit("setCollabs", response.data);
            commit("setLoading", false);
        });
    },
    getInitialCard({ commit, state }, props) {
        commit("setLoadingCards", true);
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencer-collabs?type=card&from=" + props.from + "&to=" + props.to).then(response => {
            commit("setInitialCard", response.data);
            commit("setLoadingInitialCard", false);
        });
    },
    getCard({ commit, state }, props) {
        commit("setLoadingCards", true);
        axios.get(process.env.VUE_APP_BACKEND_ROUTE + "api/v1/influencer-collabs?type=card&from=" + props.from + "&to=" + props.to).then(response => {
            commit("setCard", response.data);
            commit("setLoadingCard", false);
        });
    },
};

const mutations = {
    setCollabs(state, data) {
        state.collabs = data.data;
        state.total = data.meta.total;
    },
    setLoading(state, data) {
        state.loading = data
    },
    setCard(state, data) {
        state.card = data
    },
    setLoadingCards(state, data) {
        state.loading_card = data
    },
    setInitialCard(state, data) {
        state.initial_card = data
    },
    setInitialLoadingCards(state, data) {
        state.initial_loading_card = data
    },
};

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
};
