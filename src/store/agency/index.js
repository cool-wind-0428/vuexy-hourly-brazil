import axios from '@axios'

export default {
    namespaced: true,

    state: {
        id_agency: []
    },

    mutations: {
        setAgencyId(state, data) {
            state.id_agency = data
        }
    },
    actions: {
        async getAgencyId({ commit }) {
            const data = await axios.get('agency');

            commit('setAgencyId', data);

            return data;
        }
    },
}