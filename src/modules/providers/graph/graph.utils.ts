import { AxiosError } from 'axios'

import { Injectable, Logger } from '@nestjs/common'

interface UserAddress {
  line1: string
  line2?: string | null
  city: string
  state: string
  country: string
  postalCode: string
}

@Injectable()
export class GraphUtils {
  private readonly logger = new Logger(GraphUtils.name)

  handleGraphError(error: AxiosError) {
    if (error.response?.data) {
      const errorMessage = error.response.data as string
      throw new Error(errorMessage)
    }

    throw error
  }

  formatAddress(address: UserAddress | null | undefined) {
    if (!address) return {}

    return {
      line1: address.line1,
      line2: address.line2,
      city: address.city,
      state: address.state,
      country: address.country,
      postal_code: address.postalCode, // Rename here
    }
  }
}
