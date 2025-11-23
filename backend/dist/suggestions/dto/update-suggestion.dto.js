"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSuggestionDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_suggestion_dto_1 = require("./create-suggestion.dto");
class UpdateSuggestionDto extends (0, mapped_types_1.PartialType)(create_suggestion_dto_1.CreateSuggestionDto) {
}
exports.UpdateSuggestionDto = UpdateSuggestionDto;
//# sourceMappingURL=update-suggestion.dto.js.map