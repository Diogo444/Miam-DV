import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { Suggestion } from './entities/suggestion.entity';
import { Repository } from 'typeorm';
import { Proverbe } from 'src/proverbes/entities/proverbe.entity';
export declare class SuggestionsService {
    private readonly suggestionRepository;
    private readonly proverbeRepository;
    constructor(suggestionRepository: Repository<Suggestion>, proverbeRepository: Repository<Proverbe>);
    create(createSuggestionDto: CreateSuggestionDto): Promise<CreateSuggestionDto & Suggestion>;
    findAll(): Promise<Suggestion[]>;
    accept(id: number): Promise<Suggestion>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
