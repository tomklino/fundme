<template>
  <div>
    <v-card v-if="challenges.length">
      <v-list class="challengesList">
        <v-list-tile
          v-for="challenge in challenges"
          :key="challenge.title"
          avatar
          @click=""
        >
          <v-list-tile-action>
            <v-icon v-if="challenge.challenge_type === 'Feature'" color="cyan 100">star</v-icon>
            <v-icon v-if="challenge.challenge_type === 'Bug'" color="lime 500">bug_report</v-icon>
          </v-list-tile-action>

          <v-list-tile-content>
            <v-list-tile-title v-text="challenge.name"></v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-content>
            <div class="pledgedSum">30$</div>
          </v-list-tile-content>
          <v-btn depressed color="info" @click="pledgeDialog = true; challenge_to_pledge = challenge">
            Pledge
          </v-btn>
        </v-list-tile>
      </v-list>
    </v-card>
    <v-dialog v-model="pledgeDialog" max-width="600">
      <v-card>
        <v-card-title class="headline">Pledge to {{challenge_to_pledge.name}}</v-card-title>
        <v-form ref="form" v-model="valid" class="pledgeForm">
            <div class="sumContainer">
              <v-text-field
                class="pledgeField pledgeSum"
                type="number"
                v-model="pledge_amount"
                required>
              </v-text-field>
              <div class="currency">USD</div>
          </div>
            <v-spacer></v-spacer>
            <div>Pay via</div>
            <v-card-actions>
              <v-btn>Coupon Wallet</v-btn>
              <v-btn disabled>Paypal</v-btn>
              <v-btn disabled>Stripe</v-btn>
            </v-card-actions>
        </v-form>
    </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { CHALLENGE_QUERY, ASSIGN_CHALLENGE_TO_USER } from '@/graphql'

export default {
  name: 'ChallengeList',
  mounted () {
    console.log("ChallengeList mounted")
    this.fetchChallenges();
  },
  data () {
    return {
      challenges: [],
      pledge_amount: 2,
      pledgeDialog: false,
      challenge_to_pledge: { name: "" }
    }
  },
  methods: {
    fetchChallenges(event) {
      this.$apollo.query({
        query: CHALLENGE_QUERY,
        variables: {
          project_id: this.$route.params['project_id']
        }
      }).then(({ data }) => {
        console.log(JSON.stringify(data))
        this.challenges = data.challenges;
      })
    },
    assignToMe(id) {
      this.$apollo.mutate({
        mutation: ASSIGN_CHALLENGE_TO_USER,
        variables: {
          challenge_id: id,
          assignee: this.$root.$data.user_id
        },
        awaitRefetchQueries: true,
        refetchQueries: [{
          query: CHALLENGE_QUERY,
          variables: {
            project_id: this.$route.params.project_id
          }
        }]
      }).then((data) => {
        console.log("assigned to user:", data)
        this.fetchChallenges()
      })
    }
  }
}
</script>

<style scoped>
  .pledgedSum {
    width: 100%;
    text-align: right;
    padding-right: 11px;
  }

  .challengesList{
    margin-top: 20px;
  }

  .pledgeForm {
    width: 600px;
    padding: 20px;
  }

  .sumContainer {
    display: flex;
  }

  .pledgeSum {
    width: 100px;
    flex: 1;
  }

.currency {
    flex: 5;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    text-indent: 12px;
  }

</style>
