<template>
  <div>
    <b-card no-body style="padding: 20px">
            <b-card-body>
              <b-row>
                <b-col
                  cols="12"
                  md="4"
                  class="mb-md-0 mb-2"
                >
                  <v-select
                    v-model="searchOption.label"
                    :dir="$store.state.appConfig.isRTL ? 'rtl' : 'ltr'"
                    :clearable="false"
                    :options="searchOption"
                    :value="searchOption"
                    @change="searchTextChange"
                    placeholder="Filtrar por..."
                  />
                </b-col>
                <b-col
                  cols="12"
                  md="4"
                  class="mb-md-0 mb-2"
                >
              <b-form-input
                min-widht="100"
                class="d-inline-block mr-1"
                placeholder="Pesquisar...."
                v-model="searchQuery"
                :disabled="!searchOption.label ? '' : disabled"
                v-on:input="searchTextChange()"
              />
                </b-col>
                <b-col
                  cols="12"
                  md="4"
                  class="mb-md-0 mb-2"
                >
                <div class="d-flex align-items-center justify-content-end">
                    <b-button
                      class="mr-1"
                      variant="primary"
                      @click="isAddNewUserSidebarActive = true"
                    >
                      <span class="text-nowrap">Novo Usuario</span>
                    </b-button>
                    <b-dropdown id="Exportar" right text="Exportar" variant="primary">
                      <b-dropdown-item href="#" @click="tblDataExport('CSV')">Exportar CSV</b-dropdown-item>
                      <b-dropdown-item href="#" @click="tblDataExport('EXCEL')">Exportar EXCEL</b-dropdown-item>
                      <b-dropdown-item href="#" @click="tblDataExport('PDF')">Exportar PDF</b-dropdown-item>
                    </b-dropdown>
                </div>
                </b-col>
              </b-row>
            </b-card-body>
          </b-card>
    <!-- Table Container Card -->
    <b-card no-body class="mb-0">

      <b-table
        ref="refUserListTable"
        class="position-relative"
        :items="users.userdata"
        responsive
        :fields="tableColumns"
        primary-key="id"
        :sort-by.sync="params.sortBy"
        show-empty
        empty-text="No matching records found"
        :sort-desc.sync="params.isSortDirDesc"
      >
        <!-- Column: User -->
        <template #cell(user)="data">
          <b-media vertical-align="center">
            <template #aside>
              <b-avatar
                size="32"
                :src="data.item.avatar"
                :variant="`light-${resolveUserRoleVariant(data.item.role)}`"
                :to="{ name: 'host-view', params: { id: data.item.id } }"
              />
            </template>
            <b-link
              :to="{ name: 'host-view', params: { id: data.item.id } }"
              class="font-weight-bold d-block text-nowrap"
            >
              {{ data.item.name }}
            </b-link>
            <small class="text-muted">@{{ data.item.name }}</small>
          </b-media>
        </template>

        <!-- Column: Role -->
        <template #cell(role)="data">
          <div class="text-nowrap">
            <feather-icon
              :icon="resolveUserRoleIcon(data.item.role)"
              size="18"
              class="mr-50"
              :class="`text-${resolveUserRoleVariant(data.item.role)}`"
            />
            <span class="align-text-top text-capitalize">{{
              data.item.role
            }}</span>
          </div>
        </template>

        <!-- Column: Status -->
        <template #cell(status)="data">
          <b-badge
            pill
            :variant="`light-${resolveUserStatusVariant(data.item.status)}`"
            class="text-capitalize"
          >
            {{ data.item.status }}
          </b-badge>
        </template>

        <!-- Column: Actions -->
        <template #cell(actions)="data">
          <b-list-group class="list-group-messages text-md-left">
            <b-list-group-item class="button-icon" @click="addnew(data.id)">
              <feather-icon icon="Edit2Icon" size="18" class="mr-75" />
            </b-list-group-item>
            <b-list-group-item class="button-icon" @click="addnew(data.id)">
              <feather-icon icon="Trash2Icon" size="18" class="mr-75" />
            </b-list-group-item>
            <b-list-group-item class="button-icon" @click="addnew(data.id)">
              <feather-icon icon="EyeIcon" size="18" class="mr-75" />
            </b-list-group-item>
            <b-list-group-item class="button-icon" @click="addnew(data.id)">
              <feather-icon icon="CopyIcon" size="18" class="mr-75" />
            </b-list-group-item>
          </b-list-group>
        </template>
      </b-table>
      <div class="mx-2 mb-2">
        <b-row>
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-start"
          >
            <!-- <span class="text-muted"
              >Showing {{ users.dataMeta.from }} to {{ users.dataMeta.to }} of
              {{ users.dataMeta.of }} entries</span
            > -->
          </b-col>
          <!-- Pagination -->
          <b-col
            cols="12"
            sm="6"
            class="d-flex align-items-center justify-content-center justify-content-sm-end"
          >
            <b-pagination
              v-model="users.currentPage"
              :total-rows="users.usersTotal"
              :per-page="users.perPage"
              first-number
              last-number
              class="mb-0 mt-1 mt-sm-0"
              prev-class="prev-item"
              next-class="next-item"
            >
              <template #prev-text>
                <feather-icon icon="ChevronLeftIcon" size="18" />
              </template>
              <template #next-text>
                <feather-icon icon="ChevronRightIcon" size="18" />
              </template>
            </b-pagination>
          </b-col>
        </b-row>
      </div>
    </b-card>
  </div>
</template>

<script>
  import {
    BCard,
    BRow,
    BCol,
    BFormInput,
    BButton,
    BTable,
    BMedia,
    BAvatar,
    BLink,
    BBadge,
    BDropdown,
    BDropdownItem,
    BPagination
  } from "bootstrap-vue";
  import vSelect from "vue-select";
  import store from "@/store";
  import { ref, onUnmounted } from "@vue/composition-api";
  import { avatarText } from "@core/utils/filter";
  import UsersListFilters from "./UsersListFilters.vue";
  import useUsersList from "./useUsersList";
  import userStoreModule from "../../../store/user";
  import UserListAddNew from "./UserListAddNew.vue";
  import jsPDF from 'jspdf';
  import 'jspdf-autotable';
  import CsvExportor from 'csv-exportor';

  export default {
    components: {
      UsersListFilters,
      UserListAddNew,
      BCard,
      BRow,
      BCol,
      BFormInput,
      BButton,
      BTable,
      BMedia,
      BAvatar,
      BLink,
      BBadge,
      BDropdown,
      BDropdownItem,
      BPagination,
      vSelect
    },

    setup(){
      const roleOptions = [
        { label: 'Admin', value: 'admin' },
        { label: 'Author', value: 'author' },
        { label: 'Editor', value: 'editor' },
        { label: 'Maintainer', value: 'maintainer' },
        { label: 'Subscriber', value: 'subscriber' },
      ]
    },

    data() {
      return {
        users: {
          originaldata: [
 {
              name:"Paulie Durber",
              contrato: "(397) 294-5153",
              Pais: "USA",
              Whatsapp: "company",
              email: "admin@gmail.pl",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "bkrabbe1d"
            }, {
              name:"Saunder Offner",
              contrato: "(397) 124-5153",
              Pais: "BR",
              Whatsapp: "company",
              email: "yuri@hotmail.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "member"
            }, {
              name:"Onfre Wind",
              contrato: "(397) 094-4325",
              Pais: "JP",
              Whatsapp: "(397) 094-4325",
              email: "money@gmail.com",
              id: 50,
              role: "writer",
              status: "active",
              currentPlan: "professional"
            }, {
              name:"Karena Courtliff",
              contrato: "(397) 890-2134",
              Pais: "RU",
              Whatsapp: "(397) 890-2134",
              email: "Jhon@yandex.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "owner",
              status: "active",
              currentPlan: "basic"
            },{
              name:"Paulie Durber",
              contrato: "(397) 294-5153",
              Pais: "USA",
              Whatsapp: "company",
              email: "admin@gmail.pl",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "bkrabbe1d"
            }, {
              name:"Saunder Offner",
              contrato: "(397) 124-5153",
              Pais: "BR",
              Whatsapp: "company",
              email: "yuri@hotmail.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "member"
            }, {
              name:"Onfre Wind",
              contrato: "(397) 094-4325",
              Pais: "JP",
              Whatsapp: "(397) 094-4325",
              email: "money@gmail.com",
              id: 50,
              role: "writer",
              status: "active",
              currentPlan: "professional"
            }, {
              name:"Karena Courtliff",
              contrato: "(397) 890-2134",
              Pais: "RU",
              Whatsapp: "(397) 890-2134",
              email: "Jhon@yandex.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "owner",
              status: "active",
              currentPlan: "basic"
            },{
              name:"Paulie Durber",
              contrato: "(397) 294-5153",
              Pais: "USA",
              Whatsapp: "company",
              email: "admin@gmail.pl",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "bkrabbe1d"
            }, {
              name:"Saunder Offner",
              contrato: "(397) 124-5153",
              Pais: "BR",
              Whatsapp: "company",
              email: "yuri@hotmail.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "member"
            }, {
              name:"Onfre Wind",
              contrato: "(397) 094-4325",
              Pais: "JP",
              Whatsapp: "(397) 094-4325",
              email: "money@gmail.com",
              id: 50,
              role: "writer",
              status: "active",
              currentPlan: "professional"
            }, {
              name:"Karena Courtliff",
              contrato: "(397) 890-2134",
              Pais: "RU",
              Whatsapp: "(397) 890-2134",
              email: "Jhon@yandex.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "owner",
              status: "active",
              currentPlan: "basic"
            }
          ],
          userdata: [
            {
              name:"Paulie Durber",
              contrato: "(397) 294-5153",
              Pais: "USA",
              Whatsapp: "company",
              email: "admin@gmail.pl",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "bkrabbe1d"
            }, {
              name:"Saunder Offner",
              contrato: "(397) 124-5153",
              Pais: "BR",
              Whatsapp: "company",
              email: "yuri@hotmail.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "member"
            }, {
              name:"Onfre Wind",
              contrato: "(397) 094-4325",
              Pais: "JP",
              Whatsapp: "(397) 094-4325",
              email: "money@gmail.com",
              id: 50,
              role: "writer",
              status: "active",
              currentPlan: "professional"
            }, {
              name:"Karena Courtliff",
              contrato: "(397) 890-2134",
              Pais: "RU",
              Whatsapp: "(397) 890-2134",
              email: "Jhon@yandex.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "owner",
              status: "active",
              currentPlan: "basic"
            },{
              name:"Paulie Durber",
              contrato: "(397) 294-5153",
              Pais: "USA",
              Whatsapp: "company",
              email: "admin@gmail.pl",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "bkrabbe1d"
            }, {
              name:"Saunder Offner",
              contrato: "(397) 124-5153",
              Pais: "BR",
              Whatsapp: "company",
              email: "yuri@hotmail.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "member"
            }, {
              name:"Onfre Wind",
              contrato: "(397) 094-4325",
              Pais: "JP",
              Whatsapp: "(397) 094-4325",
              email: "money@gmail.com",
              id: 50,
              role: "writer",
              status: "active",
              currentPlan: "professional"
            }, {
              name:"Karena Courtliff",
              contrato: "(397) 890-2134",
              Pais: "RU",
              Whatsapp: "(397) 890-2134",
              email: "Jhon@yandex.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "owner",
              status: "active",
              currentPlan: "basic"
            },{
              name:"Paulie Durber",
              contrato: "(397) 294-5153",
              Pais: "USA",
              Whatsapp: "company",
              email: "admin@gmail.pl",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "bkrabbe1d"
            }, {
              name:"Saunder Offner",
              contrato: "(397) 124-5153",
              Pais: "BR",
              Whatsapp: "company",
              email: "yuri@hotmail.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "editor",
              status: "active",
              currentPlan: "member"
            }, {
              name:"Onfre Wind",
              contrato: "(397) 094-4325",
              Pais: "JP",
              Whatsapp: "(397) 094-4325",
              email: "money@gmail.com",
              id: 50,
              role: "writer",
              status: "active",
              currentPlan: "professional"
            }, {
              name:"Karena Courtliff",
              contrato: "(397) 890-2134",
              Pais: "RU",
              Whatsapp: "(397) 890-2134",
              email: "Jhon@yandex.com",
              fullName: "Beverlie Krabbe",
              id: 50,
              role: "owner",
              status: "active",
              currentPlan: "basic"
            }
          ],
          perPage: null,
          currentePage: null,
          usersTotal: null
        },

        params: {
          selectedSearchOption:"",
          searchQuery: "",
          sortBy: "id",
          isSortDirDesc: ""
        },

        searchOption: [
          { label: "Descrição", code: "description" },
          { label: "Email", code: "description" },
          { label: "Role", code: "description" },
          { label: "Plataforma", code: "description" }
        ],

        tableColumns: [
          { key: "user", sortable: true },
          { key: "email", sortable: true },
          { key: "contrato", sortable: true },
          { key: "Pais", sortable: true },
          { key: "Whatsapp", sortable: true },
          { key: "role", sortable: true },
          {
            key: "currentPlan",
            label: "Plan",
            // formatter: title,
            sortable: true
          },
          { key: "status", sortable: true },
          { key: "actions" }
        ]
      };
    },

    mounted() {
      this.$store
        .dispatch("user/fetchUsers")
        .then(response => {
          // this.users.userdata = response.data.data;
          this.users.perPage = response.data.per_page;
          this.users.currentePage = response.data.current_page;
          this.users.usersTotal = response.data.total;
        })
        .catch();
    },

    methods: {
      getUsers() {
        this.$store.dispatch("user/fetchUsers");
      },

      resolveUserRoleVariant() {
        return "primary";
      },

      resolveUserRoleIcon() {
        return "UserIcon";
      },

      resolveUserStatusVariant() {
        return "primary";
      },

      searchTextChange(){
        var temp = this.users.originaldata;
        var key = this.searchOption.label.label;
        key = key === "Descrição"? "name": key;

        var result = temp.filter((ele) => {
          return ele[key.toLowerCase()].includes(this.searchQuery);
        })

        this.users.userdata = result;
      },

      tblDataExport(flag){
        let rows = [];
        let name = 'userslist_' + this.getCurrentDate();
        let columnHeader = ['User', 'Email', 'Contrato', 'Pais', 'Whatsapp', 'Role', 'Plan', 'Status'];
        this.users.userdata.map(data => {
          var temp = [
            data.name || '', 
            data.email || '',
            data.contrato || '', 
            data.Pais || '', 
            data.Whatsapp || '', 
            data.role,
            data.currentPlan,
            data.status
          ];
          rows.push(temp);
        })
        if(flag === 'PDF'){
            var doc = new jsPDF();
            doc.autoTable(columnHeader, rows, { startY: 10 });
            doc.save(name + '.pdf');
        }else if(flag === "EXCEL"){

          import('./exportExcel').then(excel => {
            excel.export_json_to_excel({
              header: columnHeader,
              data: rows,
              filename: name,
              autoWidth: true,
              bookType: 'xlsx'
            })
          })

        }else if(flag === "CSV"){

          CsvExportor.downloadCsv(
            rows,
            { header: columnHeader }, 
            name+'.csv'
          )

        }
      },

      getCurrentDate(){
        var today = new Date();
        var dd = String(today.getDate()).padStart(2, '0');
        var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        var yyyy = today.getFullYear();

        return(mm + '/' + dd + '/' + yyyy);
      }
    }
  };
</script>

<style lang="scss" scoped>
.per-page-selector {
  width: 90px;
}
.button-icon {
  cursor: pointer;
}
</style>

<style lang="scss">
@import "@core/scss/vue/libs/vue-select.scss";
</style>