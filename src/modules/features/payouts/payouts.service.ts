import { Repository } from 'typeorm'

import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'

import { CreatePayoutDestinationDto } from './dto/create-payout-destination.dto'
import { CreatePayoutDto } from './dto/create-payout.dto'
import {
  PaginatedPayoutDestinationsDto,
  PaginationParamsDto,
} from './dto/list-payout-destinations.dto'
import { PayoutDestination } from './entities/payout-destination.entity'
import { Payout } from './entities/payout.entity'

@Injectable()
export class PayoutsService {
  constructor(
    @InjectRepository(PayoutDestination)
    private payoutDestinationRepository: Repository<PayoutDestination>,
    @InjectRepository(Payout)
    private payoutRepository: Repository<Payout>,
  ) {}

  async createPayoutDestination(
    payload: CreatePayoutDestinationDto,
    userId: string,
  ): Promise<PayoutDestination> {
    return this.payoutDestinationRepository.save({ ...payload, userId })
  }

  async findPayoutDestinations(destinationId: string, userId: string) {
    return this.payoutDestinationRepository.find({
      where: {
        id: destinationId,
        userId,
      },
    })
  }

  async listPayoutDestinations(
    userId: string,
    { page = 1, limit = 10 }: PaginationParamsDto = {},
  ): Promise<PaginatedPayoutDestinationsDto> {
    const [data, total] = await this.payoutDestinationRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
      relations: ['wallet', 'user'],
    })

    const lastPage = Math.ceil(total / limit)

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
        limit,
      },
    }
  }

  async createPayout(payload: CreatePayoutDto, userId: string): Promise<Payout> {
    return this.payoutRepository.save({ ...payload, userId })
  }

  async listPayouts(userId: string, { page = 1, limit = 10 }: PaginationParamsDto = {}) {
    const [data, total] = await this.payoutRepository.findAndCount({
      where: { userId },
      order: { createdAt: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    })

    const lastPage = Math.ceil(total / limit)

    return {
      data,
      meta: {
        total,
        page,
        lastPage,
        limit,
      },
    }
  }

  async getPayout(id: string, userId: string) {
    return this.payoutRepository.findOne({
      where: { id, userId },
    })
  }
}
