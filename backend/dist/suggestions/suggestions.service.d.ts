import { CreateSuggestionDto } from './dto/create-suggestion.dto';
import { Suggestion } from './entities/suggestion.entity';
import { Repository } from 'typeorm';
import { ProverbeSuggered } from '../proverbes/entities/proverbe_suggered.entity';
export declare class SuggestionsService {
    private readonly suggestionRepository;
    private readonly proverbeSuggeredRepository;
    constructor(suggestionRepository: Repository<Suggestion>, proverbeSuggeredRepository: Repository<ProverbeSuggered>);
    create(createSuggestionDto: CreateSuggestionDto): Promise<CreateSuggestionDto & Suggestion>;
    findAll(): Promise<Suggestion[]>;
    accept(id: number): Promise<Suggestion>;
    remove(id: number): Promise<import("typeorm").DeleteResult>;
}
