<template>
  <div>
    <h3 class="title has-text-centered has-text-dark">
      {{ title }}
    </h3>
    <div class="box">
      <RememberMe v-if="showRememberMe" :value="rememberMe" />

      <div class="buttons">
        <b-button
          v-for="provider in providers"
          :key="provider.providerType"
          :type="provider.colorType"
          :icon-left="provider.icon"
          expanded
          outlined
          class="has-margin-bottom-15"
          @click="submit(provider.providerType)"
        >
          {{ $t('form.social.loginWith',getLangProviderOption(provider.providerType)) }}
        </b-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'
import { ProviderType } from 'types-module'
import { ProviderConfig, SocialLoginCredentials, StateNamespace } from '~/types'
import { getProviderOption } from '~/service/firebase/firebase-service'
import RememberMe from '~/components/ui/RememberMe.vue'
import { reloadUserFromDatabase } from '~/service/rx-service'

@Component({
  components: { RememberMe }
})
export default class SocialLogin extends Vue {
  @Prop({ type: String, required: true }) title: string
  @Prop({ type: Boolean, required: true }) rememberMe: boolean
  @Prop({ type: Array, required: true }) providers: ProviderConfig[]
  @Prop({ type: Boolean, required: true }) reauthenticate: boolean
  @Prop({ type: Boolean, default: true }) showRememberMe: boolean

  @StateNamespace.auth.Action signInWithSocialProvider: (credentials: SocialLoginCredentials) => Promise<void>;
  @StateNamespace.auth.Action reauthenticateWithSocialProvider: (credentials: SocialLoginCredentials) => Promise<void>;

  @StateNamespace.loading.Action saveLoading: (loading: boolean) => Promise<void>

  get providerType () {
    return ProviderType
  }

  getLangProviderOption (providerType: ProviderType) {
    return getProviderOption(providerType)
  }

  getSocialLoginCredentials (providerType: ProviderType): SocialLoginCredentials {
    return {
      providerType,
      rememberMe: this.rememberMe
    }
  }

  async submit (providerType: ProviderType) {
    await this.saveLoading(true)
      .then(async () => {
        return this.reauthenticate
          ? await this.reauthenticateWithSocialProvider(this.getSocialLoginCredentials(providerType))
          : await this.signInWithSocialProvider(this.getSocialLoginCredentials(providerType))
            .then(() => reloadUserFromDatabase.next())
      })
      .finally(() => this.saveLoading(false))
  }
}
</script>
