import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';

@Injectable()
export class GraphUtils {
  private readonly logger = new Logger(GraphUtils.name);

  handleGraphError(error: AxiosError) {
    if (error.response?.data) {
      const errorMessage = error.response.data as string;
      throw new Error(errorMessage);
    }

    throw error;
  }
}
