
<template>
  <basic-container>
    <iframe :src="'/jimu/jmreport/list?token='+access_token" frameborder="0" width="100%" style="height: 70vh;"></iframe>
  </basic-container>
</template>

<script>
import { delObj, fetchList, onlineFile } from "@/api/admin/file";
import { tableOption } from "@/const/crud/admin/file";
import { mapGetters } from "vuex";
import AvueIframe from "@/components/iframe/main";

export default {
  name: "jimu",
  components: {AvueIframe},
  data() {
    return {

    };
  },
  computed: {
    ...mapGetters(["access_token"]),
  },
  methods: {
  }
};
</script>
