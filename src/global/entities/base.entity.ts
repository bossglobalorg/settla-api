import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export abstract class BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({
    type: 'timestamp with time zone',
    name: 'date_created',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateCreated: Date;

  @UpdateDateColumn({
    type: 'timestamp with time zone',
    name: 'date_updated',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dateUpdated: Date;
}
