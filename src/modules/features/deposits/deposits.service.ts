import { GraphService } from 'src/modules/providers/graph/graph.service'

import { Injectable } from '@nestjs/common'

@Injectable()
export class DepositsService {
  constructor(private readonly graphService: GraphService) {}

  async createDeposit(deposit: any) {
    // const user = await this.graphService.getUser(deposit.userId)
  }
}
