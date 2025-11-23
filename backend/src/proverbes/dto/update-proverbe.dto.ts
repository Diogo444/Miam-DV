import { PartialType } from '@nestjs/mapped-types';
import { CreateProverbeDto } from './create-proverbe.dto';

export class UpdateProverbeDto extends PartialType(CreateProverbeDto) {}
