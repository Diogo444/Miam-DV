import { ProverbesService } from './proverbes.service';
import { CreateProverbeDto } from './dto/create-proverbe.dto';
import { UpdateProverbeDto } from './dto/update-proverbe.dto';
export declare class ProverbesController {
    private readonly proverbesService;
    constructor(proverbesService: ProverbesService);
    create(createProverbeDto: CreateProverbeDto): string;
    findAll(): string;
    findOne(id: string): string;
    update(id: string, updateProverbeDto: UpdateProverbeDto): string;
    remove(id: string): string;
}
