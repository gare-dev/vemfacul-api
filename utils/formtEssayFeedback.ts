function formatRedacaoFeedback(apiResponse: string): string {
    // Remove asteriscos de negrito e listas
    let text = apiResponse.replace(/\*\*(.*?)\*\*/g, '$1'); // remove negrito
    text = text.replace(/^\s*\*\s*/gm, '- '); // transforma bullets "*" em "-"

    // Remove múltiplos espaços e quebras de linha extras
    text = text.replace(/\n{2,}/g, '\n\n');
    text = text.trim();

    return text;
}

export default formatRedacaoFeedback